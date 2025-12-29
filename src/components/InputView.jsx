import React, { useState } from 'react';
import { addQuestion } from '../utils/storage';

export default function InputView() {
    const [questionName, setQuestionName] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!questionName.trim()) return;

        try {
            addQuestion(questionName.trim());
            setMessage({ type: 'success', text: `Added "${questionName}" to your tracking list.` });
            setQuestionName('');

            // Auto-clear success message after 3s
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    return (
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 className="heading" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Add New Question</h2>
            <p className="subheading">Track a new problem to start your spaced repetition journey.</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label" htmlFor="questionName">Question Name</label>
                    <input
                        id="questionName"
                        type="text"
                        className="input"
                        placeholder="e.g. Two Sum"
                        value={questionName}
                        onChange={(e) => setQuestionName(e.target.value)}
                        autoFocus
                    />
                </div>

                {message.text && (
                    <div style={{
                        padding: '10px',
                        borderRadius: '6px',
                        marginBottom: '1rem',
                        backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                        color: message.type === 'error' ? '#fca5a5' : '#86efac',
                        fontSize: '0.9rem'
                    }}>
                        {message.text}
                    </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Start Tracking
                </button>
            </form>
        </div>
    );
}
