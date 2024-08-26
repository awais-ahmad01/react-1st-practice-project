const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    firstname:{
        type:String,
        maxLength:15,
        trim:true
    },
    lastname:{
        type:String,
        maxLength:15,
        trim:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    verified:{
        type:Boolean,
        default:false
    }

})


userSchema.pre('save', async function(next){
    let user = this;
    if(user.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }
    next();

})


userSchema.statics.emailTaken = async function(email){
    const user = await this.findOne({email})
    return !!user;
}


userSchema.methods.generateAuthToken = async function(){
    let user = this;
    const userobj = {
        sub:user._id.toHexString(),
        email:user.email
    }  

    const token = jwt.sign(userobj, process.env.DB_SECRET, {expiresIn:'1d'})
    return token;
    
}


userSchema.methods.comparePassword = async function(candidatePassword){
    let user = this;
    return await bcrypt.compare(candidatePassword, user.password);
}



const User = mongoose.model('User', userSchema);
module.exports = {User};