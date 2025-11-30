const mongoose = require("mongoose");

function createPetSchema() {
  //Create Schema for backend using mongoose
  return new mongoose.Schema({
    after_image: { type: String, required: true },
    before_image: { type: String, required: true },
    pet_name: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
  });
}
module.exports = {createPetSchema};