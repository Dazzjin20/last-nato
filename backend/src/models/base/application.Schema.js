const {mongoose} = require('mongoose');

function application(){
    return new mongoose.Schema({
        pet_name: {type: String, default: true},
        pet_gender: {type: String, default: true},
        application_id: {type: String, default: true},
        date_submmited: { type: Date, default: Date.now },
        last_update: { type: Date, default: Date.now }
    })
}
module.exports = {application};