import React from 'react'
import Navbar from '../navbarcomponent/Navbar'
import Allsingersbody from './Allsingersbody'

const Viewallsingers = () => {
  return (
    <div style={{
      position:'relative'
    }}>
        <Navbar/>
        <Allsingersbody/>
    </div>
  )
}

export default Viewallsingers