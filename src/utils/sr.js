/**
 * SuperMemo-2 (SM-2) Algorithm Implementation
 * 
 * @param {object} params
 * @param {number} params.interval - Current interval in days
 * @param {number} params.repetitions - Current repetition count
 * @param {number} params.easeFactor - Current ease factor
 * @param {number} quality - 0-5 rating (we will map UI buttons to this: Hard=3, Good=4, Easy=5)
 * 
 * @returns {object} { interval, repetitions, easeFactor }
 */
export const calculateNextReview = ({ interval, repetitions, easeFactor }, quality) => {
    let nextInterval;
    let nextRepetitions;
    let nextEaseFactor;

    if (quality >= 3) {
        // Correct response
        if (repetitions === 0) {
            nextInterval = 1;
        } else if (repetitions === 1) {
            nextInterval = 6;
        } else {
            nextInterval = Math.round(interval * easeFactor);
        }
        nextRepetitions = repetitions + 1;
    } else {
        // Incorrect response (reset)
        nextRepetitions = 0;
        nextInterval = 1;
    }

    // Update Ease Factor
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    nextEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (nextEaseFactor < 1.3) nextEaseFactor = 1.3;

    return {
        interval: nextInterval,
        repetitions: nextRepetitions,
        easeFactor: nextEaseFactor
    };
};

/**
 * Helper to get the actual Date object for the next due date
 * @param {number} daysToAdd 
 * @returns {number} Timestamp
 */
export const getNextDueDateTimestamp = (daysToAdd) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to start of day? Or keep exact time? 
    // Let's keep strict 24h intervals for now, or just add days.
    const oneDay = 24 * 60 * 60 * 1000;
    return Date.now() + (daysToAdd * oneDay);
};
