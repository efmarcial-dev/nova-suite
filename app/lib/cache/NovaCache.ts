import {openDB, DBSchema, IDBPDatabase} from 'idb';

// 1. Define the DB schema
interface NovaCacheDBD extends DBSchema {
    user: {
        key: string; // User ID
        value: {
            id: string;
            first_name: string;
            last_name: string;
            email: string;
            role: string;
            date_joined: string;
            last_login: string;
            avatarUrl?: string;
            last_updated?: string; // timestamp for cache management
        }
    },
    tasks: {
        key: string; // Task ID
        value: {
            id: number;
            title: string;
            urgency: string;
            confidence: number;
            tags: string[];
            status: string;
            projectId: string;
            reasoning?: string;
            due_date?: string;
            lastUpdated: number;
        }
    };
    projects: {
        key: string;
        value: {
            id: string;
            title: string;
            description: string;
            status: string;
            created?: string;
            last_updated?: number;
        }
    };
    analytics: {
        key: string;
        value: {
            id: string;
            data: any;
            updatedAt: string;
        }
    };
    emailInboxes: {
        key: string;
        value: {
            key: string;
            userId: string;
            cachedAt: number;
            [key: string]: any;
        }
    };
}

let dbPromise: Promise<IDBPDatabase<NovaCacheDBD>> | undefined;
let cacheRetryAfter = 0;

export function initNovaCache() {
    if (!dbPromise && Date.now() < cacheRetryAfter) {
        return Promise.reject(new Error('NovaCacheDB is temporarily unavailable.'));
    }
    if (!dbPromise) {
        let abandonOpenRequest = false;
        let rejectBlocked: (error: Error) => void = () => undefined;
        const blockedRequest = new Promise<never>((_resolve, reject) => {
            rejectBlocked = reject;
        });
        const openRequest = openDB<NovaCacheDBD>('NovaCacheDB', 5, {
            upgrade(db, _oldVersion, _newVersion, transaction) {
                const nativeDb = db as unknown as IDBDatabase;
                if (nativeDb.objectStoreNames.contains('assignees')) {
                    nativeDb.deleteObjectStore('assignees');
                }
                if (db.objectStoreNames.contains('user') && transaction.objectStore('user').keyPath !== 'id') {
                    // Earlier builds used a different key path. Recreate this store so
                    // writes consistently use the normalized `id` property.
                    const nativeTransaction = transaction as unknown as IDBTransaction;
                    const existingUsers = nativeTransaction.objectStore('user').getAll();
                    existingUsers.onsuccess = () => {
                        const users = existingUsers.result;
                        nativeDb.deleteObjectStore('user');
                        const userStore = nativeDb.createObjectStore('user', { keyPath: 'id' });
                        for (const user of users) {
                            const id = user?.id ?? user?.email;
                            if (id !== undefined && id !== null && String(id).trim()) {
                                userStore.put({ ...user, id: String(id) });
                            }
                        }
                    };
                } else if (!db.objectStoreNames.contains('user')){
                    db.createObjectStore('user', {keyPath: 'id'});
                }
                if (!db.objectStoreNames.contains('tasks')){
                    db.createObjectStore('tasks', {keyPath: 'id'});
                }
                if (!db.objectStoreNames.contains('projects')){
                    db.createObjectStore('projects', {keyPath: 'id'});
                }
                if (!db.objectStoreNames.contains('analytics')){
                    db.createObjectStore('analytics', {keyPath: 'id'});
                }
                if (!db.objectStoreNames.contains('emailInboxes')) {
                    db.createObjectStore('emailInboxes', { keyPath: 'key' });
                }
            },
            blocked() {
                abandonOpenRequest = true;
                rejectBlocked(new Error('NovaCacheDB upgrade is blocked by another open tab.'));
            },
            blocking() {
                // Let another tab complete its version upgrade instead of holding
                // the shared database connection open indefinitely.
                void dbPromise?.then((db) => db.close()).catch(() => undefined);
                dbPromise = undefined;
            },
        }).catch((error) => {
            // Keep a failed upgrade from poisoning every later cache attempt.
            dbPromise = undefined;
            throw error;
        });

        // A stale tab can block the v4 -> v5 upgrade indefinitely. The cache is
        // optional, so blocked opens fail fast and other opens have a short limit.
        let timeoutId: ReturnType<typeof setTimeout>;
        const timeoutRequest = new Promise<never>((_resolve, reject) => {
            timeoutId = setTimeout(() => {
                abandonOpenRequest = true;
                reject(new Error('NovaCacheDB did not open in time; using live APIs.'));
            }, 2000);
        });
        openRequest.then((db) => {
            if (abandonOpenRequest) db.close();
        }).catch(() => undefined);
        dbPromise = Promise.race([openRequest, blockedRequest, timeoutRequest])
            .finally(() => clearTimeout(timeoutId))
            .catch((error) => {
            dbPromise = undefined;
            cacheRetryAfter = Date.now() + 15_000;
            throw error;
        });
    }

    return dbPromise;
}
