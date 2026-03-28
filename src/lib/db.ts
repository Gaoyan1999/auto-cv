import type { PersistedSnapshot } from '../types/app'

const DB_NAME = 'job-resume-agent'
const DB_VERSION = 1
const STORE = 'kv'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
  })
}

const KEY = 'snapshot'

export async function loadSnapshot(): Promise<PersistedSnapshot | null> {
  try {
    const db = await openDb()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const store = tx.objectStore(STORE)
      const req = store.get(KEY)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => {
        const v = req.result as PersistedSnapshot | undefined
        resolve(v ?? null)
      }
    })
  } catch {
    return null
  }
}

export async function saveSnapshot(snapshot: PersistedSnapshot): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.objectStore(STORE).put(snapshot, KEY)
  })
}
