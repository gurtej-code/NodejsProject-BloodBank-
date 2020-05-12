const mongoose=require('mongoose')
const donatebloodschema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    bloodgroup:{
        type:String,
        required:true
    }
})

const blooddonate=mongoose.model('BloodDonation',donatebloodschema)
module.exports=blooddonate