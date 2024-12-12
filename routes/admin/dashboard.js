import Lesson from "../../models/lesson.js";
import Tutorial from "../../models/tutorials.js";
import UserModel from "../../models/user.js";
import Vocabulary from "../../models/vocabulary.js";
import { Router } from "express";

const router = Router();

const getDashboardSummary = async (req, res) => {
    try {
        const [
            totalUsers,
            totalLessons,
            totalTutorials,
            totalVocabulary,
            recentUsers,
            vocabularyByLesson
        ] = await Promise.all([
            UserModel.countDocuments(),
            Lesson.countDocuments(),
            Tutorial.countDocuments(),
            Vocabulary.countDocuments(),
            UserModel.find().sort({ date: -1 }).limit(5).select('name email avatar date'),
            Vocabulary.aggregate([
                { 
                    $group: { 
                        _id: '$lessonNo', 
                        vocabularyCount: { $sum: 1 } 
                    } 
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        const userRoleDistribution = await UserModel.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        res.json({
            totalUsers,
            totalLessons,
            totalTutorials,
            totalVocabulary,
            recentUsers,
            userRoleDistribution,
            vocabularyByLesson
        });
    } catch (error) {
        console.error('Dashboard Summary Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

router.get('/dashboard', getDashboardSummary);

export default router