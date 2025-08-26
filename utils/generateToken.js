

const jwt = require("jsonwebtoken");

function generateToken (user) {
    return jwt.sign({id:user.id , email : user.email} ,process.env.JWY_SECRET
    )
}


module.exports = generateToken;