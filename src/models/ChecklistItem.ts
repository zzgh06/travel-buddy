import mongoose, { Document, Schema } from 'mongoose';

export interface IChecklistItem extends Document {
  travelPlanId: mongoose.Types.ObjectId;
  text: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema: Schema = new Schema<IChecklistItem>({
  travelPlanId: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.ChecklistItem || mongoose.model<IChecklistItem>('ChecklistItem', ChecklistItemSchema);