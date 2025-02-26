import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

// ✅ Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // // Hash password before saving
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'seeker',  // Default role is seeker
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ User Login (Now supports Employer role properly)
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User not found for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Debugging Logs (remove in production)
    console.log(`✅ User Found: ${user.email}, Role: ${user.role}`);

    // Use matchPassword function from user model
    const isPasswordMatch = await user.matchPassword(password);
    
    if (!isPasswordMatch) {
      console.log(`❌ Password mismatch for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('❌ Error during login:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Fetch Users
export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fetch User by ID
export const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update User
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // Only allow updating logged-in user

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Handle password update
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id), // Re-generate token after update
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


// ✅ Delete User
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fetch Logged-in User Profile
export const getUserProfile = asyncHandler(async (req, res) => {
  console.log("Authenticated User:", req.user); // 🔍 Debugging line

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ message: error.message });
  }
});
