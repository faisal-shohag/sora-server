import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const VocabularySchema = new Schema({
    word: { 
        type: String, 
        required: true,
        trim: true,
        unique: false  // Removed global uniqueness
    },
    pronunciation: { 
        type: String, 
        required: true,
        trim: true
    },
    meaning: { 
        type: String, 
        required: true,
        trim: true
    },
    whenToSay: { 
        type: String, 
        required: true,
        trim: true
    },
    lessonNo: { 
        type: Number, 
        required: true,
        min: 1  // Ensure lesson number is positive
    },
    adminEmail: { 
        type: String, 
        required: true,
        lowercase: true
    }
}, {
    timestamps: true,  // Add createdAt and updatedAt
    indexes: [
        // Compound unique index to prevent duplicate words in the same lesson
        { 
            unique: true, 
            fields: { word: 1, lessonNo: 1 } 
        }
    ]
});

const Vocabulary = mongoose.model("vocabulary", VocabularySchema);
export default Vocabulary;