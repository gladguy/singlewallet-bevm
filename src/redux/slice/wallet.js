import { createSlice } from "@reduxjs/toolkit";

const state = {
  btc: {
    address: null,
    btcBalance: null
  },
  eth: {
    address: null,
    ethBalance: null
  },
  active: false
};

const walletSlice = createSlice({
  name: "wallet",
  initialState: state,
  reducers: {

    setWalletCredentials: (state, { payload }) => {
      state.active = true;
      state.btc = {
        address: payload.btcAddress,
        btcBalance: payload.btcBalance
      };
      state.eth = {
        address: payload.ethAddress,
        ethBalance: payload.ethBalance,
      }
    },

    clearWalletState: (state) => {
      state.btc = {
        address: null,
        btcBalance: null
      };
      state.eth = {
        address: null,
        btcBalance: null
      };
      state.active = false
    }
  }
});

export const {
  setWalletCredentials,
  clearWalletState,
} = walletSlice.actions;
export default walletSlice.reducer;
