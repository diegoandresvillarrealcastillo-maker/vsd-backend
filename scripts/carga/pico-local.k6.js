import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';
import crypto from 'k6/crypto';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = 'http://localhost:3000';

if (__ENV.BASE_URL && __ENV.BASE_URL !== BASE_URL) {
  throw new Error('This test only supports http://localhost:3000');
}

for (const name of [
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'ALL_PROXY',
  'http_proxy',
  'https_proxy',
  'all_proxy',
]) {
  if (__ENV[name]) {
    throw new Error('Remove proxy configuration before running: ' + name);
  }
}

const rssLimitMB = Number(__ENV.RSS_LIMIT_MB || 1024);

if (!Number.isFinite(rssLimitMB) || rssLimitMB <= 0) {
  throw new Error('RSS_LIMIT_MB must be a positive number');
}

const serverRss = new Trend('server_rss_mb');
const serverHeap = new Trend('server_heap_mb');
const finalRssGrowth = new Trend('final_rss_growth_mb');
const functionalErrors = new Rate('functional_errors');

export const options = {
  hosts: {
    localhost: '127.0.0.1',
  },
  maxRedirects: 0,
  discardResponseBodies: true,
  setupTimeout: '30s',
  teardownTimeout: '60s',

  scenarios: {
    recurring_users: {
      executor: 'ramping-vus',
      startVUs: 5,
      gracefulRampDown: '10s',
      stages: [
        { duration: '10s', target: 5 },
        { duration: '2s', target: 100 },
        { duration: '45s', target: 100 },
        { duration: '3s', target: 5 },
        { duration: '15s', target: 5 },
        { duration: '2s', target: 100 },
        { duration: '45s', target: 100 },
        { duration: '3s', target: 0 },
      ],
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.01'],
    functional_errors: ['rate==0'],
    'http_req_duration{operation:write}': ['p(95)<3000'],
    'http_req_duration{operation:export}': ['p(95)<10000'],
    server_rss_mb: ['max<' + rssLimitMB],
    final_rss_growth_mb: ['max<256'],
  },
};

function parseJson(response) {
  try {
    return response.json();
  } catch {
    return null;
  }
}

function measureMemory() {
  const response = http.get(BASE_URL + '/__qa/metrics', {
    redirects: 0,
    responseType: 'text',
    timeout: '5s',
    tags: { operation: 'memory' },
  });

  const memory = parseJson(response);

  if (
    response.status !== 200 ||
    !memory ||
    !Number.isFinite(memory.rss) ||
    !Number.isFinite(memory.heapUsed)
  ) {
    exec.test.abort('The local server memory endpoint is unavailable');
  }

  const rssMB = memory.rss / 1048576;

  serverRss.add(rssMB);
  serverHeap.add(memory.heapUsed / 1048576);

  return rssMB;
}

function uuid() {
  const bytes = new Uint8Array(crypto.randomBytes(16));

  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;

  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
}

export function setup() {
  const response = http.get(BASE_URL + '/__qa/status', {
    redirects: 0,
    responseType: 'text',
    timeout: '5s',
  });

  const status = parseJson(response);

  if (response.status !== 200 || status?.laboratory !== 'vsd-k6-local-v1' || status.users !== 100) {
    exec.test.abort('Start the isolated local test server first');
  }

  return {
    initialRssMB: measureMemory(),
  };
}

export default function () {
  const userId = exec.vu.idInTest;
  const iteration = exec.vu.iterationInScenario;

  if (userId < 1 || userId > 100) {
    exec.test.abort('Only the 100 prepared test users are supported');
  }

  const headers = {
    Authorization: 'Bearer qa-user-' + userId,
    'Content-Type': 'application/json',
  };

  if (iteration % 3 !== 2) {
    const payload = JSON.stringify({
      clientOperationId: uuid(),
      dia: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      titulo: 'Synthetic load user ' + userId,
      contenido: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Synthetic local load data. '.repeat(160),
              },
            ],
          },
        ],
      },
    });

    const parameters = {
      headers,
      redirects: 0,
      timeout: '15s',
      responseType: 'text',
      tags: { operation: 'write' },
    };

    const response = http.post(BASE_URL + '/api/diario', payload, parameters);

    const saved = parseJson(response);

    const written = check(response, {
      'diary entry created': () => response.status === 201 && typeof saved?.id === 'string',
    });

    functionalErrors.add(!written);

    // Se repite la misma operacion y se exige el mismo recibo.
    if (iteration % 10 === 0 && written) {
      const retry = http.post(BASE_URL + '/api/diario', payload, parameters);

      const idempotent = check(retry, {
        'retry returns the same entry': () =>
          retry.status === 201 && parseJson(retry)?.id === saved.id,
      });

      functionalErrors.add(!idempotent);
    }
  } else {
    const response = http.get(BASE_URL + '/api/cuenta/exportacion', {
      headers,
      redirects: 0,
      timeout: '30s',
      responseType: 'none',
      tags: { operation: 'export' },
    });

    const exported = check(response, {
      'export transfer succeeds': () => response.status === 200 && response.error_code === 0,
      'export has JSON content type': () =>
        String(response.headers['Content-Type']).includes('application/json'),
    });

    functionalErrors.add(!exported);
  }

  if (userId === 1 && iteration % 5 === 0) {
    measureMemory();
  }

  sleep(0.2 + Math.random() * 0.3);
}

export function teardown(data) {
  try {
    let finalRssMB = data.initialRssMB;

    // Se observa la recuperacion sin forzar el recolector de basura.
    for (let second = 0; second < 30; second++) {
      sleep(1);
      finalRssMB = measureMemory();
    }

    finalRssGrowth.add(Math.max(0, finalRssMB - data.initialRssMB));

    console.log(
      JSON.stringify({
        initialRssMB: data.initialRssMB,
        finalRssMB,
      }),
    );
  } finally {
    http.post(BASE_URL + '/__qa/stop', null, {
      redirects: 0,
      timeout: '5s',
    });
  }
}

export function handleSummary(data) {
  return {
    'resumen-k6-local.json': JSON.stringify(data, null, 2),
    stdout: 'Results: resumen-k6-local.json\n' + 'Backend memory samples: ram-local.csv\n',
  };
}
