import mongoose from "mongoose";


const drinkSchema = new mongoose.Schema(
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
    temperature: {
      type: String,
      enum: ["Hot", "Cold"],
    },
    imageDrink: {
      public_id: String,
      url: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Dish model from the schema
const drink = mongoose.model("Drink", drinkSchema);

export default drink;
