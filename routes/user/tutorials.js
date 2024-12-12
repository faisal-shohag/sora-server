import { Router } from "express";
import Tutorial from "../../models/tutorials.js";

const router = Router();

router.get('/tutorials', async (req, res) => {
    try {
      const tutorials = await Tutorial.find();
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  export default router