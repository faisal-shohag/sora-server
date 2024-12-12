import { Router } from "express";
import Lesson from "../../models/lesson.js";
import Vocabulary from "../../models/vocabulary.js";
import mongoose from "mongoose";

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

router.get('/lessons-with-vocabulary', async (req, res) => {
    try {
        const lessons = await Lesson.aggregate([
            {
                $lookup: {
                    from: 'vocabularies', // Ensure this matches your collection name
                    localField: 'lessonNumber',
                    foreignField: 'lessonNo',
                    as: 'vocabularyCount'
                }
            },
            {
                $addFields: {
                    vocabularyCount: { $size: '$vocabularyCount' }
                }
            },
            {
                $project: {
                    name: 1,
                    lessonNumber: 1,
                    vocabularyCount: 1
                }
            },
            {
                $sort: { lessonNumber: 1 }
            }
        ]);

        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/lessons/:id', async (req, res) => {
    const { id } = req.params;
    const { name, lessonNumber } = req.body;

    try {
        // Validate lesson number uniqueness
        if (lessonNumber) {
            const existingLesson = await Lesson.findOne({ 
                lessonNumber, 
                _id: { $ne: id } 
            });
            if (existingLesson) {
                return res.status(400).json({ message: 'Lesson number already exists' });
            }
        }

        const updatedLesson = await Lesson.findByIdAndUpdate(
            id, 
            { name, lessonNumber },
            { new: true, runValidators: true }
        );

        if (!updatedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.json(updatedLesson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/lessons/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Start a transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Delete the lesson
            const deletedLesson = await Lesson.findByIdAndDelete(id).session(session);

            if (!deletedLesson) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Lesson not found' });
            }

            // Delete associated vocabularies
            await Vocabulary.deleteMany({ lessonNo: deletedLesson.lessonNumber }).session(session);

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            res.json({ message: 'Lesson and associated vocabularies deleted successfully' });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
});


export default router;
