const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// Signup
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id);

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Logout
const logout = (req, res) => {
    // Clear token cookie
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// User Profile
const userProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
};

const userSaveContent =async(req,res)=>{
    const { imgSrc, imgTitle, href } = req.body;
    const userId = req.user.id; // Assuming JWT authentication is in place
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Save the content to the user's savedItems array
      user.savedItems.push({ imgSrc, imgTitle, href });
      await user.save();
  
      res.status(200).json({ message: "Content saved successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error saving content" });
    }
}

module.exports = { signup, login, logout, userProfile };
