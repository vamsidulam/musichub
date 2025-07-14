import React,{useEffect} from 'react'
import AdminNavbar from './AdminNavbar'
import Dashboardbody from './Dashboardbody'

const AdminDashboard = () => {
  return (
    <div>
        <AdminNavbar/>
        <Dashboardbody/>
    </div>
  )
}

export default AdminDashboard