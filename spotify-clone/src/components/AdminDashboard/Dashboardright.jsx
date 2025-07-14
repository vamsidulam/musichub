import React,{useEffect} from 'react'
import { setdashbardoverview } from '../Store/AdminReducer'
import { useSelector } from 'react-redux'
import Dashboardcards from './Dashboardcards'
import Users from './Users'
import Songs from './Songs'
import HandlingLikes from './HandlingLikes'

const Dashboardright = () => {
    const showdashboardoverview=useSelector( (state)=>state.admindata.dashboardoverview );
    const showmanageusers=useSelector( (state)=>state.admindata.manageusers );
    const showmanagersongs=useSelector( (state)=>state.admindata.managesongs );
    const showmanagerlikes=useSelector( (state)=>state.admindata.managelikes );
  return (
    <div style={{
        border: '2px solid white',
        height: '70vh',
        padding: '20px',
        width: '740px',
        position:'relative'
    }}>
        {
            showdashboardoverview &&(
                <Dashboardcards/>
            )
        }
        {
            showmanageusers&&(
                <Users/>
            )
        }
        {
            showmanagersongs&&(
                <Songs/>
            )
        }
        {
            showmanagerlikes&&(
                <HandlingLikes/>
            )
        }
    </div>
  )
}

export default Dashboardright