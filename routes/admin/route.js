import express from 'express';
import mongoose from 'mongoose';
import Lesson from '../../models/lesson.js';

const router = express.Router();

// Get All Lessons with Vocabulary Count
router.get('/lessons', async (req, res) => {
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

// Create a New Lesson
router.post('/lessons', async (req, res) => {
    const { name, lessonNumber } = req.body;

    try {
        // Check if lesson number already exists
        const existingLesson = await Lesson.findOne({ lessonNumber });
        if (existingLesson) {
            return res.status(400).json({ message: 'Lesson number already exists' });
        }

        const newLesson = new Lesson({ name, lessonNumber });
        const savedLesson = await newLesson.save();
        res.status(201).json(savedLesson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a Lesson
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

// Delete a Lesson
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
        res.status(500).json({ message: error.message });
    }
});

export default router;