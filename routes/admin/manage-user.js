import { Router } from "express";
import UserModel from "../../models/user.js";

const router = Router();
router.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
