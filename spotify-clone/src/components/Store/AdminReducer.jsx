import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import { GiArm } from "react-icons/gi";

export const initialState={
    dashboardoverview:'',
    manageusers:'',
    managesongs:'',
    managelikes:''
}

const adminSlice=createSlice({
    name:'admindata',
    initialState,
    reducers:{
        setdashbardoverview : (state,action) =>{
            state.dashboardoverview=action.payload;
        },
        setmanagerusers:(state,action)=>{
            state.manageusers=action.payload;
        },
        setmanagesongs:(state,action)=>{
            state.managesongs=action.payload;
        },
        setmanagelikes:(state,action)=>{
            state.managelikes=action.payload;
        }
        
    }
})

export const {setdashbardoverview,setmanagerusers,setmanagesongs,setmanagelikes}=adminSlice.actions;
export default adminSlice.reducer;