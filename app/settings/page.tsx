import { redirect } from 'next/navigation';

export default async function SettingsRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const entries: [string, string][] = [];
  for (const [key, value] of Object.entries(resolvedParams)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v !== undefined) entries.push([key, v]);
      }
    } else if (value !== undefined) {
      entries.push([key, value]);
    }
  }

  const queryString = new URLSearchParams(entries).toString();
  const destination = queryString ? `/dashboard/settings?${queryString}` : '/dashboard/settings';
  redirect(destination);
}
