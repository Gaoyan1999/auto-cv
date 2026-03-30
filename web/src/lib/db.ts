import { DEFAULT_RESUME } from '@/constants/defaultResume';
import type {
  PersistedAppState,
  PersistedSnapshot,
  ResumeRecord,
} from '@/types/app';

const DB_NAME = 'job-resume-agent';
const DB_VERSION = 2;
const STORE = 'kv';

const KEY_SNAPSHOT_V1 = 'snapshot';
const KEY_STATE_V2 = 'state-v2';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
  });
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result as T | undefined);
  });
}

async function idbPut<T>(key: string, value: T): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).put(value, key);
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).delete(key);
  });
}

function newId(): string {
  return crypto.randomUUID();
}

function migrateV1ToV2(snap: PersistedSnapshot): PersistedAppState {
  const id = newId();
  const rec: ResumeRecord = {
    id,
    name: 'resume.md',
    description: '',
    body: snap.resume ?? DEFAULT_RESUME,
    jd: snap.jd ?? '',
    analysis: snap.analysis,
    suggestions: snap.suggestions ?? [],
    suggestionStatus: snap.suggestionStatus ?? {},
    updatedAt: Date.now(),
  };
  return { version: 2, resumes: [rec] };
}

function defaultState(): PersistedAppState {
  return {
    version: 2,
    resumes: [
      {
        id: newId(),
        name: 'resume.md',
        description: '',
        body: DEFAULT_RESUME,
        jd: '',
        analysis: null,
        suggestions: [],
        suggestionStatus: {},
        updatedAt: Date.now(),
      },
    ],
  };
}

export async function loadAppState(): Promise<PersistedAppState> {
  try {
    const v2 = await idbGet<PersistedAppState>(KEY_STATE_V2);
    if (v2 && v2.version === 2 && Array.isArray(v2.resumes)) {
      return v2;
    }

    const v1 = await idbGet<PersistedSnapshot>(KEY_SNAPSHOT_V1);
    if (v1 && v1.version === 1) {
      const migrated = migrateV1ToV2(v1);
      await saveAppState(migrated);
      await idbDelete(KEY_SNAPSHOT_V1);
      return migrated;
    }
  } catch {
    /* fall through */
  }

  return defaultState();
}

export async function saveAppState(state: PersistedAppState): Promise<void> {
  try {
    await idbPut(KEY_STATE_V2, state);
  } catch {
    /* ignore */
  }
}
