import {createSlice} from '@reduxjs/toolkit';


const initialState = {
    userPofile: null,
    accessToken: null,
    rates: null,
    accounts: null,
    exchange: null,
    receiver:null,
};


export const slice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setUserProfile: (state, action) => {
            state.userPofile = action.payload;
        },

        setAccessToken: (state, action) =>{
            state.accessToken = action.payload;
        },

        setRates: (state, action) =>{
            state.rates = action.payload;
        },

        setAccounts: (state, action) =>{
            state.accounts = action.payload;
        },

        setExchanger: (state, action) =>{
            state.exchange = action.payload;
        },
        
        setReceiver: (state, action) =>{
            state.receiver = action.payload;
        },
    },
});

export const { setUserProfile, setAccessToken, setRates, setAccounts, setExchanger, setReceiver } = slice.actions;

//Selectors
export const selectUserProfile = (state) => state.nav.userPofile;
export const selectAccessToken = (state) => state.nav.accessToken;
export const selectRates = (state) => state.nav.rates;
export const selectAccounts = (state) => state.nav.accounts;
export const selectExchange = (state) => state.nav.exchange;
export const selectReceiver = (state) => state.nav.receiver;

export default slice.reducer;