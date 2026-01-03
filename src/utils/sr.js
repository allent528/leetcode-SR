/**
 * Interview Prep Spaced Repetition Algorithm
 * Simplified schedule: New -> 3d -> 7d -> 14d -> 30d -> 60d
 * 
 * @param {object} params
 * @param {number} params.interval - Current interval in days
 * @param {number} params.repetitions - Current streak (level)
 * @param {number} quality - 3=Hard(Reset), 4=Good, 5=Easy(Bonus?)
 * 
 * @returns {object} { interval, repetitions, easeFactor }
 */

// The "Ideal" Interview Application Schedule
const SCHEDULE = [1, 3, 7, 14, 30, 60];

export const calculateNextReview = ({ repetitions }, quality) => {
    let nextRepetitions;
    let nextInterval;

    // "Hard" (3) -> Reset progress (or drop back)
    // In this simplified view, let's say "Hard" means you forgot, so reset to Day 1 review.
    if (quality === 3) {
        nextRepetitions = 0;
        nextInterval = 1;
    }
    // "Good" (4) or "Easy" (5) -> Advance level
    else {
        // Bonus: If Easy (5), skip a level (Speed Bonus)
        const bonus = quality === 5 ? 2 : 1;
        nextRepetitions = repetitions + bonus;

        // Cap at the end of the schedule
        if (nextRepetitions >= SCHEDULE.length) {
            nextInterval = SCHEDULE[SCHEDULE.length - 1]; // Max out at 60 days
        } else {
            nextInterval = SCHEDULE[nextRepetitions];
        }
    }

    return {
        interval: nextInterval,
        repetitions: nextRepetitions,
        easeFactor: 2.5 // Unused in this simple version, kept for schema compatibility
    };
};

/**
 * Helper to get the actual Date object for the next due date
 * @param {number} daysToAdd 
 * @returns {number} Timestamp
 */
export const getNextDueDateTimestamp = (daysToAdd) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Date.now() + (daysToAdd * oneDay);
};
