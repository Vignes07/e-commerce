const apiBaseUrl = import.meta.env.VITE_API_URL;

/**
 * Fetches Sendbird credentials (appId).
 */
export const fetchSendbirdCredentials = async () => {
    const response = await fetch(`${apiBaseUrl}/api/sendbird-credentials`);
    if (!response.ok) throw new Error("Failed to fetch Sendbird credentials");
    return response.json();
};

/**
 * Issues a session token for a specific user ID.
 */
export const issueSessionToken = async (userId) => {
    const response = await fetch(`${apiBaseUrl}/sendbird/issue-session-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to issue session token');
    return data.token;
};
