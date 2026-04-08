import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import type { User } from 'firebase/auth'
import { db, firebaseReady, storage } from '../firebase'

const ACCEPT =
  '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

type Props = {
  user: User
}

export function DocumentUpload({ user }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  if (!firebaseReady || !db || !storage) {
    return null
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fs = db
    const st = storage
    if (!fs || !st) return
    if (!file) {
      setMessage('Select a Word document (.doc or .docx).')
      setStatus('error')
      return
    }
    setStatus('uploading')
    setMessage(null)
    try {
      const safeName = file.name.replace(/[^\w.-]+/g, '_')
      const path = `submissions/${user.uid}/${Date.now()}_${safeName}`
      const storageRef = ref(st, path)
      await uploadBytes(storageRef, file, { contentType: file.type || undefined })
      const downloadURL = await getDownloadURL(storageRef)
      await addDoc(collection(fs, 'submissions'), {
        userId: user.uid,
        fileName: file.name,
        storagePath: path,
        downloadURL,
        note: note.trim() || null,
        createdAt: serverTimestamp(),
        status: 'received',
      })
      setStatus('done')
      setMessage('Received. Our team will review within 1–2 business days.')
      setFile(null)
      setNote('')
      ;(e.target as HTMLFormElement).reset()
    } catch (err: unknown) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Upload failed.')
    }
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-3 text-left dark:border-stone-700 dark:bg-stone-900">
      <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Document intake</h2>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Upload a Word file. Encrypted in transit; access limited to your account.
      </p>
      <form className="mt-2 space-y-2" onSubmit={onSubmit}>
        <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-300">
          File (.doc / .docx)
          <input
            type="file"
            accept={ACCEPT}
            required
            className="mt-0.5 block w-full text-xs text-stone-600 file:mr-2 file:rounded file:border-0 file:bg-stone-100 file:px-2 file:py-1 file:text-xs file:font-medium file:text-stone-800 hover:file:bg-stone-200 dark:text-stone-400 dark:file:bg-stone-800 dark:file:text-stone-200"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-300">
          Note <span className="font-normal text-stone-400">optional</span>
          <textarea
            rows={2}
            className="mt-0.5 w-full resize-y rounded border border-stone-300 bg-white px-2 py-1.5 text-xs text-stone-900 outline-none focus:border-stone-500 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Matter ID, deadline, or special instructions"
          />
        </label>
        {message ? (
          <p
            className={
              status === 'error'
                ? 'text-xs text-red-600 dark:text-red-400'
                : 'text-xs text-emerald-700 dark:text-emerald-400'
            }
            role={status === 'error' ? 'alert' : 'status'}
          >
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === 'uploading'}
          className="w-full rounded bg-stone-900 py-2 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        >
          {status === 'uploading' ? 'Uploading…' : 'Submit document'}
        </button>
      </form>
    </section>
  )
}
