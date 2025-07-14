import {configureStore} from '@reduxjs/toolkit';
import Reducer from './Reducer';
import adminSlice from './AdminReducer';

export const Store=configureStore({
    reducer:{
        songdata:Reducer,
        admindata:adminSlice
    }
})