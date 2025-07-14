import React from 'react'
import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../../utils/getUserFromToken'

const Checkadmin = ({children}) => {
  const userdetails=getUserFromToken();
  const role=userdetails?.role;
  
  return (role==='admin')?children: <Navigate to="/" replace /> ;
}

export default Checkadmin