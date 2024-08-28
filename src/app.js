import express from 'express';
import CORS from 'cors'

const app = express();

app.use(
    CORS({
        origin:process.env.CORS_ORIGIN,
        credentials:true
    })
)
// common middleware
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static('public'))



//import routes
import  healthcheckRouter  from './controllers/healthCheck.controller.js';

//routes
app.use("/api/v1/healthcheckup",healthcheckRouter)
export  { app };
