import { Router } from "express";
import jwt from "jsonwebtoken";
import Lesson from "../../models/lesson.js";

const router = Router();

router.post('/lessons', async (req, res) => {
    try {
        const lesson = new Lesson(req.body);
        await lesson.save();
        res.status(201).json(lesson);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/lessons', async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.status(200).json(lessons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/lessons/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
        res.status(200).json(lesson);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/lessons/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
        res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
