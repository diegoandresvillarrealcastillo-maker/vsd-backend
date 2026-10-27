import { afterEach, expect, it, vi } from 'vitest';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from '../../domain/model/Identifier.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import { PrismaActivityResultRepository } from '../repositories/PrismaActivityResultRepository.js';
import { PrismaService } from './PrismaService.js';

const USER_A = 'a1111111-1111-4111-8111-111111111111';
const USER_B = 'b2222222-2222-4222-8222-222222222222';
const OPERATION_ID = 'c3333333-3333-4333-8333-333333333333';
const ACTIVITY_ID = 'd4444444-4444-4444-8444-444444444444';
const NOW = new Date('2026-10-25T12:00:00Z');

afterEach(() => {
  vi.restoreAllMocks();
});

function createResult(id: string): ActivityResult {
  return ActivityResult.create(
    {
      id: new ResultId(id),
      userId: new UserId(USER_A),
      activityId: new ActivityId(ACTIVITY_ID),
      clientOperationId: new ClientOperationId(OPERATION_ID),
      completedAt: NOW,
      dia: '2026-10-25',
    },
    NOW,
  );
}

it('recovers the idempotency winner in a new transaction for the same user', async () => {
  const winner = createResult('e5555555-5555-4555-8555-555555555555');
  const competingResult = createResult('f6666666-6666-4666-8666-666666666666');

  const storedRow = {
    id: winner.id.value,
    idUsuario: USER_A,
    idActividad: ACTIVITY_ID,
    idOperacionCliente: OPERATION_ID,
    idSesion: null,
    puntaje: null,
    nivelOrientativo: null,
    metadata: {},
    fecha: NOW,
    dia: new Date('2026-10-25T00:00:00Z'),
  };

  let releaseWinner!: () => void;
  const winnerAvailable = new Promise<void>((resolve) => {
    releaseWinner = resolve;
  });

  let transactionCount = 0;
  const transactionUsers: string[] = [];
  const findWinner = vi.fn(() => Promise.resolve(storedRow));

  const prisma = {
    comoUsuario(
      userId: string,
      operation: (transaction: unknown) => Promise<unknown>,
    ): Promise<unknown> {
      transactionUsers.push(userId);
      const transactionNumber = ++transactionCount;

      return operation({
        resultado: {
          create: async () => {
            if (transactionNumber === 1) {
              releaseWinner();
              return storedRow;
            }

            await winnerAvailable;

            throw Object.assign(new Error('Simulated unique constraint conflict'), {
              code: 'P2002',
              meta: {
                target: ['id_usuario', 'id_operacion_cliente'],
              },
            });
          },
          findUnique: findWinner,
        },
      });
    },
  };

  const catalog = {
    findById: vi.fn(() => Promise.resolve(null)),
  };

  const repository = new PrismaActivityResultRepository(
    prisma as unknown as PrismaService,
    catalog as unknown as ActivityRepositoryPort,
  );

  const receipts = await Promise.all([repository.save(winner), repository.save(competingResult)]);

  expect(receipts.map((receipt) => receipt.id.value)).toEqual([winner.id.value, winner.id.value]);

  // Two competing writes plus a separate recovery transaction.
  expect(transactionCount).toBe(3);
  expect(transactionUsers).toEqual([USER_A, USER_A, USER_A]);

  expect(findWinner).toHaveBeenCalledOnce();
  expect(findWinner).toHaveBeenCalledWith({
    where: {
      idUsuario_idOperacionCliente: {
        idUsuario: USER_A,
        idOperacionCliente: OPERATION_ID,
      },
    },
  });
});

it('keeps identity and role transaction-local during overlapping user operations', async () => {
  // No connection is opened: $transaction is replaced before use.
  const prisma = new PrismaService('postgresql://qa:qa@127.0.0.1:1/no_connection');

  type TransactionDouble = {
    $queryRaw: ReturnType<typeof vi.fn>;
  };

  const transactions: TransactionDouble[] = [];

  vi.spyOn(prisma, '$transaction').mockImplementation(((
    operation: (transaction: TransactionDouble) => Promise<unknown>,
  ) => {
    const transaction = {
      $queryRaw: vi.fn(() => Promise.resolve([])),
    };

    transactions.push(transaction);
    return operation(transaction);
  }) as unknown as PrismaService['$transaction']);

  let releaseA!: () => void;
  let notifyAStarted!: () => void;

  const aStarted = new Promise<void>((resolve) => {
    notifyAStarted = resolve;
  });

  const holdA = new Promise<void>((resolve) => {
    releaseA = resolve;
  });

  const operationA = prisma.comoUsuario(USER_A, async (transaction) => {
    expect(transaction).toBe(transactions[0]);
    expect(transactions[0]!.$queryRaw).toHaveBeenCalledOnce();

    notifyAStarted();
    await holdA;

    return USER_A;
  });

  await aStarted;

  const operationB = prisma.comoUsuario(USER_B, (transaction) => {
    expect(transaction).toBe(transactions[1]);
    expect(transactions[1]!.$queryRaw).toHaveBeenCalledOnce();

    releaseA();
    return Promise.resolve(USER_B);
  });

  expect(await Promise.all([operationA, operationB])).toEqual([USER_A, USER_B]);

  expect(transactions[0]).not.toBe(transactions[1]);

  for (const [index, userId] of [USER_A, USER_B].entries()) {
    const [template, ...parameters] = transactions[index]!.$queryRaw.mock.calls[0] as unknown as [
      TemplateStringsArray,
      ...unknown[],
    ];

    expect(template.join('?')).toContain("set_config('vsd.usuario_actual', ?, true)");

    expect(template.join('?')).toContain("set_config('vsd.rol_actual', ?, true)");

    expect(parameters).toEqual([userId, 'usuario']);
  }
});
