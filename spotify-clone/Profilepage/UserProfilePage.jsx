import React from 'react'
import Navbar from '../navbarcomponent/Navbar'
import { UserProfilebody } from './UserProfilebody'

const UserProfilePage = () => {
  return (
    <div  style={{
      position:'relative'
    }}>
        <Navbar/>
        <UserProfilebody/>
    </div>
  )
}

export default UserProfilePage