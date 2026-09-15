/**
 * Device identity storage with priority: localStorage > IndexedDB > Cookie.
 * Key includes port so multiple consoles on the same host do not share device_id.
 */
export const DEVICE_ID_STORAGE_KEY = typeof location === "undefined" ? "device_id" : `device_id_${location.port || "default"}`;
const DEVICE_ID_DB_NAME = "nfx-system";
const DEVICE_ID_DB_STORE = "kv";
const DEVICE_ID_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 10;

function getDeviceIdFromLocalStorage(): Nullable<string> {
  try {
    return localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  } catch {
    return null;
  }
}

function setDeviceIdToLocalStorage(deviceId: string): void {
  try {
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  } catch {
    // ignore
  }
}

function getDeviceIdFromCookie(): Nullable<string> {
  try {
    const cookieParts = document.cookie.split(";").map((part) => part.trim());
    const row = cookieParts.find((part) => part.startsWith(`${DEVICE_ID_STORAGE_KEY}=`));
    if (!row) return null;
    const value = decodeURIComponent(row.slice(DEVICE_ID_STORAGE_KEY.length + 1));
    return value.trim() ? value : null;
  } catch {
    return null;
  }
}

function setDeviceIdToCookie(deviceId: string): void {
  try {
    document.cookie = `${DEVICE_ID_STORAGE_KEY}=${encodeURIComponent(deviceId)}; path=/; max-age=${DEVICE_ID_COOKIE_MAX_AGE}; samesite=lax`;
  } catch {
    // ignore
  }
}

function openDeviceIdDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is unavailable"));
      return;
    }
    const request = indexedDB.open(DEVICE_ID_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DEVICE_ID_DB_STORE)) {
        db.createObjectStore(DEVICE_ID_DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"));
  });
}

async function getDeviceIdFromIndexedDB(): Promise<Nullable<string>> {
  try {
    const db = await openDeviceIdDB();
    const value = await new Promise<Nullable<string>>((resolve, reject) => {
      const tx = db.transaction(DEVICE_ID_DB_STORE, "readonly");
      const store = tx.objectStore(DEVICE_ID_DB_STORE);
      const req = store.get(DEVICE_ID_STORAGE_KEY);
      req.onsuccess = () => {
        const result = req.result;
        resolve(typeof result === "string" && result.trim() ? result : null);
      };
      req.onerror = () => reject(req.error ?? new Error("Failed to read IndexedDB"));
      tx.oncomplete = () => db.close();
    });
    return value;
  } catch {
    return null;
  }
}

async function setDeviceIdToIndexedDB(deviceId: string): Promise<void> {
  try {
    const db = await openDeviceIdDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(DEVICE_ID_DB_STORE, "readwrite");
      const store = tx.objectStore(DEVICE_ID_DB_STORE);
      const req = store.put(deviceId, DEVICE_ID_STORAGE_KEY);
      req.onerror = () => reject(req.error ?? new Error("Failed to write IndexedDB"));
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error ?? new Error("IndexedDB write transaction failed"));
    });
  } catch {
    // ignore
  }
}

function createDeviceId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function ensureDeviceIdStorage(): Promise<string> {
  const localStorageDeviceId = getDeviceIdFromLocalStorage();
  if (localStorageDeviceId && localStorageDeviceId.trim()) {
    setDeviceIdToCookie(localStorageDeviceId);
    void setDeviceIdToIndexedDB(localStorageDeviceId);
    return localStorageDeviceId;
  }

  const indexedDBDeviceId = await getDeviceIdFromIndexedDB();
  if (indexedDBDeviceId && indexedDBDeviceId.trim()) {
    setDeviceIdToLocalStorage(indexedDBDeviceId);
    setDeviceIdToCookie(indexedDBDeviceId);
    return indexedDBDeviceId;
  }

  const cookieDeviceId = getDeviceIdFromCookie();
  if (cookieDeviceId && cookieDeviceId.trim()) {
    setDeviceIdToLocalStorage(cookieDeviceId);
    void setDeviceIdToIndexedDB(cookieDeviceId);
    return cookieDeviceId;
  }

  const deviceId = createDeviceId();
  setDeviceIdToLocalStorage(deviceId);
  setDeviceIdToCookie(deviceId);
  await setDeviceIdToIndexedDB(deviceId);
  return deviceId;
}
