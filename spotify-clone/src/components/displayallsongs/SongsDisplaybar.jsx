import React from 'react'
import LeftNavbar from '../Homepagebodycomponent/LeftNavbar'
import LeftNavbarsymbol from '../Homepagebodycomponent/LeftNavbarsymbol'
import Rightbar from '../Homepagebodycomponent/Rightbar'
import Displaysongsmiddlebar from './Displaysongsmiddelbar'

const SongsDisplaybar = () => {
 return (
    <div>
        <div  style={{
        position:'relative',
        top:'100px',
        width: '100%'
        
    }}>
            <LeftNavbar/>
            <LeftNavbarsymbol/>
            <Displaysongsmiddlebar/>
            <Rightbar/>
        </div>
    </div>
  )
}

export default SongsDisplaybar