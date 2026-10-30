export interface EmailInboxSessionRecord {
  key: string;
  userId: string;
  cachedAt: number;
  [key: string]: any;
}

const inboxes = new Map<string, EmailInboxSessionRecord>();

export function getEmailInboxForSession(key: string) {
  return inboxes.get(key);
}

export function saveEmailInboxForSession(record: EmailInboxSessionRecord) {
  inboxes.set(record.key, record);
}

export function clearEmailInboxSession() {
  inboxes.clear();
}
