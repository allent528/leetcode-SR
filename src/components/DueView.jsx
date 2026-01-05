import React, { useEffect, useState } from 'react';
import { getQuestions, updateQuestion } from '../utils/storage';
import { calculateNextReview, getNextDueDateTimestamp } from '../utils/sr';

export default function DueView() {
    const [dueQuestions, setDueQuestions] = useState([]);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false); // In a real app, this might show hints/solutions

    const loadDueQuestions = async () => {
        const allQuestions = await getQuestions();
        const now = Date.now();
        // Filter questions due now or in the past
        // Also include questions that are due strictly "Updated Today" if we were doing date-only check
        // But timestamp check is fine for now.
        const due = allQuestions.filter(q => {
            const dueTime = new Date(q.nextDueDate).getTime();
            const dueDate = new Date(q.nextDueDate);
            const today = new Date();
            return dueTime <= today.getTime() || dueDate.toDateString() === today.toDateString();
        });
        setDueQuestions(due);
        setCurrentReviewIndex(0);
        setShowAnswer(false);
    };

    useEffect(() => {
        loadDueQuestions();
        window.addEventListener('storage-update', loadDueQuestions);
        return () => window.removeEventListener('storage-update', loadDueQuestions);
    }, []);

    const handleRate = async (quality) => {
        const question = dueQuestions[currentReviewIndex];
        if (!question) return;

        // Calculate new params
        const { interval, repetitions, easeFactor } = calculateNextReview(question, quality);
        const nextDueDate = getNextDueDateTimestamp(interval);

        // Save
        await updateQuestion(question._id || question.id, {
            interval,
            repetitions,
            easeFactor,
            nextDueDate
        });

        // Move to next
        // Slicing the array is better so we don't re-review the same one instantly
        const remaining = dueQuestions.filter(q => (q._id || q.id) !== (question._id || question.id));
        setDueQuestions(remaining);

        // Adjust index if necessary
        if (currentReviewIndex >= remaining.length) {
            setCurrentReviewIndex(Math.max(0, remaining.length - 1));
        }

        // Reset state
        setShowAnswer(false);
    };

    const handleNext = () => {
        if (currentReviewIndex < dueQuestions.length - 1) {
            setCurrentReviewIndex(prev => prev + 1);
            setShowAnswer(false);
        }
    };

    const handlePrev = () => {
        if (currentReviewIndex > 0) {
            setCurrentReviewIndex(prev => prev - 1);
            setShowAnswer(false);
        }
    };

    if (dueQuestions.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉 All Caught Up!</h2>
                <p className="subheading">No questions pending review for today.</p>
                <button className="btn" onClick={() => window.location.reload()}>Refresh</button>
            </div>
        );
    }

    const currentQuestion = dueQuestions[currentReviewIndex];

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <p style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                {currentReviewIndex + 1} of {dueQuestions.length} questions to review
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Left Arrow */}
                <button
                    onClick={handlePrev}
                    disabled={currentReviewIndex === 0}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: currentReviewIndex === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                        fontSize: '2rem',
                        cursor: currentReviewIndex === 0 ? 'default' : 'pointer',
                        padding: '0 1rem',
                        userSelect: 'none'
                    }}
                >
                    &lsaquo;
                </button>

                <div className="card" style={{ flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                        {currentQuestion.name}
                    </h2>

                    {!showAnswer ? (
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAnswer(true)}
                            style={{ minWidth: '200px' }}
                        >
                            Show Controls
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem', width: '100%' }}>
                            <button
                                className="btn"
                                style={{ backgroundColor: '#ef4444', color: 'white', flex: 1 }}
                                onClick={() => handleRate(3)} // Hard / Forgot
                            >
                                Hard (1d)
                            </button>
                            <button
                                className="btn"
                                style={{ backgroundColor: '#eab308', color: 'black', flex: 1 }}
                                onClick={() => handleRate(4)} // Good
                            >
                                Good
                            </button>
                            <button
                                className="btn"
                                style={{ backgroundColor: '#22c55e', color: 'white', flex: 1 }}
                                onClick={() => handleRate(5)} // Easy
                            >
                                Easy
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={handleNext}
                    disabled={currentReviewIndex === dueQuestions.length - 1}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: currentReviewIndex === dueQuestions.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                        fontSize: '2rem',
                        cursor: currentReviewIndex === dueQuestions.length - 1 ? 'default' : 'pointer',
                        padding: '0 1rem',
                        userSelect: 'none'
                    }}
                >
                    &rsaquo;
                </button>
            </div>
        </div>
    );
}
