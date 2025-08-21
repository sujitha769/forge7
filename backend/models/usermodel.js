const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    index: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    default: null,
    trim: true
  },
  address: {
    type: String,
    default: null,
    trim: true
  },
  emergencyContact: {
    type: String,
    default: null,
    trim: true
  },
  dateOfBirth: {
    type: String,
    default: null,
    trim: true
  },
  role: {
    type: String,
    enum: ['client', 'doctor'],
    default: 'client'
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a random 10-character alphanumeric ID
function generateRandomUserId() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return id;
}

// Ensure userId exists and is unique on creation
userSchema.pre('save', async function(next) {
  try {
    if (this.isNew && !this.userId) {
      let candidate;
      // Loop until a unique ID is found (collision chance is extremely low)
      // but we still guard with an existence check
      // Use this.constructor to query the same model
      // eslint-disable-next-line no-constant-condition
      while (true) {
        candidate = generateRandomUserId();
        const exists = await this.constructor.exists({ userId: candidate });
        if (!exists) break;
      }
      this.userId = candidate;
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);