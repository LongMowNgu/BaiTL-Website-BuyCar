// ===================================
// Authentication Utility - AutoTrade
// ===================================
// Purpose: Centralized user authentication and session management using localStorage
// This file provides helper functions for login, logout, and user management

// ===================================
// User Management Functions
// ===================================

/**
 * Get all registered users from localStorage
 * @returns {Array} Array of user objects
 */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('users') || '[]');
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
}

/**
 * Save users array to localStorage
 * @param {Array} users - Array of user objects
 */
function saveUsers(users) {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
}

/**
 * Get currently logged in user
 * @returns {Object|null} Current user object or null
 */
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch (error) {
    console.error('Error reading current user from localStorage:', error);
    return null;
  }
}

/**
 * Set current logged in user
 * @param {Object} user - User object to set as current
 */
function setCurrentUser(user) {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting current user in localStorage:', error);
  }
}

/**
 * Log out current user
 */
function logout() {
  localStorage.removeItem('currentUser');
}

/**
 * Check if user is currently logged in
 * @returns {boolean} True if user is logged in
 */
function isLoggedIn() {
  return getCurrentUser() !== null;
}

// ===================================
// Authentication Functions
// ===================================

/**
 * Register a new user
 * @param {string} fullname - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} Result object with success status and message
 */
function registerUser(fullname, email, password) {
  const users = getUsers();
  
  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();
  
  // Check if email already exists
  const existingUser = users.find(user => 
    user.email.toLowerCase() === normalizedEmail
  );
  
  if (existingUser) {
    console.log('❌ Registration failed: Email already exists');
    console.log('Existing user:', existingUser);
    return {
      success: false,
      message: 'Email already registered! This account was created on ' + new Date(existingUser.createdAt).toLocaleDateString() + '. Please login instead.',
      existingUser: {
        email: existingUser.email,
        fullname: existingUser.fullname,
        createdAt: existingUser.createdAt
      }
    };
  }
  
  // Validate input
  if (!fullname || fullname.trim().length < 2) {
    return {
      success: false,
      message: 'Full name must be at least 2 characters!'
    };
  }
  
  if (password.length < 6) {
    return {
      success: false,
      message: 'Password must be at least 6 characters!'
    };
  }
  
  // Create new user (trim password again here for safety)
  const newUser = {
    id: Date.now(),
    fullname: fullname.trim(),
    email: normalizedEmail,
    password: (String(password) || '').trim(), // Note: In production, passwords should be hashed
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  console.log('✅ User registered successfully:', newUser.email);
  
  return {
    success: true,
    message: 'Registration successful!',
    user: newUser
  };
}

/**
 * Validate user login credentials
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object|null} User object if valid, null otherwise
 */
function validateLogin(email, password) {
  const users = getUsers();
  
  // Debug logging
  // Normalize inputs to avoid mismatches due to stray whitespace
  email = (email || '').trim();
  password = (password || '').trim();

  console.log('=== Login Validation Debug ===');
  console.log('Input email:', email);
  console.log('Input password:', password);
  console.log('Total users:', users.length);
  
  const foundUser = users.find(user => {
  const emailMatch = user.email.toLowerCase() === email.toLowerCase();
    const passwordMatch = user.password === password;
    
    console.log(`Checking user: ${user.email}`);
    console.log(`  Email match: ${emailMatch} (${user.email.toLowerCase()} vs ${email.toLowerCase()})`);
    console.log(`  Password match: ${passwordMatch} (${user.password} vs ${password})`);
    
    return emailMatch && passwordMatch;
  });
  
  console.log('Found user:', foundUser);
  console.log('===========================');
  
  return foundUser || null;
}

/**
 * Login user and create session
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} Result object with success status and message
 */
function loginUser(email, password) {
  const user = validateLogin(email, password);
  
  if (!user) {
    return {
      success: false,
      message: 'Incorrect email or password.'
    };
  }
  
  // Create user session
  setCurrentUser({
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    loginAt: new Date().toISOString()
  });
  
  return {
    success: true,
    message: 'Login successful!',
    user: getCurrentUser()
  };
}

// ===================================
// User Profile Functions
// ===================================

/**
 * Get user profile by ID
 * @param {number} userId - User ID
 * @returns {Object|null} User object without password
 */
function getUserProfile(userId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return null;
  
  // Return user without password
  const { password, ...userProfile } = user;
  return userProfile;
}

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {Object} updates - Object with fields to update
 * @returns {Object} Result object with success status
 */
function updateUserProfile(userId, updates) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    };
  }
  
  // Update allowed fields only
  const allowedFields = ['fullname', 'email'];
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      users[userIndex][field] = updates[field];
    }
  });
  
  users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(users);
  
  // Update current user if it's the same user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser({
      ...currentUser,
      fullname: users[userIndex].fullname,
      email: users[userIndex].email
    });
  }
  
  return {
    success: true,
    message: 'Profile updated successfully'
  };
}

// ===================================
// Export functions for use in other scripts
// ===================================
// Note: These are global functions available to all scripts
