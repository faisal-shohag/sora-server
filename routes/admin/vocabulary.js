import express from 'express';
import Vocabulary  from '../../models/vocabulary.js';


const router = express.Router();

// Get Vocabularies with Optional Lesson Number Filtering
router.get('/vocabularies', async (req, res) => {
    try {
        // Extract lesson number from query parameters
        const { lessonNo } = req.query;

        // Build query object
        const query = lessonNo ? { lessonNo: parseInt(lessonNo) } : {};

        // Fetch vocabularies with optional filtering
        const vocabularies = await Vocabulary.find(query)
            .sort({ lessonNo: 1, word: 1 }) // Sort by lesson number and then alphabetically
            .lean(); // Convert to plain JavaScript objects for better performance

        res.json(vocabularies);
    } catch (error) {
        console.error('Error fetching vocabularies:', error);
        res.status(500).json({ 
            message: 'Error fetching vocabularies', 
            error: error.message 
        });
    }
});

// Create a New Vocabulary
router.post('/vocabularies', async (req, res) => {
    try {
        const { 
            word, 
            pronunciation, 
            meaning, 
            whenToSay, 
            lessonNo 
        } = req.body;

        // Validate required fields
        if (!word || !pronunciation || !meaning || !whenToSay || !lessonNo) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new vocabulary entry
        const newVocabulary = new Vocabulary({
            word,
            pronunciation,
            meaning,
            whenToSay,
            lessonNo,
            adminEmail: req.user.email // Assuming you have authentication middleware
        });

        // Save the vocabulary
        const savedVocabulary = await newVocabulary.save();

        res.status(201).json(savedVocabulary);
    } catch (error) {
        console.error('Error creating vocabulary:', error);
        
        // Check for duplicate word in the same lesson
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'A vocabulary with this word already exists in the lesson' 
            });
        }

        res.status(500).json({ 
            message: 'Error creating vocabulary', 
            error: error.message 
        });
    }
});

// Update a Vocabulary
router.put('/vocabularies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            word, 
            pronunciation, 
            meaning, 
            whenToSay, 
            lessonNo 
        } = req.body;

        // Validate required fields
        if (!word || !pronunciation || !meaning || !whenToSay || !lessonNo) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find and update the vocabulary
        const updatedVocabulary = await Vocabulary.findByIdAndUpdate(
            id, 
            {
                word,
                pronunciation,
                meaning,
                whenToSay,
                lessonNo
            },
            { 
                new: true,  // Return the updated document
                runValidators: true  // Run model validations
            }
        );

        if (!updatedVocabulary) {
            return res.status(404).json({ message: 'Vocabulary not found' });
        }

        res.json(updatedVocabulary);
    } catch (error) {
        console.error('Error updating vocabulary:', error);
        
        // Check for duplicate word in the same lesson
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'A vocabulary with this word already exists in the lesson' 
            });
        }

        res.status(500).json({ 
            message: 'Error updating vocabulary', 
            error: error.message 
        });
    }
});

// Delete a Vocabulary
router.delete('/vocabularies/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the vocabulary
        const deletedVocabulary = await Vocabulary.findByIdAndDelete(id);

        if (!deletedVocabulary) {
            return res.status(404).json({ message: 'Vocabulary not found' });
        }

        res.json({ 
            message: 'Vocabulary deleted successfully',
            deletedVocabulary 
        });
    } catch (error) {
        console.error('Error deleting vocabulary:', error);
        res.status(500).json({ 
            message: 'Error deleting vocabulary', 
            error: error.message 
        });
    }
});

export default router;