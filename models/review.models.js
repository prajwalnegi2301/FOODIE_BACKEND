import mongoose from 'mongoose';

// Define the review schema
const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        enum:["1","2","3","4","5"],
    },
    review:{
        type:String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the Review model from the schema
const review = mongoose.model('Review', reviewSchema);

export default review;
