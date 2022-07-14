import { createTheme, ThemeProvider } from "@material-ui/core";
import { useMemo } from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@araviel/wallet-adapter-react";
import * as anchor from "@j0nnyboi/anchor";
import { clusterApiUrl } from "@safecoin/web3.js";
import { WalletAdapterNetwork } from "@araviel/wallet-adapter-base";
import {

  getSafecoinWallet as getSolletWallet

} from '@araviel/wallet-adapter-wallets';

import {
    WalletModalProvider
} from '@araviel/wallet-adapter-react-ui';

import "./App.css";
import { DEFAULT_TIMEOUT } from './connection';
import Home from "./Home";

require('@araviel/wallet-adapter-react-ui/styles.css');

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
    try {
        const candyMachineId = new anchor.web3.PublicKey(
            process.env.REACT_APP_CANDY_MACHINE_ID!,
        );

        return candyMachineId;
    } catch (e) {
        console.log('Failed to construct CandyMachineId', e);
        return undefined;
    }
};

const candyMachineId = getCandyMachineId();

const network = process.env.REACT_APP_SAFECOIN_NETWORK as WalletAdapterNetwork;

const rpcHost = process.env.REACT_APP_SAFECOIN_RPC_HOST!;
const connection = new anchor.web3.Connection(
    rpcHost ? rpcHost : anchor.web3.clusterApiUrl('devnet'),
);

const theme = createTheme({
    palette: {
        type: 'dark',
    },
    overrides: {
        MuiButtonBase: {
            root: {
                justifyContent: 'flex-start',
            },
        },
        MuiButton: {
            root: {
                textTransform: undefined,
                padding: '12px 16px',
            },
            startIcon: {
                marginRight: 8,
            },
            endIcon: {
                marginLeft: 8,
            },
        },
    },
});

const App = () => {
    // Custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), []);

    // @araviel/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            getSolletWallet({ network }),
        ],
        []
    );

  return (
      <ThemeProvider theme={theme}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect={true}>
            <WalletModalProvider>
              <Home
                candyMachineId={candyMachineId}
                connection={connection}
                txTimeout={DEFAULT_TIMEOUT}
                rpcHost={rpcHost}
                network={network}
              />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
  );
};

export default App;
