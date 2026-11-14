param(
  [ValidateRange(128, 16384)]
  [int]$RssLimitMB = 1024
)

$ErrorActionPreference = 'Stop'

$k6Path = (Get-Command k6 -CommandType Application -ErrorAction Stop).Source

$startInfo = [System.Diagnostics.ProcessStartInfo]::new()
$startInfo.FileName = $k6Path
$startInfo.UseShellExecute = $false
$startInfo.CreateNoWindow = $true
$startInfo.WorkingDirectory = (Get-Location).Path

# No se heredan proxies, salidas a la nube ni ajustes de otra prueba.
$startInfo.Environment.Clear()

foreach ($name in @(
  'PATH',
  'SystemRoot',
  'TEMP',
  'TMP',
  'USERPROFILE',
  'APPDATA',
  'LOCALAPPDATA'
)) {
  $value = [Environment]::GetEnvironmentVariable($name)

  if ($value) {
    $startInfo.Environment[$name] = $value
  }
}

$startInfo.Environment['K6_NO_USAGE_REPORT'] = 'true'
$startInfo.Environment['RSS_LIMIT_MB'] = [string]$RssLimitMB

foreach ($argument in @(
  'run',
  '--no-usage-report',
  '--config',
  (Join-Path $PSScriptRoot 'k6.local.json'),
  '--out',
  'json=metricas-k6-local.json',
  (Join-Path $PSScriptRoot 'pico-local.k6.js')
)) {
  $startInfo.ArgumentList.Add($argument)
}

$process = [System.Diagnostics.Process]::Start($startInfo)
$process.WaitForExit()

exit $process.ExitCode
