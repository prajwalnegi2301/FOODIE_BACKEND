import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncErrorHandler from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Dish from "../models/dish.models.js";
import Drink from "../models/drink.models.js";
import BookSeat from "../models/bookSeat.models.js";
import Order from "../models/orderFood.models.js";
import Cart from "../models/cart.models.js";
import Review from "../models/review.models.js";
import catchAsyncErrors from "../middlewares/catchAsyncError.js";

// REGISTER CUSTOMER->
export const registerCustomer = asyncErrorHandler(async (req, res, next) => {
  const { name, phone, email, password, role } = req.body;
  if (!name || !email || !role || !password || !phone) {
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
    phone,
    password: hashedPassword,
  });
  const accessTC = jwt.sign(
    {
      id: user._id,
      email: user.email,
      gender: user.gender,
    },
    process.env.JWT_ACCESSTSECRETC,
    {
      expiresIn: process.env.JWT_ACCESSTEXPIRESC,
    }
  );

  const refreshTC = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESHTSECRETC,
    {
      expiresIn: process.env.JWT_REFRESHTEXPIRESC,
    }
  );
  user.token = refreshTC;

  await user.save();
  res
    .status(200)
    .cookie("accessTC", accessTC, {
      expiresIn: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
    })
    .cookie("refreshTC", refreshTC, {
      expiresIn: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      message: "User successfully created",
      user,
    });
});

// LOGIN CUSTOMER->
export const loginCustomer = asyncErrorHandler(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Fill the credentials", 400));
  }
  const userPresent = await User.findOne({ email });
  if (!userPresent) {
    return next(new ErrorHandler("User not registered", 400));
  }
  const passwordCompare = bcrypt.compareSync(password, userPresent.password);
  if (!passwordCompare) {
    return next(new ErrorHandler("Correct your password", 400));
  }

  const UserRole = userPresent.role;
  if (UserRole !== role) {
    return next(new ErrorHandler("User not associated with this role", 400));
  }

  const accessTC = jwt.sign(
    {
      id: userPresent._id,
      email: userPresent.email,
    },
    process.env.JWT_ACCESSTSECRETC,
    {
      expiresIn: process.env.JWT_ACCESSTEXPIRESC,
    }
  );
  const refreshTC = jwt.sign(
    {
      id: userPresent._id,
    },
    process.env.JWT_REFRESHTSECRETC,
    {
      expiresIn: process.env.JWT_REFRESHTEXPIRESC,
    }
  );
  userPresent.token = refreshTC;

  res
    .status(200)
    .cookie("refreshTC", refreshTC, {
      expiresIn: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .cookie("accessTC", accessTC, {
      expiresIn: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User successfully login",
    });
});

//LOGOUT CUSTOMER->
export const logOutCustomer = asyncErrorHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("refreshTC", "", {
      expiresIn: new Date(Date.now()),
      httpOnly: true,
    })
    .cookie("accessTC", "", {
      expiresIn: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      message: "user Logged Out",
      success: true,
    });
});

// UPDATE CUSTOMER DETAILS->
export const updateDetailsCustomer = asyncErrorHandler(
  async (req, res, next) => {
    const user = req.user;
    const { name, email, phone } = req.body;
    const findUser = await User.findOneAndUpdate(
      { email: user.email },
      {
        phone,
        name,
        email,
      }
    );
    const accessTC = jwt.sign(
      {
        id: findUser._id,
        email: findUser.email,
        gender: findUser.gender,
      },
      process.env.JWT_ACCESSTSECRETC,
      {
        expiresIn: process.env.JWT_ACCESSTEXPIRESC,
      }
    );

    const refreshTC = jwt.sign(
      {
        id: findUser._id,
      },
      process.env.JWT_REFRESHTSECRETC,
      {
        expiresIn: process.env.JWT_REFRESHTEXPIRESC,
      }
    );
    findUser.token = refreshTC;
    res
      .status(200)
      .cookie("accessTC", accessTC, {
        expiresIn: new Date(
          Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      })
      .cookie("refreshTC", refreshTC, {
        expiresIn: new Date(
          Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "User information updated",
      });
  }
);

// DELETE CUSTOMER
export const deleteCustomer = asyncErrorHandler(async (req, res, next) => {
  const user = req.user._id;
  const findUser = await User.findById(user);
  if (!findUser) {
    return next(new ErrorHandler("Cannot find Customer", 400));
  }
  await findUser.deleteOne();
  res.status(200).json({ message: "User deleted", success: true });
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



// Get A Particular Drink->
export const getADrink = asyncErrorHandler(async(req,res,next)=>{
    const { id } = req.params;
    const getDrink = await Drink.findById(id);
  
    res
    .status(200)
    .json({message:"Drink..",success:true,getDrink})
  })
  
  
  // Get A Particular Dish->
  export const getADish = asyncErrorHandler(async(req,res,next)=>{
      const { id } = req.params;
      const getADishForCustomer = await Dish.findById(id);
    
      res
      .status(200)
      .json({message:"Dish..",success:true,getADishForCustomer})
    })

    

// Our Profile->
export const getParticularCustomer = asyncErrorHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const userPresent = await User.findById(id);
    if (!userPresent) {
      return next(new ErrorHandler("User not found", 400));
    }
    res
      .status(200)
      .json({ message: "user achieved", success: true, userPresent });
  }
);

// UPDATE CUSTOMER PASSWORD->
export const updatePasswordCustomer = asyncErrorHandler(
  async (req, res, next) => {
    const user = req.user;
    const userId = user._id;

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("Fill credentials", 400));
    }

    const passwordCompare = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordCompare) {
      return next(new ErrorHandler("Enter correct old Password", 400));
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    const findUser = await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });

    const accessTC = jwt.sign(
      {
        id: findUser._id,
        email: findUser.email,
      },
      process.env.JWT_ACCESSTSECRETC,
      {
        expiresIn: process.env.JWT_ACCESSTEXPIRESC,
      }
    );

    const refreshTC = jwt.sign(
      {
        id: findUser._id,
      },
      process.env.JWT_REFRESHTSECRETC,
      {
        expiresIn: process.env.JWT_REFRESHTEXPIRESC,
      }
    );
    findUser.token = refreshTC;
    res
      .status(200)
      .cookie("accessTC", accessTC, {
        expiresIn: new Date(
          Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      })
      .cookie("refreshTC", refreshTC, {
        expiresIn: new Date(
          Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "User password updated",
      });
  }
);

// Book A Table
export const bookATable = catchAsyncErrors(async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const { name, phone, seatsRequired, timing, specialArrangement } = req.body;
  if (!name || !phone || !seatsRequired || !timing || !specialArrangement) {
    return next(new ErrorHandler("Fill the credentials", 400));
  }
  const newTable = new BookSeat({
    name,
    phone,
    seatsRequired,
    timing,
    specialArrangement,
  });
  newTable.user = userId;
  await newTable.save();
  res.status(200).json({ message: "table created", success: true });
});

// Make A Order->
export const makeAnOrder = catchAsyncErrors(async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const { dish, drink, modeOfPayment, otherRequirements } = req.body;
  if (!dish || !drink || !modeOfPayment) {
    return next(new ErrorHandler("Fill the credentials", 400));
  }
  const newOrder = new Order({
    dish,
    drink,
    modeOfPayment,
    otherRequirements,
  });
  newOrder.user = userId;
  await newOrder.save();

  res.status(200).json({ message: "new order created", success: true });
});

// Add Rating->
export const addRating = catchAsyncErrors(async (req, res) => {
    const user = req.user;
    const userId = user._id;
    const { rating, review } = req.body;
    if (!rating || !review) {
        return next(new ErrorHandler("Fill the credentials", 400));
    }
    const addReview = new Review({
        rating,
        review
    })
    addReview.user = userId;
    await addReview.save();
    res.status(200).json({ message: "Review added", success: true });
});


// Add To Cart->
export const addToCart = catchAsyncErrors(async (req, res) => {
    const user = req.user;
    const userId = user._id;
    const {drink,dish}=req.body;
    if(!drink || !dish){
        return next(new ErrorHandler("Fill the fields",400));
    }
    const cartId = user.cart;
    const findCart = await Cart.findById(cartId);
    if(!findCart){
        const newCart = new Cart({
            drink,dish
        })
        newCart.user = userId;
        await newCart.save();
        res.status(200).json({message:"added to cart",success:false});
    }
    else{
        
        const updateCart = await Cart.findByIdAndUpdate(cartId,{
            drink,dish
        })
        updateCart.user = userId;
        await updateCart.save();
        res.status(200).json({message:"updated to cart",success:false});
    }

})