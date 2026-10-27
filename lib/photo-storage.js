const DB_NAME = "wedding-photo-dump";
const DB_VERSION = 1;
const STORE = "photos";

/** Fallback when IndexedDB is unavailable (e.g. strict private mode). */
const memoryStore = new Map();

export function createPhotoId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      /* insecure context — http://LAN-IP, etc. */
    }
  }
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function isImageFile(file) {
  if (!file) return false;
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif|avif|tiff?)$/i.test(
    file.name || ""
  );
}

function useMemoryOnly() {
  if (typeof indexedDB === "undefined") return true;
  return false;
}

let memoryOnly = null;

function openDb() {
  if (memoryOnly === true) {
    return Promise.reject(new Error("memory-only"));
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => {
      memoryOnly = true;
      reject(request.error);
    };
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("category", "category", { unique: false });
      }
    };
  });
}

function getFromMemory(category) {
  return [...memoryStore.values()]
    .filter((r) => r.category === category)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getPhotosByCategory(category) {
  if (useMemoryOnly()) return getFromMemory(category);
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const index = tx.objectStore(STORE).index("category");
      const request = index.getAll(category);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const rows = request.result || [];
        rows.sort((a, b) => b.createdAt - a.createdAt);
        resolve(rows);
      };
    });
  } catch {
    return getFromMemory(category);
  }
}

export async function savePhoto({ category, file }) {
  const id = createPhotoId();
  const buffer = await file.arrayBuffer();
  const record = {
    id,
    category,
    name: file.name,
    mimeType: file.type || guessMimeType(file.name),
    createdAt: Date.now(),
    data: buffer,
  };

  if (useMemoryOnly()) {
    memoryStore.set(id, record);
    return record;
  }

  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const request = tx.objectStore(STORE).put(record);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(record);
    });
  } catch {
    memoryStore.set(id, record);
    return record;
  }
}

export async function deletePhoto(id) {
  memoryStore.delete(id);
  if (useMemoryOnly()) return;

  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const request = tx.objectStore(STORE).delete(id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch {
    /* already removed from memory */
  }
}

function guessMimeType(name) {
  const lower = (name || "").toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "image/heic";
  return "image/jpeg";
}

export function blobUrlFromRecord(record) {
  const blob = new Blob([record.data], { type: record.mimeType });
  return URL.createObjectURL(blob);
}
