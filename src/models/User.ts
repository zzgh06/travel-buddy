import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  role: 'user' | 'admin';
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, '이름을 입력해주세요.'],
    maxlength: [10, '이름은 10자를 초과할 수 없습니다.'],
  },
  email: {
    type: String,
    required: [true, '이메일를 입력해주세요.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false,
    minlength: [5, '비밀번호 5자 이상 입력해주세요.'],
    select: false,
  },
  image: String,
  emailVerified: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  googleId: String,
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('알 수 없는 오류가 발생했습니다.'));
    }
  }
  next();
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;