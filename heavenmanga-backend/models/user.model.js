// heavenmanga-backend/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema with email validation and password validation.
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  }
});

// Hash the password before saving it to the database.
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10); // Generate salt.
      this.password = await bcrypt.hash(this.password, salt); // Hash the password.
    } catch (err) {
      next(err); // Pass any errors to the next middleware.
    }
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;