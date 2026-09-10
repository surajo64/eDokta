import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
  try {
    const atoken = req.headers.atoken || req.headers.aToken;
    if (!atoken) {
      return res.json({ success: false, message: "You are not Authorized to Access this Page!" });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    if (!req.body) req.body = {};
    req.body.adminId = token_decode.id;
    req.adminId = token_decode.id;
    
    next();
  } catch (error) {
    console.log("authAdmin error:", error.message);
    return res.json({ success: false, message: error.message });
  }
}

export default authAdmin