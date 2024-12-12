import { Router } from "express";
import Tutorial from "../../models/tutorials.js";

const router = Router();

// Get all tutorials
router.get('/tutorials', async (req, res) => {
  try {
    const tutorials = await Tutorial.find();
    res.json(tutorials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new tutorial
router.post('/tutorials', async (req, res) => {
  const tutorial = new Tutorial({
    title: req.body.title,
    link: req.body.link
  });

  try {
    const newTutorial = await tutorial.save();
    res.status(201).json(newTutorial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a tutorial
router.put('/tutorials/:id', async (req, res) => {
  try {
    const updatedTutorial = await Tutorial.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedTutorial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a tutorial
router.delete('/tutorials/:id', async (req, res) => {
  try {
    await Tutorial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tutorial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;