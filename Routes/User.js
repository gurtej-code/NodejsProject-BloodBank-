const express=require('express')
const Router=express.Router()
const Register=require('../model/Register')
const bcrypt=require('bcrypt')
const passport=require('passport')
const {ensureAuthenticated} =require('../config/authentication')
const BloodDonation=require('../model/donateblood')

Router.get('/login',(req,res)=>{
    res.render('login')
})

Router.get('/register',(req,res)=>{
    res.render('register')
})

Router.get('/donateblood',(req,res)=>{
    res.render('donateblood')
})

Router.get('/editprofile',(req,res)=>{
    res.render('editprofile',{
        username:req.user.username,
        fathername:req.user.fathername,
        email:req.user.email,
        city:req.user.city,
        state:req.user.state,
        bloodtype:req.user.bloodtype,
        pincode:req.user.pincode,
        id:req.user.id
    })


})

Router.get('/contactus',(req,res)=>{
    res.render('contact')
})

Router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard')
})

Router.post('/register',(req,res)=>{
    const {username,fathername,city,state,pincode,email,password,repassword,bloodtype}=req.body
    const errors=[]

    // Filds are empty 
    if(!username || !email || !password || !repassword || !fathername || !city || !state || !pincode || !bloodtype){
        errors.push({msg:'Please Fill out all the fields'})
    }

    // password match
    if(password!==repassword){
        errors.push({msg:'Password not match'})
    }

    //Password Length
    if(password.length<6){
        errors.push({msg:'Password Should be at least 6 characters'})
    }

    //Select Opion
    if(bloodtype==0){
        errors.push({msg:'Please Select Option'})
    }

    if(errors.length>0){
        res.render('register',{
            errors,
            username,
            fathername,
            password,
            repassword,
            email,
            city,
            pincode,
            state,
            bloodtype
        })
    }else{
        Register.findOne({email:email})
        .then(user=>{
            if(user){
                errors.push({msg:'email is already Registered'})
                res.render('register',{
                    errors,
                    username,
                    fathername,
                    password,
                    repassword,
                    email,
                    city,
                    pincode,
                    state,
                    bloodtype
                })      
            }else{
                const newUser=new Register({
                    username,
                    fathername,
                    password,
                    email,
                    city,
                    pincode,
                    state,
                    bloodtype
                })

                bcrypt.genSalt(10,(err,salt)=>
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    // Set Hash Password
                    newUser.password=hash;
                    //Save User
                    newUser.save().then(user=>{
                        req.flash('success_msg','You are now Register')
                        res.redirect('/user/login')
                    }).catch(err=>console.log(err))
                }))
            }
        })
    }

})

//Login Handle
Router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/user/dashboard',
        failureRedirect:'/user/login',
        failureFlash:true
    })(req,res,next)
})

//Logout Handle
Router.get('/logout',(req,res)=>{
    req.logout()
    req.flash('success_msg','You are logged Out')
    res.redirect('/user/login')
})


//Update Profile Handle
Router.post('/editprofile',(req,res)=>{
    const {id,username,fathername,city,state,pincode,bloodtype,email}=req.body
    const errors=[]
    if(!username || !fathername || !city || !state || !pincode || !bloodtype || !email){
        errors.push({msg:'Please Fill out all the fields'})
    }

    if(bloodtype!="A+" || bloodtype!="A-" || bloodtype!="B+" || bloodtype!="B-" 
        || bloodtype!="AB+" || bloodtype!="AB-" || bloodtype!="O+" || bloodtype!="O-"
    ){
        errors.push({msg:'Please Enter Valid Bloodtype'})
    }
    
    if(errors.length>0){
        res.render('editprofile',{
            errors,
            id,
            username,
            fathername,
            city,
            state,
            pincode,
            bloodtype,
            email
        })
    }else{
    Register.findByIdAndUpdate({_id:id},{
        "username":username,
        "fathername":fathername,
        "city":city,
        "state":state,
        "pincode":pincode,
        "bloodtype":bloodtype,
        "email":email
    },function(err,result){
        if(err){
            console.log(err)

        }else{
            req.flash('success_msg','Data Successfully Updated')
            res.redirect('/user/editprofile')
        }
    })
}

})

Router.post('/donateblood',(req,res)=>{
    const {email,date,bloodgroup}=req.body
    const errors=[]
    if(!email || !date || !bloodgroup){
        errors.push({msg:'Please Enter Fill Out Form'})
    }
    if(errors.length>0){
        res.render('donateblood',{
            errors,
            email,
            date,
            bloodgroup
        })
    }else{
        const newDonor= new BloodDonation({
            email,
            date,
            bloodgroup
        })

        newDonor.save().then(user=>{
            req.flash('success_msg','You Donated Blood')
            res.redirect('/user/donateblood')
        }).catch(err=>console.log(err))
    }
})
module.exports=Router