import { Navigate } from "react-router-dom";

const { useAuth } = require("../context/AuthContext")

const ProtectedRoute = ({children})=>{
  const {token,loading} = useAuth();
  if(loading){
    return null
  }
  if(!token){
    return <Navigate to="/login" replace/> // redirection
  }
  return children
}

export default ProtectedRoute