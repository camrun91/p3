const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const uploadImagePrefix = 'image-';
const uploadDir = './public/uploads';
// set storage options of multer
const storageOptions = multer.diskStorage({
    destination: (req, file, callback) => {
        // upload dir path
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        callback(null, uploadImagePrefix + Date.now()
            + path.extname(file.originalname));
    }
});

// configure multer
const MAX_FILESIZE = 1024 * 1024 * 3; // 3 MB
const fileTypes = /jpeg|jpg|png|gif/; // accepted file types in regexp

const upload = multer({
    storage: storageOptions,
    limits: {
        fileSize: MAX_FILESIZE
    }, 
    fileFilter: (req, file, callback) => {
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype && extname) {
            return callback(null, true);
        } else {
            return callback('Error: Images only');
        }
    }
}).single('imageUpload'); // parameter name at <form> of index.ejs

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
// uploadDir must begin with ./public
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded( {extended: false} ));

// run and connect to the database
require('./models/database');
const Image = require('./models/imageSchema');

app.get('/', (req, res) => {
    Image.find({}, (err, results) => {
		if (err) {
			return res.render.status(500).send('<h1>Error: cannot read from db</h1>');
		}
        return res.render('index', {results, msg: null});
	});
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.render('index', {
                results: null, msg: err, filename: null });
        }
        if (!req.file) {
            return res.render('index', {
                results: null, msg: 'Error: no file selected', filename: null
            });
        }

        // save filename and size in the db
        const newImage = new Image({
            name: uploadDir + '/' + req.file.filename,
            size: req.file.size
        });
        newImage.save((err, results) => {
            if (err) {
                return res.status(500).send('<h1>save() in db error</h1>', err);
            }
            return res.redirect('/');
        });
    });
});

app.get('/delete', (req, res) => {
	Image.remove({name: req.query.filename}, (err, results) => {
		if (err) {
			return res.status(500).send('<h1>Image Delete error</h1>');
        }
        // delete the file from the /public/uploads directory
        fs.unlink(req.query.filename, (err) => {
            if (err) {
                // what should I do?
                throw err;
            }
        });
        res.redirect('/');
	});
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started on port' , port);
    console.log(uploadDir + ' must exist to upload images');
});