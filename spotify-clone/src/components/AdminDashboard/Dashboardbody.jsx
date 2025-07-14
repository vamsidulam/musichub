import React,{useEffect} from 'react'
import Adminleftnavbar from './Adminleftnavbar'
import Dashboardright from './Dashboardright'
import { setdashbardoverview,setmanagerusers,setmanagesongs } from '../Store/AdminReducer'
import { useDispatch } from 'react-redux'

const Dashboardbody = () => {
    const dispatch=useDispatch();
  useEffect( ()=>{
    dispatch(setdashbardoverview(true));
    dispatch(setmanagerusers(false));
    dispatch(setmanagesongs(false));
  } ,[]);
  return (
    <div style={{
        position:'absolute',
        top: '150px',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        width:'100%'
    }} >
        <Adminleftnavbar/>
        <Dashboardright/>
    </div>
  )
}

export default Dashboardbody