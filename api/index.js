const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.js');
const jsonwebtoken = require('jsonwebtoken');

require('dotenv').config()
const app = express();

const bcryptSalt = bcrypt.genSaltSync(8);
const jsonwebtokenSecret = 'wewillwinthishackathon';

app.use(express.json());

app.use(cors({

    credentials: true,
    origin: 'http://localhost:5173',

}));

// console.log(process.env.MONGO_URL) // remove this after you've confirmed it is working
mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) =>{
    res.json('test ok');
});

app.post('/register', async(req, res) => {

    const {name, email, password} = req.body;
    // res.json({name, email, password});

    try{

        const userDocument = await User.create({
        
            name,
            email,
            password : bcrypt.hashSync(password, bcryptSalt),
    
        });

        res.json(userDocument);

    }catch (duplicateMailError){

        res.status(422).json(duplicateMailError);

    }

    
});

app.post('/login', async (req, res) => {

    const {email, password} = req.body;
    const userDocument = await User.findOne({email});

    if(userDocument){

        const checkPassword = bcrypt.compareSync(password, userDocument.password);

        if(checkPassword){

            jsonwebtoken.sign({email:userDocument.email, id: userDocument._id}, jsonwebtokenSecret, {}, (error, token) => {
                if(error) throw error;
                res.cookie('token', token).json('Password matched');
            });

        }else{

            res.status(401).json('Password not matched');

        }

        // res.json('found');

    }else{

        res.json('not found');

    }

});

app.listen(4000);
