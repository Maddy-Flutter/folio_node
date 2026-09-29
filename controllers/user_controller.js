const User = require("../models/user");

// Create
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Read All
exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

// Read One
exports.getUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
};

// Update
exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
};

// Delete
exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
};