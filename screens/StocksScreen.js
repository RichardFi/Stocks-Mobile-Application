import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

function StockComponent(props) {
  // show different color to gain or loss
  const stockColor = () => {
    if (props.close - props.open >= 0) {
      return "#4CDA64"
    }
    else {
      return "#FE3830"
    }
  }
  return (
    <TouchableOpacity style={styles.resultItem}
      activeOpacity={0.3}
      onPress={() => props.onPress(props)}
    >
      <View style={styles.resultItemName}>
        <Text style={styles.resultItemNameText}>
          {props.symbol}
        </Text>
      </View>
      <View style={styles.resultItemClose}>
        <Text style={styles.resultItemCloseText}>
          {props.close}
        </Text>
      </View>
      <View style={[styles.resultItemGain, { backgroundColor: stockColor() }]}>
        <Text style={styles.resultItemGainText}>
          {Math.round((props.close - props.open) / props.open * 10000) / 100 + "%"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  // all information of stock in watchlist
  const [state, setState] = useState([]);
  // values of a stock showing in the detail 
  const [value, setValue] = useState({})

  useEffect(() => {
    // when the watchlist changes, reset the state and fetch every stock in the watchlist
    setState([])
    watchList.map((stock) => (
      fetch(ServerURL + "/history?symbol=" + stock.symbol)
        .then(res => res.json())
        .then(data =>
          data.map(stock => {
            return {
              name: stock.name,
              symbol: stock.symbol,
              timestamp: new Date(stock.timestamp.substring(0, 10)),
              open: stock.open,
              high: stock.high,
              low: stock.low,
              close: stock.close,
              volumes: stock.volumes
            };
          })
        )
        .then(stocks => setState((prev) => {
          return prev.concat(stocks[0]);
        })
        )
    ))
  }, [watchList]);

  return (
    <View style={styles.container}>
      <ScrollView style={{}}>
        {state
          .map((x) => (
            <StockComponent
              name={x}
              key={x.name}
              onPress={(stock) => {
                setValue(stock)
              }}
              {...x} />
          ))}
      </ScrollView>
      <View>
        <View style={styles.details}>
          <View style={styles.detailsHead}>
            <View>
              <Text style={styles.detailsHeadText}>
                {value.name}
              </Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsText}>
                OPEN:
                </Text>
              <Text style={styles.detailsValue}>
                {value.open}
              </Text>
            </View>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsText}>
                LOW:
                </Text>
              <Text style={styles.detailsValue}>
                {value.low}
              </Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsText}>
                CLOSE:
              </Text>
              <Text style={styles.detailsValue}>
                {value.close}
              </Text>
            </View>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsText}>
                HIGH:
                </Text>
              <Text style={styles.detailsValue}>
                {value.high}
              </Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsText}>
                VOLUME:
                </Text>
              <Text style={styles.detailsValue}>
                {value.volumes}
              </Text>
            </View>
            <View style={styles.detailsItem}>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  resultItem: {
    paddingHorizontal: scaleSize(17),
    paddingVertical: scaleSize(17),
    backgroundColor: "#000000",
    borderBottomColor: "#555555",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#555555",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },
  resultItemName: {

  },
  resultItemNameText: {
    color: '#ffffff',
    fontSize: scaleSize(18),
    paddingVertical: scaleSize(5),
  },
  resultItemClose: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  resultItemCloseText: {
    color: '#ffffff',
    fontSize: scaleSize(18),
    paddingVertical: scaleSize(8),
  },
  resultItemGain: {
    justifyContent: 'flex-end',
    marginLeft: scaleSize(20),
    borderRadius: scaleSize(10)
  },
  resultItemGainText: {
    color: '#ffffff',
    fontSize: scaleSize(18),
    paddingVertical: scaleSize(8),
    textAlign: "center",
    width: scaleSize(85)
  },
  details: {
    backgroundColor: '#333333',
  },
  detailsHead: {
    borderBottomColor: "#888888",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailsHeadText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: scaleSize(20),
    paddingVertical: scaleSize(10),
  },
  detailsRow: {
    flexDirection: 'row',
    borderBottomColor: "#888888",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailsItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailsText: {
    color: '#888888',
    margin: 1
  },
  detailsValue: {
    color: '#ffffff',
    margin: 1
  },
});