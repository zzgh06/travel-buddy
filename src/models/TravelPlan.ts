import mongoose, { Document, Schema } from 'mongoose';

export interface ITravelPlan extends Document {
  title: string;
  startDate: Date;
  endDate: Date;
  destination: string;
  description?: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const TravelPlanSchema: Schema = new Schema<ITravelPlan>({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  destination: { type: String, required: true },
  description: { type: String },
  userEmail: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.TravelPlan || mongoose.model<ITravelPlan>('TravelPlan', TravelPlanSchema);
