import {createSlice} from '@reduxjs/toolkit';
import type { RootState } from './store';

interface NavState {
    userPofile: any;
    accessToken: any;
    rates: any;
    accounts: any;
    exchange: any;
    receiver: any;
    btc: any;
    cryptoData: any;
}

const initialState: NavState = {
    userPofile: null,
    accessToken: null,
    rates: null,
    accounts: null,
    exchange: null,
    receiver:null,
    btc:null,
    cryptoData: null
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

        setBtc: (state, action) =>{
            state.btc = action.payload;
        },
        setCryptoData: (state, action) =>{
            state.cryptoData = action.payload;
        },
    },
});

export const { setUserProfile, setAccessToken, setRates, setAccounts, setExchanger, setReceiver, setBtc, setCryptoData } = slice.actions;

//Selectors
export const selectUserProfile = (state: RootState) => state.nav.userPofile;
export const selectAccessToken = (state: RootState) => state.nav.accessToken;
export const selectRates = (state: RootState) => state.nav.rates;
export const selectAccounts = (state: RootState) => state.nav.accounts;
export const selectExchange = (state: RootState) => state.nav.exchange;
export const selectReceiver = (state: RootState) => state.nav.receiver;
export const selectBtc = (state: RootState) => state.nav.btc;
export const selectCryptoData = (state: RootState) => state.nav.cryptoData;

export default slice.reducer;