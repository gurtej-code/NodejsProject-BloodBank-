const mongoose=require('mongoose')
const registerSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    fathername:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    bloodtype:{
        type:String,
        required:true
    }

})

const register=mongoose.model('Register',registerSchema)
module.exports=register