import React from 'react'
import LeftNavbar from '../Homepagebodycomponent/LeftNavbar'
import LeftNavbarsymbol from '../Homepagebodycomponent/LeftNavbarsymbol'
import ListofSongs from './ListofSongs'
import Rightbar from '../Homepagebodycomponent/Rightbar'

const Listofsongsbar = () => {
  return (
    <div>
        <div  style={{
        position:'relative',
        top:'100px',
        width: '100%'
        
    }}>
            <LeftNavbar/>
            <LeftNavbarsymbol/>
            <ListofSongs/>
            <Rightbar/>
        </div>
    </div>
  )
}

export default Listofsongsbar