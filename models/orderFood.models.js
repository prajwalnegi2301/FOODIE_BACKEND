import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        required: true
    },
    drink: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drink',
        required: true
    },
    modeOfPayment: {
        type: String,
        enum:["COD","PayTm"]
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
    otherRequirements: {
        type: String,
    },
    cartItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the Order model from the schema
const order = mongoose.model('Order', orderSchema);

export default order;
