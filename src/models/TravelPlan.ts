import { Location } from '@/types/types';
import mongoose, { Document, Schema } from 'mongoose';

export interface ITravelPlan extends Document {
  title: string;
  startDate: Date;
  endDate: Date;
  destination: string;
  description?: string;
  budget: number;
  userEmail: string;
  routeMap: {
    locations: Location[];
    routeOrder: number[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  position: {
    type: [Number],
    required: true,
    validate: {
      validator: (v: number[]) => v.length === 2,
      message: 'Position must be [latitude, longitude]'
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['attraction', 'restaurant', 'hotel']
  }
});


const TravelPlanSchema: Schema = new Schema<ITravelPlan>({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  destination: { type: String, required: true },
  description: { type: String },
  userEmail: { type: String, required: true },
  budget: { type: Number, default: 0 },
  routeMap: {
    locations: [LocationSchema],
    routeOrder: [Number]
  }
}, { timestamps: true });

export default mongoose.models.TravelPlan || mongoose.model<ITravelPlan>('TravelPlan', TravelPlanSchema);
