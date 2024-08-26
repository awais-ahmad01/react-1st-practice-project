const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority&appName=Cluster0`

const routes = require('./routes');

const {handleError, convertToApiError} = require('./middlewares/apiError')


mongoose.connect(mongoUri)
.then(()=>{
    console.log('mongo db connected.....')
})
.catch((error)=>{
    console.log('mongo db connected.....', error)
})


app.use(bodyParser.json());

app.use(cors());

app.use('/api', routes)


/// error handling
app.use(convertToApiError)
app.use((err,req,res,next)=>{
    handleError(err,res)
})



const port = process.env.PORT || 3001;
app.listen(port, ()=>{
    console.log('server running on port ', port)
})