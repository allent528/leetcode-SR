
const STORAGE_KEY = 'leetcode_sr_questions';

export const getQuestions = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveQuestions = (questions) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    // Dispatch a custom event so tabs can react to changes immediately
    window.dispatchEvent(new Event('storage-update'));
};

export const addQuestion = (name) => {
    const questions = getQuestions();

    if (questions.some(q => q.name.toLowerCase() === name.toLowerCase())) {
        throw new Error('Question already exists!');
    }

    const newQuestion = {
        id: crypto.randomUUID(),
        name,
        addedAt: Date.now(),
        nextDueDate: Date.now(), // Due Immediately
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
    };

    questions.push(newQuestion);
    saveQuestions(questions);
    return newQuestion;
};

export const updateQuestion = (id, updates) => {
    const questions = getQuestions();
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
        questions[index] = { ...questions[index], ...updates };
        saveQuestions(questions);
    }
};

export const deleteQuestion = (id) => {
    const questions = getQuestions();
    const newQuestions = questions.filter(q => q.id !== id);
    saveQuestions(newQuestions);
};
