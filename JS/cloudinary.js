const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dsuuylodx",
    api_key:  "643975753735143",
    api_secret: "8lmznwULEA4x8DwBk5LHU-Hg0xw"
});

module.exports.key = cloudinary; 