import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import Notify from "../../component/notification";
import { useETHProvider } from "@particle-network/btc-connectkit";

export const fetchEthBalance = createAsyncThunk(
  "user/setEthBalance",
  async (address, thunk) => {
    const { provider: ethProvider } = useETHProvider();
    console.log("address", address);

    try {
      const provider = new ethers.providers.Web3Provider(ethProvider);
      const balance = await provider.getBalance(address);
      // const balanceInEther = ethers.utils.formatEther(balance);
      // thunk.dispatch(setEthBalance(Number(balanceInEther)));
    } catch (error) {
      Notify("error", error.message);
    }
  }
);

// const etherscanProvider = new ethers.providers.EtherscanProvider(
//   null,
//   "WCJQ89A6P7MVCXW2EDFRKM6I2TZQVTKP8A"
// );
// const history = await etherscanProvider.getHistory(metaAddress);