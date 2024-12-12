import { Router } from "express";
import Vocabulary from "../../models/vocabulary.js";
const router = Router();

router.post('/vocabularies', async (req, res) => {
    try {
        const vocabulary = new Vocabulary(req.body);
        await vocabulary.save();
        res.status(201).json(vocabulary);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/vocabularies', async (req, res) => {
    try {
        const filter = req.query.lessonNo ? { lessonNo: req.query.lessonNo } : {};
        const vocabularies = await Vocabulary.find(filter);
        res.status(200).json(vocabularies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/vocabularies/:id', async (req, res) => {
    try {
        const vocabulary = await Vocabulary.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vocabulary) return res.status(404).json({ error: 'Vocabulary not found' });
        res.status(200).json(vocabulary);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/vocabularies/:id', async (req, res) => {
    try {
        const vocabulary = await Vocabulary.findByIdAndDelete(req.params.id);
        if (!vocabulary) return res.status(404).json({ error: 'Vocabulary not found' });
        res.status(200).json({ message: 'Vocabulary deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
