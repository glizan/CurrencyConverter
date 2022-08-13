import React, { createContext, useState, useEffect } from "react"
import { Alert } from "react-native";
import { CurrencyApi } from "../util/CurrencyApi"

export const ConversionContext = createContext()

const DEFAULT_BASE_CURRENCY = 'USD'
const DEFAULT_QUOTE_CURRENCY = 'CAD'

export const ConversionContextProvider = ({ children }) => {
  const [baseCurrency, _setBaseCurrency] = useState(DEFAULT_BASE_CURRENCY)
  const [quoteCurrency, setQuoteCurrency] = useState(DEFAULT_QUOTE_CURRENCY)
  const [date, setDate] = useState()
  const [rates, setRates] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const setBaseCurrency = currency => {
    setIsLoading(true)
    return CurrencyApi(`/latest?base=${currency}`)
      .then(res => {
        _setBaseCurrency(currency)
        setDate(res.date)
        setRates(res.rates)
      })
      .catch(error => {
        Alert.alert("Sorry, something went wrong.", error.message)
      })
      .finally(()=>{setIsLoading(false)})
  }

  const swapCurrencies = () => {
    setBaseCurrency(quoteCurrency)
    setQuoteCurrency(baseCurrency)
  }

  const contextValue = {
    baseCurrency,
    quoteCurrency,
    setBaseCurrency,
    setQuoteCurrency,
    swapCurrencies,
    date,
    rates,
    isLoading,
  }

useEffect(() => {
  setBaseCurrency(DEFAULT_BASE_CURRENCY);
}, [])


  return (
    <ConversionContext.Provider value={contextValue}>
      {children}
    </ConversionContext.Provider>
  )
}