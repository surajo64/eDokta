import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {

  try {
    const { token } = req.headers
    if (!token) {
      res.json({ success: false, message: "You are not Authirised Access this Page!" });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    req.body.userId = token_decode.id
    next()
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
export default authUser