const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //step 1- check header(Authorization)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied, No token provided",
      });
    }
    // "Bearer jfl;daskjf;dslajkf;dasjkf;dasjkf;dls".split(" ") - ["Bearer","tokenfkdl;afjkd;lsajfkasdl;"]
    //step 2- Extract the token
    const token = authHeader.split(" ")[1];

    //step 3- verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //step 4- Attach user info to req
    req.user = decoded;

    //step 5 - continue to next middleware
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Access denied",
    });
  }
};

// isAdmin =  req.user.role = 'admin'
// isPartner = 
// isAdminOrPartner =
// isUser
// isUserOrPartnerOrAdmin


const authorizationRoles = (...allowedRoles)=>{
  return (req,res,next)=>{
    if(!req.user || !allowedRoles.includes(req.user.role)){
      return res.status(403).json({
        success:false,
        message:"You do not have permission to perform this action"
      })
    }
    next();
  }
}


module.exports = {
  authMiddleware,
  authorizationRoles
}