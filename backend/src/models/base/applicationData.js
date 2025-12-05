const {mongoose} = require("mongoose");
const {createContactAppSchema} = require('../base/applicationContact.Schema');
const { application } = require("express");

function submitField(){
    const contact = createContactAppSchema();
    return new mongoose.Schema({
        ...contact.obj,
        application_status:{
            type: String,
            enum: ["Pending Review", "Interview Scheduled", "Approved", "Denied"],
            require: true
        },
        next_step:{
            type: String,
            enum: ["In-person", "Message Interview"],
            require: true
        },
        notes: {type:String, require: true}

    })
}
const field = mongoose.model('field', submitField());

module.exports = {
  field
};