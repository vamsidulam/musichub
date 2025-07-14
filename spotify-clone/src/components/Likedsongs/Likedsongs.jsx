import React from 'react'
import Navbar from '../navbarcomponent/Navbar'
import Songscontent from './Songscontent'

const Likedsongs = () => {
  return (
      <div style={{
        position:'relative'
      }}>
          <Navbar/>
          <Songscontent/>
      </div>
    )
}

export default Likedsongs