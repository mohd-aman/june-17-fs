import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

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