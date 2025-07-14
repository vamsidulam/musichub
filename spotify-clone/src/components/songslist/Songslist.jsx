import React from 'react'
import Navbar from '../navbarcomponent/Navbar'
import Listofsongsbar from './Listofsongsbar'

const Songslist = () => {
  return (
    <div style={{
      position:'relative'
    }}>
        <Navbar/>
        <Listofsongsbar/>
    </div>
  )
}

export default Songslist