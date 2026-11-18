// Catches a rejected promise from an async controller and hands it to Express

const asyncHandler = (fn)=>(req,res,next)=>{
  fn(req,res,next).catch(next);
}

module.exports = asyncHandler;