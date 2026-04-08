import { spawnSync } from 'node:child_process'
import process from 'node:process'

const port = process.env.PORT || '8080'
const r = spawnSync(
  'npx',
  ['serve', 'dist', '-s', '-l', `tcp://0.0.0.0:${port}`],
  { stdio: 'inherit', shell: true }
)
process.exit(r.status === null ? 1 : r.status)
