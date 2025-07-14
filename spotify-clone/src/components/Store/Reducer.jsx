import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import { GiArm } from "react-icons/gi";

export const initialState={
    leftmenu: window.innerWidth>=500,
    rightmenu: window.innerWidth>=500,
    isPlaying:false,
    currentsong:'',
    currentsongid:'',
    autoplay:false,
    likedsongs:[],
    playlists:[],
    showprofile:'',
    showlikes:'',
    showplaylist:'',
    showsettings:''
}

const Reducer=createSlice({
    name:'songdata',
    initialState,
    reducers:{
        setshowprofile:(state,action)=>{
            state.showprofile=action.payload;
        },
        setshowlikes:(state,action)=>{
            state.showlikes=action.payload;
        },
        setshowplaylists:(state,action)=>{
            state.showplaylist=action.payload;
        },
        setshowsettings:(state,action)=>{
            state.showsettings=action.payload;
        },
        setleftmenu:(state,action)=>{
            state.leftmenu=action.payload;
        },
        setrightmenu:(state,action)=>{
            state.rightmenu=action.payload;
        },
        setisPlaying:(state,action)=>{
            state.isPlaying=action.payload;
        },
        setcurrentsong:(state,action)=>{
            state.currentsong=action.payload;
        },
        setcurrentsongid:(state,action)=>{
            state.currentsongid=action.payload;
        },
         setautoplay: (state, action) => {
            state.autoplay = action.payload;
        },
        setlikedsongs:(state,action)=>{
            state.likedsongs=action.payload;
        },
        setplaylists:(state,action)=>{
            state.playlists=action.payload;
        }
    }
})

export const {setleftmenu,setrightmenu,
    setisPlaying,setcurrentsong,setcurrentsongid,
    setautoplay,setlikedsongs,setplaylists,
    setshowlikes,setshowprofile,setshowplaylists,setshowsettings}=Reducer.actions;
export default Reducer.reducer;