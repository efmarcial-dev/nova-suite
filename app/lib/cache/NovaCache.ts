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
    }
}

let dbPromise: Promise<IDBPDatabase<NovaCacheDBD>>;

export function initNovaCache() {
    if (!dbPromise) {
        dbPromise = openDB<NovaCacheDBD>('NovaCacheDB', 4, {
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
            }
        });
    }

    return dbPromise;
}
