import React, { useEffect, useState } from 'react';
import { getQuestions, deleteQuestion } from '../utils/storage';

export default function ListView() {
    const [questions, setQuestions] = useState([]);

    const loadQuestions = async () => {
        const data = await getQuestions();
        // Sort by due date (soonest first)
        data.sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));
        setQuestions(data);
    };

    useEffect(() => {
        loadQuestions();

        // Listen for updates from other tabs
        window.addEventListener('storage-update', loadQuestions);
        return () => window.removeEventListener('storage-update', loadQuestions);
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Stop tracking this question?')) {
            await deleteQuestion(id);
            loadQuestions(); // Force re-render
        }
    };

    const getStatus = (dueDate) => {
        const now = Date.now();
        if (dueDate <= now) return { text: 'Due', color: 'var(--accent-blue)' }; // or red/yellow?

        const diffHours = (dueDate - now) / (1000 * 60 * 60);
        if (diffHours < 24) return { text: 'Tomorrow', color: 'var(--text-secondary)' };

        const days = Math.round(diffHours / 24);
        return { text: `In ${days}d`, color: 'var(--text-secondary)' };
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '0' }}>
            {/* Table Header */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 1fr) 120px 80px',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                fontWeight: '600',
                color: 'var(--text-secondary)'
            }}>
                <div>Problem</div>
                <div>Status</div>
                <div style={{ textAlign: 'right' }}>Action</div>
            </div>

            {/* List Items */}
            {questions.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No questions added yet. Go to the "Add" tab.
                </div>
            ) : (
                questions.map(q => {
                    const status = getStatus(q.nextDueDate);
                    return (
                        <div key={q.id} style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(200px, 1fr) 120px 80px',
                            padding: '1rem 1.5rem',
                            borderBottom: '1px solid var(--border-color)',
                            alignItems: 'center',
                            fontSize: '0.95rem'
                        }}>
                            <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{q.name}</div>
                            <div style={{ color: status.color, fontSize: '0.9rem', fontWeight: '500' }}>
                                {/* Badge style */}
                                <span style={{
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    padding: '4px 8px',
                                    borderRadius: '4px'
                                }}>
                                    {status.text}
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <button
                                    onClick={() => handleDelete(q.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        padding: '4px'
                                    }}
                                    title="Delete"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
