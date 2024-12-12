import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lessonNumber: {
        type: Number,
        required: true,
    },
  
}); 
const Lesson = mongoose.model("lessons", LessonSchema);
export default Lesson;