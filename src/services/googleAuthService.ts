// Implements client-side Google OAuth 2.0 (Implicit Flow)

const OAUTH_SCOPE = 'https://www.googleapis.com/auth/books';

/**
 * Initiates the Google Sign-In process by redirecting the user.
 * @param clientId The Google Cloud OAuth 2.0 Client ID.
 */
export const signIn = (clientId: string) => {
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  const form = document.createElement('form');
  form.setAttribute('method', 'GET');
  form.setAttribute('action', oauth2Endpoint);

  const params = {
    'client_id': clientId,
    'redirect_uri': window.location.origin + window.location.pathname,
    'response_type': 'token',
    'scope': OAUTH_SCOPE,
    'include_granted_scopes': 'true',
    'state': 'pass-through-value' // Can be used for security purposes
  };

  for (const p in params) {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', (params as any)[p]);
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
};

/**
 * Checks the URL for an OAuth 2.0 access token after a redirect.
 * Should be called when the application loads.
 * @returns The access token string if found, otherwise null.
 */
export const handleAuthRedirect = (): string | null => {
  const fragment = window.location.hash.substring(1);
  const params = new URLSearchParams(fragment);
  const accessToken = params.get('access_token');
  
  return accessToken || null;
};
