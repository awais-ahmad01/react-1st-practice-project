const httpStatus = require('http-status')
const authService = require('../services/auth.service');


const authController = {
    async register(req, res, next){
        try{
            const {email, password} = req.body;
            const user = await authService.createUser(email, password);
            const token = await authService.genAuthToken(user);

            res.cookie('x-access-token', token).status(httpStatus.CREATED).send({
                user,
                token
            });

        }
        catch(error){
            // res.send(error.message);
            // console.log(error.message)
            next(error)

        }
    },

    async signin(req, res, next){
        try{
            const {email, password} = req.body;
            const user = await authService.signinWithEmailAndPassword(email, password);
            const token = await authService.genAuthToken(user);
            console.log(token);

            res.cookie('x-acces-token', token)
            .send({
                user,
                token
            })

        }
        catch(error){
            next(error)
        }
    }


}

module.exports = authController;