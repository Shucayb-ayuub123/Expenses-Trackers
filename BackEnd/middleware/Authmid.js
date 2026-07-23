
import jwt from "express"
import "dotenv/config"
export const AuthUser = (req, res) => {
    const token = req.body

    if (!token) {
        return res.json({
            success: false,

        })
    }

    try {
        
        const tokenDecode = jwt.verify(token , process.env.secretKey)

        return res.json({success : true})
    } catch (error) {
        
        return res.json({success : false , message : "Not in code"})
        
    }

}