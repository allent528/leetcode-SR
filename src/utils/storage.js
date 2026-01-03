
const API_URL = 'http://localhost:5000/questions';

export const getQuestions = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch questions');
        return await response.json();
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const addQuestion = async (name) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add question');
    }

    window.dispatchEvent(new Event('storage-update'));
    return await response.json();
};

export const updateQuestion = async (id, updates) => {
    // Pass 'quality' separately if needed for history, but for now strict update
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update question');

    window.dispatchEvent(new Event('storage-update'));
    return await response.json();
};

export const deleteQuestion = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete question');

    window.dispatchEvent(new Event('storage-update'));
};
