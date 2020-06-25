import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, TextInput, Text, ScrollView, TouchableHighlight /* include other react native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

// each search result stock
function SearchComponent(props) {
  return (
    <TouchableHighlight 
    activeOpacity={0.7}
    onPress={() => props.onPress(props)}
    >
      <View key={props} style={styles.resultItem}>
        <Text style={styles.resultItemSymbol} key={props.symbol}>
          {props.symbol}
        </Text>
        <Text style={styles.resultItemName} key={props.name}>
          {props.name}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  // stocks shows in the search result
  const [state, setState] = useState([]);
  // all stocks get from the end-point
  const [originState, setOriginState] = useState([]);

  useEffect(() => {
    // fetch all stocks from the endpoint and store in both state and originState
    fetch(ServerURL + "/all")
      .then(res => res.json())
      .then(data =>
        data.map(stock => {
          return {
            symbol: stock.symbol,
            name: stock.name,
            industry: stock.industry
          };
        })
      )
      .then(stocks => setState(stocks) & setOriginState(stocks))
  }, []);

  // operate when search input changes
  const onChanegeTextStock = (text) =>{
    // put stocks in search result if the stock name of symbol include part of the input string
    const result = originState.filter((stock) => {
      return stock.symbol.toLowerCase().includes(text.toLowerCase()) || stock.name.toLowerCase().includes(text.toLowerCase())
    })
    setState(result);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.searchDescription}>
          Type a company name or stock symbol:
        </Text>
        <View style={styles.searchBox}>
          <Ionicons style={styles.searchIcon} name="ios-search" size={24} color="#aaaaaa" />
          <TextInput
            style={styles.inputText}
            autoCapitalize='none'
            underlineColorAndroid={"transparent"}
            onChangeText={text => onChanegeTextStock(text)}
          />
        </View>
        <ScrollView style={{ }}>
            {state
            .map((x) => (
              <SearchComponent key={x.symbol} 
              onPress={(stock) => {
                addToWatchlist(stock.symbol)
                navigation.navigate("Stocks")
              }}
              {...x} />
            ))}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  searchDescription:{
    color:"#eee",
    textAlign: "center",
  },
  searchBox: {
    borderColor: "#333333",
    backgroundColor: "#333333",
    borderWidth: scaleSize(0.5),
    borderRadius: scaleSize(10),
    margin: scaleSize(5),
    flexDirection: 'row', 
    alignItems: 'center',
  },
  searchIcon:{
    marginLeft: scaleSize(10),
  },
  inputText: {
    marginLeft: scaleSize(5),
    marginRight: scaleSize(5),
    padding: scaleSize(12),
    fontSize: scaleSize(15),
    color:"#eee"
  },
  resultItem:{ 
    marginBottom: scaleSize(4) , 
    paddingHorizontal: scaleSize(17), 
    paddingVertical: scaleSize(12), 
    backgroundColor: "#000000",
    borderBottomColor: "#555555",
    borderBottomWidth: scaleSize(0.5),
  },
  resultItemName:{
    color: '#aaaaaa'
  },
  resultItemSymbol:{
    fontSize: scaleSize(19),
    paddingBottom: scaleSize(3),
    color: '#ffffff'
  }
});