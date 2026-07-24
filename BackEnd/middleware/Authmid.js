
import jwt from "jsonwebtoken"
import "dotenv/config"
export const AuthUser = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.json({
            success: false,

        })
    }

    try {
        
        const tokenDecode = jwt.verify(token , process.env.secretKey)
        req.user = tokenDecode
        next()
    } catch (error) {
        
        return res.json({success : false , message : "Not in code"})
        
    }

}
