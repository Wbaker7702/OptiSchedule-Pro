const CSRF_TOKEN_ENDPOINT = '/api/csrf-token';

let csrfToken: string | null = null;

export const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) {
    return csrfToken;
  }

  const response = await fetch(CSRF_TOKEN_ENDPOINT, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  if (!response.ok) {
    throw new Error(`Unable to retrieve CSRF token (${response.status}).`);
  }

  const payload = await response.json() as { csrfToken?: unknown };

  if (typeof payload.csrfToken !== 'string' || payload.csrfToken.length === 0) {
    throw new Error('Invalid CSRF token response.');
  }

  csrfToken = payload.csrfToken;
  return csrfToken;
};

export const clearCsrfToken = () => {
  csrfToken = null;
};

export const getCsrfHeaders = async (): Promise<Record<string, string>> => ({
  'X-CSRF-Token': await getCsrfToken()
});
