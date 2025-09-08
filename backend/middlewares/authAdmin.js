import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
  
/* try { */
    const {atoken} = req.headers
    if (!atoken) {
      res.json({success:false, message: "You are not Authirised Access this Page!"});
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)
        req.body.adminId  = token_decode.id
    
next()
 /*} catch (error) {
    console.log(error);
    res.json({success:false, message: error.message });
  }*/
}
export default authAdmin