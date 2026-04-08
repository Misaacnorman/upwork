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
      setMessage('Choose a Word document (.doc or .docx).')
      setStatus('error')
      return
    }
    setStatus('uploading')
    setMessage(null)
    try {
      const safeName = file.name.replace(/[^\w.\-]+/g, '_')
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
      setMessage('Your document was uploaded successfully.')
      setFile(null)
      setNote('')
      ;(e.target as HTMLFormElement).reset()
    } catch (err: unknown) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Upload failed.')
    }
  }

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
        Submit a document
      </h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        Upload a Microsoft Word file for processing. Files are stored in your private Firebase Storage
        folder.
      </p>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Word file (.doc / .docx)
          <input
            type="file"
            accept={ACCEPT}
            required
            className="mt-1 block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-900 hover:file:bg-teal-100 dark:text-stone-400 dark:file:bg-teal-950 dark:file:text-teal-100"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Note <span className="font-normal text-stone-500">(optional)</span>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-teal-600 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Instructions or reference for our team"
          />
        </label>
        {message ? (
          <p
            className={
              status === 'error'
                ? 'text-sm text-red-600 dark:text-red-400'
                : 'text-sm text-teal-800 dark:text-teal-200'
            }
            role={status === 'error' ? 'alert' : 'status'}
          >
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === 'uploading'}
          className="w-full rounded-lg bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60 dark:bg-teal-600 dark:hover:bg-teal-500"
        >
          {status === 'uploading' ? 'Uploading…' : 'Upload document'}
        </button>
      </form>
    </section>
  )
}
