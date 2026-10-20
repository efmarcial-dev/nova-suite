export class ProviderReconnectRequiredError extends Error {
  readonly code = 'reconnect_required';

  constructor(message: string) {
    super(message);
    this.name = 'ProviderReconnectRequiredError';
  }
}

export async function throwProviderApiError(response: Response, fallback: string): Promise<never> {
  const body = await response.json().catch(() => ({}));
  const message = body.detail || body.message || fallback;

  if (body.code === 'reconnect_required') {
    throw new ProviderReconnectRequiredError(message);
  }

  throw new Error(message);
}
