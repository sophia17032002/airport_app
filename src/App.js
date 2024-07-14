import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import image from './assets/image.jpeg';
import logo from './assets/logo1.png';
import Select from 'react-select';
import Arrow from './Icons/ArrowIcon';

function App() {
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [cabin, setCabin] = useState(null);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [departureTimeFrom, setDepartureTimeFrom] = useState('');
    const [departureTimeTo, setDepartureTimeTo] = useState('');

    const getCurrentDate = () => {
        const currentDate = new Date();
        return currentDate.toISOString();
    };

    const getNinetyDaysFromNow = () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 90);
        return currentDate.toISOString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const from = getCurrentDate();
        const to = getNinetyDaysFromNow();

        const json_data = {
            origin: origin ? origin.value : '',
            destination: destination ? destination.value : '',
            partnerPrograms: [
                'Air Canada', 'United Airlines', 'KLM', 'Qantas',
                'American Airlines', 'Etihad Airways', 'Alaska Airlines',
                'Qatar Airways', 'LifeMiles'
            ],
            stops: 2,
            departureTimeFrom: from,
            departureTimeTo: to,
            isOldData: false,
            limit: 302,
            offset: 0,
            cabinSelection: cabin ? [cabin.value] : [],
            date: new Date().toISOString(),
        };

        setDepartureTimeFrom(from);
        setDepartureTimeTo(to);

        try {
            const response = await axios.post('https://cardgpt.in/apitest', json_data, {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                }
            });

            if (response.data && response.data.data && response.data.data.length > 0) {
                setResults(response.data.data);
                setError('');
            } else {
                setResults([]);
                setError('No results found. Try another search route.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data. Please try again later.');
            setResults([]);
        }
    };

    const customStyles = {
        control: (base) => ({
            ...base,
            backgroundColor: 'black',
            color: '#2D6C69',
            width: '200px', 
        }),
        singleValue: (base) => ({
            ...base,
            color: '#909393',
        }),
    };

    const originOptions = [
        { value: 'JFK', label: 'JFK' },
        { value: 'DEL', label: 'DEL' },
        { value: 'SYD', label: 'SYD' },
        { value: 'BOM', label: 'BOM' },
        { value: 'BNE', label: 'BNE' },
        { value: 'BLR', label: 'BLR' },
    ];

    const destinationOptions = [
        { value: 'JFK', label: 'JFK' },
        { value: 'DEL', label: 'DEL' },
        { value: 'SYD', label: 'SYD' },
        { value: 'LHR', label: 'LHR' },
        { value: 'CDG', label: 'CDG' },
        { value: 'DOH', label: 'DOH' },
        { value: 'SIN', label: 'SIN' },
    ];

    const cabinOptions = [
        { value: 'Economy', label: 'Economy' },
        { value: 'Business', label: 'Business' },
        { value: 'First', label: 'First' },
    ];

    return (
        <div className="App">
            <header className="App-header">
                <img src={image} className="App-logo" alt="logo" />
                <h1 className="App-title">Flight Search</h1>
            </header>
            <main className="App-main">
                <form onSubmit={handleSubmit} className="search-form">
                    <div className="form-group">
                        <label htmlFor="origin">Origin:</label>
                        <Select
                            id="origin"
                            value={origin}
                            onChange={(selectedOption) => setOrigin(selectedOption)}
                            options={originOptions}
                            placeholder="Select Origin"
                            styles={customStyles}
                            isSearchable={false}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="destination">Destination:</label>
                        <Select
                            id="destination"
                            value={destination}
                            onChange={(selectedOption) => setDestination(selectedOption)}
                            options={destinationOptions}
                            placeholder="Select Destination"
                            styles={customStyles}
                            isSearchable={false}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cabin">Cabin Selection:</label>
                        <Select
                            id="cabin"
                            value={cabin}
                            onChange={(selectedOption) => setCabin(selectedOption)}
                            options={cabinOptions}
                            placeholder="Select Cabin"
                            styles={customStyles}
                            isSearchable
                        />
                    </div>
                    <button type="submit">Search</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {results.length > 0 && (
                    <div className="results">
                        {results.map((result, index) => (
                            <div key={index} className="result-item">
                                <img src={logo} className="flight-logo" alt="flight-logo1" />
                                <p className='partner-name'>{result.partner_program}</p>
                                <p>{origin.value} <Arrow /> {destination.value}<br />{new Date(departureTimeFrom).toLocaleDateString()} - {new Date(departureTimeTo).toLocaleDateString()}</p>
                                 <p className="miles">
                                    {result.min_business_miles ? `${result.min_business_miles}` : 'N/A'}
                                    <br />
                                </p>
                                <span className="description">Min Business Miles</span>
                                <p className="miles">
                                    {result.min_economy_miles ? (
                                        <>
                                            <span className="miles">{result.min_economy_miles}</span>
                                            <span className="tax"> + ${result.min_economy_tax}</span>
                                        </>
                                    ) : 'N/A'}
                                    
                                </p>
                                <span className="description">Min Economy Miles</span>
                                <p className="miles">
                                    {result.min_first_miles ? `${result.min_first_miles}` : 'N/A'}
                                    
                                </p>
                                 <span className="description">Min First Miles</span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
