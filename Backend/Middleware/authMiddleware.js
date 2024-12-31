const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const authentication = async(req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({success:false,message:"Invalid Or Expire Token"});
        }

        const decoded = jwt.verify(token, secretKey);
        if(!decoded){
            return res.status(400).json({success:false,message:"Invalid Or Expire Token"});
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({success:false,message:"Authetication Failed Or Expired Token"});
    }
}

const authorization = (role) => {
    return async (req,res,next) => {
        if(req.user.role != role){
            return res.status(403).json({success:false,message: "You dont have the permission to access the resources"});
        }
        next();
    }
}

module.exports = {authentication,authorization};