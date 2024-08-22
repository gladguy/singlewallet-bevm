import {
  ConnectProvider,
  OKXConnector,
  UnisatConnector,
  XverseConnector
} from "@particle-network/btc-connectkit";
import { BEVMTestnet, MerlinTestnet } from "@particle-network/chains";
import { WalletStandardProvider } from "@wallet-standard/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import LoadingWrapper from "../component/loading-wrapper/index.js";
import store, { persistor } from "../redux/store/index.js";
import "./../App.css";
import MainLayout from "./layout/index.js";

const App = () => {
  return (
    <React.Fragment>
      <ConnectProvider
        options={{
          projectId: process.env.REACT_APP_PROJECT_ID,
          clientKey: process.env.REACT_APP_CLIENT_KEY,
          appId: process.env.REACT_APP_APP_ID,
          aaOptions: {
            accountContracts: {
              BTC: [
                {
                  // chainIds: [BSquaredTestnet.id, BSquared.id],
                  chainIds: [BEVMTestnet.id, MerlinTestnet.id],
                  version: "2.0.0",
                },
              ],
            },
          },
          walletOptions: {
            visible: false,
          },
        }}
        connectors={[
          new XverseConnector(),
          new UnisatConnector(),
          new OKXConnector(),
        ]}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LoadingWrapper>
              <Router>
                <WalletStandardProvider>
                  <MainLayout />
                </WalletStandardProvider>
              </Router>
            </LoadingWrapper>
          </PersistGate>
        </Provider>
      </ConnectProvider>
    </React.Fragment>
  );
};

export default App;
