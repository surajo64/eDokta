import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {

  try {
    const { token } = req.headers
    if (!token) {
      return res.json({ success: false, message: "You are not Authorized to Access this Page!" });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    if (!req.body) req.body = {};
    req.body.userId = token_decode.id
    req.userId = token_decode.id
    next()
  } catch (error) {
    console.log("authUser error:", error.message);
    return res.json({ success: false, message: error.message });
  }
}
export default authUser