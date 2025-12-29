
const STORAGE_KEY = 'leetcode_sr_questions';

export const getQuestions = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveQuestions = (questions) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
};

export const addQuestion = (name) => {
    const questions = getQuestions();

    // Basic duplicate check
    if (questions.some(q => q.name.toLowerCase() === name.toLowerCase())) {
        throw new Error('Question already exists!');
    }

    const newQuestion = {
        id: crypto.randomUUID(),
        name,
        addedAt: Date.now(),
        // SM-2 Initial State
        nextDueDate: Date.now(), // Due immediately (or tomorrow depending on preference)
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
    };

    questions.push(newQuestion);
    saveQuestions(questions);
    return newQuestion;
};
