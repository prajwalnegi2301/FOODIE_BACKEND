import mongoose from "mongoose";

// Define the dish schema
const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    ingredients: {
      type: [String],
    },
    category: {
      type: String,
      enum: ["Veg", "Non-Veg"],
    },
    temperature: {
      type: String,
      enum: ["Hot", "Cold"],
    },
    imageDish: {
      public_id: String,
      url: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Dish model from the schema
const dish = mongoose.model('Dish', dishSchema);

export default dish;
