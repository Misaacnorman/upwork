# Deploy Firestore / Storage rules (service account key must stay out of git).
# App Hosting: connect https://github.com/Misaacnorman/upwork and set App root to the repo root (not `web`);
# rollouts use root apphosting.yaml, package.json (workspaces), and Procfile.
# Optional CLI rollout (after backend exists): firebase deploy --only apphosting:upwork-web --project upwork-b253c
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$key = Join-Path $root "upwork Servive account key.json"
if (-not (Test-Path -LiteralPath $key)) {
  Write-Error "Service account file not found: $key"
}
$env:GOOGLE_APPLICATION_CREDENTIALS = $key
Set-Location $root
Write-Host "Deploying Firestore + Storage rules..."
npx --yes firebase-tools@13 deploy --only firestore:rules,storage --project upwork-b253c
