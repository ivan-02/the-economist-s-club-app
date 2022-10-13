import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
};

export interface UserModel extends mongoose.Model<UserDocument> {}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function preSave(this: UserDocument, next) {
  const existingUser = await User.findOne({ email: this.email });
  if (existingUser) throw new Error('user with that email already exists');
  next();
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
