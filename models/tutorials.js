import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TutorialSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
  
});
const Tutorial = mongoose.model("tutorial", TutorialSchema);
export default Tutorial;