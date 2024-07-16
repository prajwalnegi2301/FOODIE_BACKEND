import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncErrorHandler from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Dish from "../models/dish.models.js";
import Drink from "../models/drink.models.js";

// REGISTER ADMIN->
export const registerAdmin = asyncErrorHandler(async (req, res,next) => {
  const { name, dob, gender, phone, email, password, role } = req.body;
  if (!name || !email || !role || !password) {
    return next(new ErrorHandler("Fill the credentials", 400));
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorHandler("User already exist", 400));
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    name,
    email,
    role,
    password: hashedPassword,
  });
  const accessTA = jwt.sign(
    {
      id: user._id,
      email: user.email,
      
    },
    process.env.JWT_ACCESSTSECRETA,
    {
      expiresIn: process.env.JWT_ACCESSTEXPIRESA,
    }
  );

  const refreshTA = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESHTSECRETA,
    {
      expiresIn: process.env.JWT_REFRESHTEXPIRESA,
    }
  );
  user.token = refreshTA;
  
  await user.save();
  res
    .status(200)
    .cookie("accessTA", accessTA, {
      expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
      httpOnly: true,
      secure: true,
    })
    .cookie("refreshTA", refreshTA, {
      expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      message: "Admin registered successfully",
      user,
    });
});




// LOGIN ADMIN->
export const loginAdmin = asyncErrorHandler(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Fill the credentials", 400));
  }
  const userPresent = await User.findOne({ email });
  if (!userPresent) {
    return next(new ErrorHandler("User not registered", 400));
  }

  const passwordCompare =  bcrypt.compareSync(password, userPresent.password);
  if (!passwordCompare) {
    return next(new ErrorHandler("Incorrect Password", 400));
  }
  const userPresentRole = userPresent.role;
  if(userPresentRole!==role){
    return next(new ErrorHandler("Enter Role",400));
  }
  const accessTA = jwt.sign(
    {
      id: userPresent._id,
      email: userPresent.email,
    
    },
    process.env.JWT_ACCESSTSECRETA,
    {
      expiresIn: process.env.JWT_ACCESSTEXPIRESA,
    }
  );

  const refreshTA = jwt.sign(
    {
      id: userPresent._id,
    },
    process.env.JWT_REFRESHTSECRETA,
    {
      expiresIn: process.env.JWT_REFRESHTEXPIRESA,
    }
  );
  userPresent.token = refreshTA;

  res
    .status(200)
    .cookie("refreshTA", refreshTA, {
      expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
      httpOnly:true,
    })
    .cookie("accessTA",accessTA,{
      expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
      httpOnly:true,
    })
    .json({ message: "Admin Logged in Successfully", success: true });

});


// LOGOUT->
export const logoutAdmin = asyncErrorHandler(async (req, res, next) => {
  res
  .status(200)
  .cookie("refreshTA", "",{
    expires: new Date(Date.now()),
    httpOnly:true,
  })
  .cookie("accessTA","",{
    expires: new Date(Date.now()),
    httpOnly:true,
  })
  .json({
    message: "user Logged Out",
    success:true,
  });
});




// UPDATE ADMIN DETAILS->
export const updateDetailsAdmin = asyncErrorHandler(async (req, res, next) => {
    const user = req.user;
    const userId = user._id;
  
    const {name,email} = req.body;

 
    const userPresent = await User.findById(userId);
    if(!userPresent){
      return next(new ErrorHandler("user not present"));
    }
    const findUser = await User.findByIdAndUpdate(userId,{
        name,email
    });
    const accessTA = jwt.sign(
        {
          id: findUser._id,
          email: findUser.email,
        
        },
        process.env.JWT_ACCESSTSECRETA,
        {
          expiresIn: process.env.JWT_ACCESSTEXPIRESA,
        }
      );
    
      const refreshTA = jwt.sign(
        {
          id: findUser._id,
        },
        process.env.JWT_REFRESHTSECRETA,
        {
          expiresIn: process.env.JWT_REFRESHTEXPIRESA,
        }
      );
      findUser.token = refreshTA;
      res
        .status(200)
        .cookie("accessTA", accessTA, {
          expiresIn:new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
          httpOnly:true
        })
        .cookie("refreshTA", refreshTA, {
          expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
          httpOnly:true
        })
        .json({
          success: true,
          message: "Admin information updated",
    
        });
});


// Get All Dishes
export const getDishes = asyncErrorHandler(async (req, res, next) => {
    const user = req.user._id;
    const findDish = await Dish.find();
    if (!findDish) {
      return next(new ErrorHandler("Cannot find dist", 400));
    }
    res.status(200).json({ message: "dishes...", success: true, findDish });
  });
  
  // Get All Drinks
  export const getDrinks = asyncErrorHandler(async (req, res, next) => {
    const user = req.user._id;
    const findDrink = await Drink.find();
    if (!findUser) {
      return next(new ErrorHandler("Cannot find Drink", 400));
    }
    res.status(200).json({ message: "User deleted", success: true, findDrink });
  });


//GET PARTICULAR CUSTOMER->
export const getParticularCustomer = asyncErrorHandler(async (req, res,next) => {
    const {id} = req.params;
    const userPresent = await User.findById(id);
    if(!userPresent){
        return next(new ErrorHandler("Customer not found",400))
    }
    res
    .status(200)
    .json({message:"Admin achieved",success:true,userPresent});
});



// UPDATE Admin PASSWORD->
export const updatePasswordAdmin = asyncErrorHandler(async (req, res,next) => {
    const user  = req.user;
    const userId = user._id
    
    const{oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword){
        return next(new ErrorHandler("Fill credentials",400));
    }
    const findUser = await User.findById(userId);
    if(!findUser){
        return next(new ErrorHandler("Admin not present with these credentials",400));
    }
    const passwordCompare =  bcrypt.compareSync(oldPassword,findUser.password);
    if(!passwordCompare){
        return next(new ErrorHandler("Enter correct old Password",400));
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword,10);
    // findUser.password = hashedNewPassword;

    const updatePasswordA = User.findByIdAndUpdate(userId,{
      password:hashedNewPassword
    })

    const accessTA = jwt.sign(
        {
          id: user._id,
          email: user.email,
          gender: user.gender,
        },
        process.env.JWT_ACCESSTSECRETA,
        {
          expiresIn: process.env.JWT_ACCESSTEXPIRESA,
        }
      );
    
      const refreshTA = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_REFRESHTSECRETA,
        {
          expiresIn: process.env.JWT_REFRESHTEXPIRESA,
        }
      );
      findUser.token = refreshTA;
      res
        .status(200)
        .cookie("accessTA", accessTA, {
          expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
          httpOnly: true,
          secure: true,
        })
        .cookie("refreshTA", refreshTA, {
          expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
          httpOnly: true,
          secure: true,
        })
        .json({
          success: true,
          message: "Admin password updated",
          findUser,
        });
});



// Create Dish->
export const createDish =  asyncErrorHandler(async(req,res,next)=>{


    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Dish Avatar Required!", 400));
      }
      const { imageDish } = req.files;
      const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedFormats.includes(imageDish.mimetype)) {
        return next(new ErrorHandler("File Format Not Supported", 400));
      }

  const{name,price,description,ingredients,category,temperature}=req.body;
  if(!name || !price || !description ||!ingredients || !category ||!temperature){
      return next(new ErrorHandler("Fill the credentials",400));
  }

  const cloudinaryResponse = await cloudinary.UploadStream.upload(
    imageDish.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
  }

  const newDish =  new Dish({
    name,price,description,ingredients,category,temperature,
    imageDish:{
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
    }
  });
  
  await newDish.save();
  res
  .status(200)
  .json({message:"Dish created", success:true, newDish});
})


// Create Drink->
export const createDrink =  asyncErrorHandler(async(req,res,next)=>{


    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Dish Avatar Required!", 400));
      }
      const { imageDrink } = req.files;
      const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedFormats.includes(imageDrink.mimetype)) {
        return next(new ErrorHandler("File Format Not Supported", 400));
      }

  const{name,price,description,ingredients,category,temperature}=req.body;
  if(!name || !price || !description ||!ingredients  ||!temperature){
      return next(new ErrorHandler("Fill the credentials",400));
  }

  const cloudinaryResponse = await cloudinary.UploadStream.upload(
    imageDrink.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
  }

  const newDrink =  new Drink({
    name,price,description,ingredients,temperature,
    imageDrink:{
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
    }
  });
  
  await newDrink.save();
  res
  .status(200)
  .json({message:"Drink created", success:true, newDrink});
})



// Delete Drink->
export const deleteDrink = asyncErrorHandler(async(req,res,next)=>{
  const user = req.user;
  const { id } = req.params;
  
  const findDrink = await Drink.findById(id);
  if(!findDrink){
      return next(new ErrorHandler("Cannot find the drink",400));
  }
  await findDrink.deleteOne();
  res
  .status(200)
  .json({message:"Drink Deleted",success:true})
})

// Delete Dish->
export const deleteDish = asyncErrorHandler(async(req,res,next)=>{
    const user = req.user;
    const { id } = req.params;
    
    const findDish = await Dish.findById(id);
    if(!findDish){
        return next(new ErrorHandler("Cannot find the dish",400));
    }
    await findDish.deleteOne();
    res
    .status(200)
    .json({message:"Dish Deleted",success:true})
  })


// // Update Property->
// export const updateProperty = asyncErrorHandler(async(req,res,next)=>{
//   const user = req.user;
//   const { id } = req.params;
  
//   const {password,location,bedrooms,parking,furnish,gym,purpose} = req.body;

//   if(!password){
//       return next(new ErrorHandler("Fill credentials",400));
//   }
//   const comparePasswordForProperty = bcrypt.compareSync(password,user.password);
//   if(!comparePasswordForProperty){
//       return next(new ErrorHandler("Enter correct password",400));
//   }
//   const findProperty = Property.findById(id);
//   if(!findProperty){
//     return next(new ErrorHandler("Cannot find Property",400));
//   }
//   const property = await Property.findByIdAndUpdate(id,{
//       location,purpose,bedrooms,parking,furnish,gym
//   },{new: true,
//       runValidators: true,
//       useFindAndModify: false,});
      
//   res
//   .status(200)
//   .json({message:"Property Updated",success:true,property})
// })





