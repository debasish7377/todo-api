const jwt = require('jsonwebtoken')

module.exports = async function(req, res, next) {
    const token = req.header("Authorization")

    if(!token){
        return res.status(200).json({
            msg : "No Tocken authorization denied"
        })
    }

    try{

        await jwt.verify(token, process.env.jwtUserSecret, (error, decoded) =>{
            if(error){
                res.status(400).json({
                    msg: "Token not valid"
                })

            }else{
                req.user = decoded.user
                next()
            }
        })

    }catch(error){
        console.log("Something went wrong with"+ error)
        res.json(500).json({
            msg: "Server Error"
        })
    }
}