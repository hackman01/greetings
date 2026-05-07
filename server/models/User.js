import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    photoUrl: {
      type: String,
      default: '',
    },
    authProvider: {
      type: String,
      enum: ['google', 'email', 'guest'],
      required: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
