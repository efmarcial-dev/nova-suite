

export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    date_joined: string;
    last_login: string;
    avatarUrl?: string;
    last_updated?: string; // timestamp for cache management
}