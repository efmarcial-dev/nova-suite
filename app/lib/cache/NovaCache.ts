import {openDB, DBSchema, IDBPDatabase} from 'idb';

// 1. Define the DB schema
interface NovaCacheDBD extends DBSchema {
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
            assignee: string;
            assigneeUrl?: string;
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
            assignee: number; // assignee id (number)
        }
    };
    assignees: {
        key:  string;
        value: {
            id: string;
            name: string;
            avatarUrl?: string;
            last_updated?: number
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
        dbPromise = openDB<NovaCacheDBD>('NovaCacheDB', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('tasks')){
                    db.createObjectStore('tasks', {keyPath: 'id'});
                }
                if (!db.objectStoreNames.contains('projects')){
                    db.createObjectStore('projects', {keyPath: 'id'});
                }
                if (!db.objectStoreNames.contains('assignees')){
                    db.createObjectStore('assignees', {keyPath: 'id'});
                }
                if (!db.objectStoreNames.contains('analytics')){
                    db.createObjectStore('analytics', {keyPath: 'id'});
                }
            }
        });
    }

    return dbPromise;
}