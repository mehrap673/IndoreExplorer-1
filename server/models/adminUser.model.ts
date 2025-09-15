import mongoose, { Schema } from 'mongoose';
import { IAdminUser } from '../../shared/types/adminUser.types';

const AdminUserSchema = new Schema<IAdminUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
}, { timestamps: true });

export const AdminUser = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);