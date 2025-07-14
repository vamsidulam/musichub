import React from 'react'
import Navbar from '../navbarcomponent/Navbar'
import Homebody from './Homebody'

const Homepage = () => {
  return (
    <div style={{
      position:'relative'
    }}>
        <Navbar/>
        <Homebody/>
    </div>
  )
}

export default Homepage