import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  propertyId: { 
    type: String, 
    required: true, 
    index: true 
  },
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    trim: true, 
    lowercase: true 
  },
  comment: { 
    type: String, 
    required: true, 
    trim: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  approved: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Compound index to ensure one review per user per property
reviewSchema.index({ propertyId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
