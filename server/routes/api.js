import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// GET all questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find().sort({ nextDueDate: 1 });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new question
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        // Duplicate check
        const existing = await Question.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ message: 'Question already exists' });
        }

        const question = new Question({
            name,
            // SR defaults handled by Schema
        });

        const newQuestion = await question.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE question
router.delete('/:id', async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Question' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH update question (Review)
router.patch('/:id', async (req, res) => {
    try {
        const { interval, repetitions, easeFactor, nextDueDate } = req.body;

        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            {
                interval,
                repetitions,
                easeFactor,
                nextDueDate,
                $push: { history: { quality: req.body.quality, date: new Date() } }
            },
            { new: true }
        );

        res.json(updatedQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
