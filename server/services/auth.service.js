const { ApiError } = require("../middlewares/apiError");
const { User } = require("../models/user");
const httpStatus = require('http-status');
const userService = require('./user.service');
const { use } = require("../routes/auth.route");



const createUser = async(email, password)=>{
    try{
        if(await User.emailTaken(email, password)){
            throw new ApiError(httpStatus.BAD_REQUEST, 'sorry email is taken')
        }

        const user = new User({
            email,
            password
        })

        user.save();

        return user;
    }
    catch(error){
        throw error;
                
    }
}

const genAuthToken = async(user)=>{
    const token = await user.generateAuthToken();
    return token;
}


const signinWithEmailAndPassword = async(email, password)=>{
    const user = await userService.findUserByEmail(email);

    if(!user){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry!Bad Email')
    }

    if(! await user.comparePassword(password)){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry! BAd Password')
    }

    return user;


}

module.exports = {
    createUser,
    genAuthToken,
    signinWithEmailAndPassword
}