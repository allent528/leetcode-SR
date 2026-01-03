import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    // Spaced Repetition Fields
    nextDueDate: {
        type: Date,
        default: Date.now,
    },
    interval: {
        type: Number,
        default: 0, // Days
    },
    repetitions: {
        type: Number,
        default: 0,
    },
    easeFactor: {
        type: Number,
        default: 2.5,
    },
    history: [
        {
            date: { type: Date, default: Date.now },
            quality: Number, // 0-5
        }
    ]
}, { timestamps: true });

export default mongoose.model('Question', QuestionSchema);
