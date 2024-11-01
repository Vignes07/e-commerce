const apiBaseUrl = import.meta.env.VITE_API_URL;

export const fetchSendbirdCredentials = async () => {
    const response = await fetch(`${apiBaseUrl}/sendbird/sendbird-credentials`);
    if (!response.ok) throw new Error("Failed to fetch Sendbird credentials");

    return await response.json();
};

export const issueSessionToken = async (userId) => {
    const response = await fetch(`${apiBaseUrl}/sendbird/issue-session-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to issue session token');
    }
    const data = await response.json();
    return data.token;
};

export const createSendbirdUser = async (userId, nickname) => {
    const response = await fetch(`${apiBaseUrl}/sendbird/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, nickname }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create Sendbird user');
    }
    return await response.json();
};
