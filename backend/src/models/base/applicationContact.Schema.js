const {mongoose} = require('mongoose');
const {application} = require('../base/application.Schema')

function createContactAppSchema(){
    const status = application();
    return new mongoose.Schema({
        ...status.obj,
        last_name: {type: String, require: true},
        first_name: {type:String, require: true},
        contact_no: {type:Number, require: true},
        interview_date: {type: Date, require: true},
        interview_time: {type: String, require: true},
    })
}

module.exports = {createContactAppSchema};