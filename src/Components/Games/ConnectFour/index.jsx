import { ConnectFourContextProvider } from "./ConnectFourContext";
import ConnectFour from "./ConnectFour";


const ConnectFourGame = () => {

    /**
     * Alert Component for displaying game errors and warnings
     */
    return (
        <ConnectFourContextProvider>
            <ConnectFour />
        </ConnectFourContextProvider>
    )
  };
  
  export default ConnectFourGame;