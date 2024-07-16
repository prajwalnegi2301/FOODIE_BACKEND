import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    drink: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drink',
    },
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
    },
}, {
    timestamps: true 
});


const cart = mongoose.model('Cart', cartSchema);

export default cart;
