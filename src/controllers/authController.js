const { db } = require('../config/firebase');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');
const { validateRegister, validateLogin } = require('../validators/authValidator');

const usersCollection = db.collection('users');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    const validation = validateRegister(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check if email already exists
    const existingUser = await usersCollection
      .where('email', '==', email.toLowerCase().trim())
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user object
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'staff',
      createdAt: new Date().toISOString()
    };

    // Save to Firestore
    const docRef = await usersCollection.add(userData);

    // Generate JWT token
    const token = generateToken({
      id: docRef.id,
      email: userData.email,
      role: userData.role
    });

    // Remove password from response
    const { password: _, ...userResponse } = userData;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: docRef.id,
          ...userResponse
        },
        token
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLogin(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Find user by email
    const userSnapshot = await usersCollection
      .where('email', '==', email.toLowerCase().trim())
      .get();

    if (userSnapshot.empty) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Get user data
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    // Compare passwords
    const isPasswordValid = await comparePassword(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: userId,
      email: userData.email,
      role: userData.role
    });

    // Remove password from response
    const { password: _, ...userResponse } = userData;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: userId,
          ...userResponse
        },
        token
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login
};