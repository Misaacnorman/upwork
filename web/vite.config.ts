import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

type WebAppConfig = {
  apiKey?: string
  authDomain?: string
  projectId?: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
}

function parseFirebaseWebAppConfig(): WebAppConfig | null {
  const raw = process.env.FIREBASE_WEBAPP_CONFIG
  if (!raw?.trim()) return null
  try {
    return JSON.parse(raw) as WebAppConfig
  } catch {
    return null
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const fb = parseFirebaseWebAppConfig()

  const pairs: [string, keyof WebAppConfig][] = [
    ['VITE_FIREBASE_API_KEY', 'apiKey'],
    ['VITE_FIREBASE_AUTH_DOMAIN', 'authDomain'],
    ['VITE_FIREBASE_PROJECT_ID', 'projectId'],
    ['VITE_FIREBASE_STORAGE_BUCKET', 'storageBucket'],
    ['VITE_FIREBASE_MESSAGING_SENDER_ID', 'messagingSenderId'],
    ['VITE_FIREBASE_APP_ID', 'appId'],
  ]

  const define: Record<string, string> = {}
  for (const [viteKey, fbKey] of pairs) {
    if (env[viteKey]) continue
    const v = fb?.[fbKey]
    if (v != null && v !== '') {
      define[`import.meta.env.${viteKey}`] = JSON.stringify(String(v))
    }
  }

  return {
    plugins: [tailwindcss(), react()],
    ...(Object.keys(define).length ? { define } : {}),
  }
})
