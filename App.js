import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_URL = "https://api.apilayer.com/exchangerates_data/convert";
const API_KEY = "API_KEY";

const App = () => {
  const [exchangeData, setExchangeData] = useState(null);
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const targetCurrency = "EUR";
  const [convertedAmount, setConvertedAmount] = useState(null);
  const currencyCodes = exchangeData ? Object.keys(exchangeData.rates) : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setExchangeData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const convertCurrency = () => {
    if (amount !== "") {
      const apiUrl = `${API_URL}?to=${targetCurrency}&from=${selectedCurrency}&amount=${amount}&apikey=${API_KEY}`;

      const requestOptions = {
        method: "GET",
      };

      fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const convertedAmount = data.rates[toCurrency] * parseFloat(amount);
            setConvertedAmount(convertedAmount.toFixed(2));
          } else {
            console.log("Error in the API response");
          }
        })
        .catch((error) => console.log("Error", error));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType="numeric"
        />
        {exchangeData ? (
          <Picker
            style={styles.input}
            selectedValue={selectedCurrency}
            onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
          >
            {currencyCodes.map((currencyCode) => (
              <Picker.Item
                key={currencyCode}
                label={currencyCode}
                value={currencyCode}
              />
            ))}
          </Picker>
        ) : (
          <Text>Loading currencies...</Text>
        )}
      </View>
      <Button title="Convert" onPress={convertCurrency} />
      {convertedAmount !== null && (
        <Text>
          {convertedAmount}
          {targetCurrency}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  input: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    width: 50,
  },
});

export default App;
