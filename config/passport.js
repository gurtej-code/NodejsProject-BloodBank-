const localStrategy=require('passport-local').Strategy
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

//User Model
const register=require('../model/Register')
module.exports=function(passport){
    passport.use(
        new localStrategy({usernameField:'email'},(email,password,done)=>{
            //match user
            register.findOne({email:email})
            .then(register=>{
                if(!register){
                    return done(null,false,{message:'That Email is not Register'})
                }

                //match passowrd
                bcrypt.compare(password,register.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null,register)
                    }else{
                        return done(null,false,{message:'Password incorrect'})
                    }
                })
            })
            .catch(err=>console.log(err))
        })
    )

    passport.serializeUser((register,done)=>{
        done(null,register.id)
    })

    passport.deserializeUser((id,done)=>{
        register.findById(id,(err,register)=>{
            done(err,register)
        })
    })
}