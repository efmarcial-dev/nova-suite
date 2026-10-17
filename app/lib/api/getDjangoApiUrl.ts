export function getDjangoApiUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured");
    }

    return `${baseUrl}/${path.replace(/^\/+/, "")}`;
}