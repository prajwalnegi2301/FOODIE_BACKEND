import mongoose from 'mongoose';

// Define the table booking schema
const bookSeatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
    },
    seatsRequired: {
        type: Number,
        required: true,
        min: 1
    },
    timing: {
        type: String,
        required: true
    },
    specialArrangement: {
        type: String,   
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true 
});


const bookSeat = mongoose.model('bookSeat', bookSeatSchema);

export default  bookSeat;
