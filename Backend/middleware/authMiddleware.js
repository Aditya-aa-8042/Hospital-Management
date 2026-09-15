const User = require('../models/User');
const Doctor = require('../models/.Doctor');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password');

        req.user = user;

        return next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized', success: false });
    }
}
// Middleware to authenticate doctor
module.exports.authDoctor = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];


    if (!token) {
        return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const doctor = await Doctor.findById(decoded._id).select('-password');
        req.doctor = doctor;

        return next()

    } 
 
    catch (err) {
        console.log(err);
        res.status(401).json({ message: 'Unauthorized', success: false });
    }
}