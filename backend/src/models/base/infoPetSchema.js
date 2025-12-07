const mongoose = require("mongoose");
const { createPetSchema } = require("./basePet.schema.js");

function createInfoPetSchema() {
  const baseSchema = createPetSchema(); 
  return new mongoose.Schema({
    ...baseSchema.obj,
    status: {
      type: String,
      enum: ["available", "pending", "medical", "adopted"],
      required: true
    },
    pet_type: {
      type: String,
      enum: ["Dog", "Cat", "dog", "cat"],
      required: true
    },
    sex: {
      type: String,
      enum: ["Female", "Male", "female", "male"],
      required: true
    },
    arrival_date: { 
      type: Date, 
      required: true,
      get: (v) => v ? new Date(v) : v
    },
    location: { type: String, required: true },
    vaccinated: { type: Boolean, default: false },
    personality: {
      type: [String],
      enum: [
        "Friendly",
        "Energetic",
        "Calm",
        "Playful",
        "Shy",
        "Loyal",
        "Independent",
        "Affectionate",
        "Protective",
        "Curious",
        "friendly",
        "energetic",
        "calm",
        "playful",
        "shy",
        "loyal",
        "independent",
        "affectionate",
        "protective",
        "curious"
      ],
      default: []
    },
    about_pet: { type: String, required: true },
    posted_by_staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' } // New field
  });
}

const Pet = mongoose.model('Pet', createInfoPetSchema());

module.exports = {
  Pet
};
