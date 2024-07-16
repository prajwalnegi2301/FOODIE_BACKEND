import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import User from '../models/user.model.js'

export const isUserAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies.userToken;
    if(!token){
        return next(new ErrorHandler("token not found ",401));
    }
    const decoded = await jwt.verify(token,process.env.JWT_SECRET_KEY);
    
    req.user = await User.findById( decoded.id);

    next();

})