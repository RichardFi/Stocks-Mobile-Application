import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage, Navigator } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  function addToWatchlist(newSymbol) {
    // check if the stock has already existed in watchlist
    if (state.some((x) => x.symbol == newSymbol) ) {
      alert('Stock has already existed!')
    } else
    {
      setState((prev) => {
        return prev.concat({
          symbol: newSymbol,
        });
      });
      AsyncStorage.setItem("stock", JSON.stringify(state.concat({symbol:newSymbol})))
    }
  }
  
  async function retrieveData() {
    // retrieve data from local
    if(state.length==0){
      try {
        const dataFromStor = await AsyncStorage.getItem("stock");
        if(dataFromStor !==null){
          setState(JSON.parse(dataFromStor));
        }
      } catch{
        alert("error");
      }
    }
  }
  useEffect(() => {
    retrieveData()
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state, addToWatchlist };
};
