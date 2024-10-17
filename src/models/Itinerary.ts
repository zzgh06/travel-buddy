import mongoose, { Schema, Document } from 'mongoose';

export interface IItinerary extends Document {
  travelPlanId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  activity: string;
  location: string;
  notes?: string;
}

const ItinerarySchema: Schema = new Schema({
  travelPlanId: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  activity: { type: String, required: true },
  location: { type: String, required: true },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Itinerary || mongoose.model<IItinerary>('Itinerary', ItinerarySchema);
