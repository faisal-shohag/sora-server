import jwt from 'jsonwebtoken'

const userAuthentication = async (req, res, next) => {
    const token = req.cookies.jwt_token
    if(!token){
        return res.status(401).json({message: "Unauthorized", success: false})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded.role !== "user"){
            return res.status(401).json({message: "Unauthorized", success: false})
        }
        req.user = decoded
        next()
        
    } catch (error) {
        return res.status(401).json({message: "Unauthorized", success: false})
    }
}


const adminAuthentication = async (req, res, next) => {
    const token = req.cookies.jwt_token
    if(!token){
        return res.status(401).json({message: "Unauthorized", success: false})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        if(decoded.role !== "admin"){
            return res.status(401).json({message: "Unauthorized", success: false})
        }
        next()

    } catch (error) {
        return res.status(401).json({message: "Unauthorized", success: false})
    }
}
export {userAuthentication, adminAuthentication}