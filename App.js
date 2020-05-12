const express=require('express')
const app=express();
const expressLayout=require('express-ejs-layouts')
const  mongoose=require('mongoose')
const flash=require('connect-flash')
const session=require('express-session')
const passport=require('passport');

//Passport Config
require('./config/passport')(passport)

//Connecting Path
app.use('/style',express.static('style'))
app.use('/images',express.static('images'))
app.use('/videos',express.static('videos'))

//Db Config
const db=require('./config/key').MongoURI

//Connect To Mongo
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
.then(()=>console.log('Database Connected...'))
.catch(()=>console.log('Database is not connected'))


//BodyParser
app.use(express.urlencoded({extended:false}))

//Express session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
}))

app.use(passport.initialize())
app.use(passport.session())

//Connect Flash
app.use(flash())

//global Variable
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next()
})


//EJS
app.use(expressLayout)
app.set('view engine','ejs')

//Routes
app.use('/',require('./Routes/Index'))
app.use('/user',require('./Routes/User'))

const PORT=process.env.PORT || 5000
app.listen(PORT,console.log(`Server Started On ${PORT}`))