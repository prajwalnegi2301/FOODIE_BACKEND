import mongoose from 'mongoose';
import validator from 'validator'

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        validate:[validator.isEmail, "Please Enter valid email" ],
    },
    phone:{
        type:String,
        minlength:[10,"enter a valid phone Number"],
    },
    password: {
        type: String,
        minlength: [8,"Min Length of password must be of 8 length"]
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
    },
    cart:{
        type:mongoose.Types.Types.ObjectId,
        ref:'Cart',
    },
    token:{
        type:String,
    },
}, {
    timestamps: true 
});


const user = mongoose.model('User', userSchema);

export default user;
