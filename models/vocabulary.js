import mongoose from "mongoose";
const Schema = mongoose.Schema;



const vocabularySchema = new Schema({
    word: { type: String, required: true },
    pronunciation: { type: String, required: true },
    meaning: { type: String, required: true },
    whenToSay: { type: String, required: true },
    lessonNo: { type: Number, required: true },
    adminEmail: { type: String, required: true },
});

const Vocabulary = mongoose.model("vocabulary", vocabularySchema);
export default Vocabulary;