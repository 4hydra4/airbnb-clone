const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const Place = require('./models/Place');
const Booking = require('./models/Booking');
const imageDownloader = require('image-downloader');
const multer = require('multer');   // to upload files from device
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const fs = require('fs');   // file system lib
const mime = require('mime-types');

require('dotenv').config();

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'lnngsjkndklfklj3rfg8u5grjhges908';
const bucket = 'airbnc-booking-app';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));  // middleware to serve static files from api folder

// middleware to enable resource sharing between frontend and backend
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));


function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, cookieData) => {
            if (err) throw err;
            resolve(cookieData);
        });
    });
}


// Function used to upload pictures to S3
async function uploadToS3(path, originalFilename, mimetype) {
    const client = new S3Client({
        region: 'eu-north-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });
    const parts = originalFilename.split('.');
    const extension = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + extension;
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
        ACL: 'public-read',
    }));
    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}


app.get('/test', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    res.json('test ok');
});


app.post('/register', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {name, email, password} = req.body;
    try {
        const user = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(user);
    } catch (error) {
        res.status(422).json({message: error.message});
    }
});


app.post('/login', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
        const passOk = bcrypt.compareSync(password, user.password);
        if (passOk) {
            jwt.sign({email: user.email, id: user._id}, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(user);
            });
        } else {
            res.status(422).json('not pass');
        }
    } else {
        res.json('not found');
    }
});


app.get('/profile', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
            if (err) throw err;
            const {name, email, _id} = await User.findById(cookieData.id);
            res.json({name, email, _id});
        });
    } else {
        res.json(null);
    }
});


app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});


// app.post('/upload-by-link', async (req, res) => {
//     mongoose.connect(process.env.MONGO_URL);
//     const {link} = req.body;
//     const newName = 'photo' + Date.now() + '.jpg';
//     await imageDownloader.image({
//         url: link,
//         dest: __dirname + '/uploads/' + newName,
//     });
//     res.json(newName);
// });
app.post('/upload-by-link', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: '/tmp/' + newName,
    });
    const url = await uploadToS3('/tmp/' + newName, newName, mime.lookup('/tmp/' + newName));
    res.json(url);
});


// const photosMiddleware = multer({dest:'uploads/'});
// app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
//     const uploadedFiles = [];
//     for (let i = 0; i < req.files.length; i++) {
//         const {path, originalname} = req.files[i];
//         const parts = originalname.split('.');
//         const ext = parts[parts.length - 1];
//         const newPath = path + '.' + ext;
//         fs.renameSync(path, newPath);
//         uploadedFiles.push(newPath.replace('uploads', ''));
//     }
//     res.json(uploadedFiles);
// });
const photosMiddleware = multer({dest:'/tmp'});
app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const {path, originalname, mimetype} = req.files[i];
        const url = await uploadToS3(path, originalname, mimetype);
        uploadedFiles.push(url);
    }
    res.json(uploadedFiles);
});


// endpoint to create a new place
app.post('/places', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const {
        title, address, addedPhotos, description, price,
        perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
        if (err) throw err;
        const place = await Place.create({
            owner: cookieData.id,
            title, address, photos:addedPhotos, description,
            perks, extraInfo, checkIn, checkOut, maxGuests, price
        });
        res.json(place);
    });
});

   
// endpoint to get all the places for an owner
app.get('/user-places', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
        const {id} = cookieData;
        res.json( await Place.find({owner: id}));
    });
});


// endpoint used to fetch data while editing
app.get('/places/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {id} = req.params;
    let place = await Place.findById(id);

    // Getting username from User model and appending it to place
    const user = await User.findById(place.owner.toString());
    const name = user.name;
    place = Object.assign({name}, place._doc);
    res.json(place);
});


// endpoint for editing an existing place
app.put('/places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const {
        id, title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price,
    } = req.body;
    
    // checking to make sure only place's owner can make the edit
    jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
        const place = await Place.findById(id);
        if (cookieData.id === place.owner.toString()) {
            place.set({
                title, address, photos:addedPhotos, description,
                perks, extraInfo, checkIn, checkOut, maxGuests, price,
            });
            await place.save();
            res.json('ok');
        }
    });
});


app.get('/places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    res.json( await Place.find());
});


app.post('/bookings', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const userData = await getUserDataFromReq(req);
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;

    Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
        user: userData.id,
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        throw err;
    })
});


app.get('/bookings', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({user: userData.id}).populate('place'));    //populate with Place Document
});


// mongoose.connect(process.env.MONGO_URL)
// .then(() => {
//     app.listen(4000);
// }).catch((error) => {
//     console.log(error);
// });
app.listen(4000);
