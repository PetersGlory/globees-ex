/* eslint-disable prettier/prettier */
import {configureStore} from '@reduxjs/toolkit';
import slice from './slice';

export const store = configureStore({
    reducer:{
        nav: slice,
    },
});