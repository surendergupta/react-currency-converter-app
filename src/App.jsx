import React from 'react'
import axios from 'axios'
import Dropdown from 'react-dropdown'
import { HiSwitchHorizontal } from 'react-icons/hi'
import { ToastContainer, toast } from 'react-toastify';
import { Circles } from 'react-loader-spinner';

import 'react-dropdown/style.css'
import './App.css'
const App = () => {
  const [input, setInput] = React.useState(0)
  const [output, setOutput] = React.useState(0)
  const [from, setFrom] = React.useState('USD')
  const [to, setTo] = React.useState('INR')
  const [currencies, setCurrencies] = React.useState([])
  const [loading, setLoading] = React.useState(false);

  

  React.useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
        setCurrencies(res.data.rates);
      } catch (error) {
        console.error(error);
        toast.error(`Failed to fetch currency rates for ${from}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();    
  }, [from])

  const convert = async() => { 
    if (!input || isNaN(input) || input <= 0) {
      toast.warn("Please enter a valid amount greater than 0.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const rate = res.data.rates[to];
      const result = input * rate;
      setOutput(result);
      toast.success(`Converted successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(`Conversion failed. Please try again later.`);
    } finally {
      setLoading(false);
    } 
  }

  const currencyOptions = Object.keys(currencies);

  return (
    <div className='App'>
      <h1>React Currency Converter App</h1>
      <div className='currency-container'>
        <div className='currency-input'>
          <input 
            type='number' 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            min="0"
            placeholder='Enter amount' 
          />
        </div>
        <div className='currency-select'>
          <Dropdown 
            options={currencyOptions} 
            onChange={(e) => setFrom(e.value)} 
            value={from} 
          />
        </div>
        <div className='currency-icon'>
          <HiSwitchHorizontal 
            onClick={() => [setFrom(to), setTo(from)]} 
          />
        </div>        
        <div className='currency-select'>
          <Dropdown 
            options={currencyOptions} 
            onChange={(e) => setTo(e.value)} 
            value={to} 
          />
        </div>
      </div>
      {loading && (
        <div style={{ marginTop: '20px' }}>
          <Circles height="50" width="50" color="#4fa94d" />
        </div>
      )}
      <div className='show-conversion'>
        <button 
          onClick={convert} 
          disabled={!input || input === '' || input <= 0 || isNaN(input) || loading} 
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
        <h2>Converted Amount: {output}</h2>
        <h2>Current Rate: {currencies[to]}</h2>
        {output > 0 && (
          <h4>{`${input} ${from} = ${output.toFixed(2)} ${to}`}</h4>
        )}
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={4000} 
        pauseOnHover 
        theme="dark"
        limit={1}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
      />
    </div>
  )
}

export default App