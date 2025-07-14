import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LeftNavbar from './LeftNavbar';
import Middlebar from './Middlebar';
import Rightbar from './Rightbar';
import LeftNavbarsymbol from './LeftNavbarsymbol';


const Homebody = () => {
    
    
    
  return (
    <div style={{
        position:'relative',
        top:'73px',
        width: '100%'
        
    }}>
        <LeftNavbar/>
        <LeftNavbarsymbol/>
        <Middlebar/>
        <Rightbar/>
    </div>
  )
}

export default Homebody