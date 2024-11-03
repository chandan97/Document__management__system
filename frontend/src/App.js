import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link,Navigate } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Upload from './components/Upload';
import { ToastContainer, toast } from 'react-toastify';

function App() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [generatedAnswer, setGeneratedAnswer] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(true);

    const handleRegister = () => {
        setShowLogin(false);
        toast.success('Registration successful! Please log in.');
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowLogin(false);
        toast.success('Login successful!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/query/', { query });
            setGeneratedAnswer(response.data.generated_answer);
            setResults(response.data.results || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error fetching data. Please try again.');
        }
    };

    return (
        <Router>
            <div className="App container">
                <h1 className="text-center my-4">Document Management System</h1>
                <nav className="mb-4">
                    {isLoggedIn && (
                        <>
                            <Link className="btn btn-primary mx-2" to="/upload">Upload Files</Link>
                            <button className="btn btn-danger mx-2" onClick={() => {
                                setIsLoggedIn(false);
                                toast.info('Logged out successfully.');
                            }}>Logout</button>
                        </>
                    )}
                    {!isLoggedIn && (
                        <Link className="btn btn-secondary" to="/" onClick={() => setShowLogin(true)}>Login</Link>
                    )}
                </nav>

                <Routes>
                    <Route path="/" element={
                        isLoggedIn ? (
                            <>
                                <form onSubmit={handleSubmit} className="mb-4">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Enter your query"
                                        required
                                        className="form-control"
                                    />
                                    <button type="submit" className="btn btn-success mt-2">Submit</button>
                                </form>
                                <div id="results">
                                    {results.map((result, index) => (
                                        <div key={index} className="card mb-3">
                                            <div className="card-body">
                                                <h3 className="card-title">{result.title}</h3>
                                                <p className="card-text">{result.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {generatedAnswer && (
                                        <div className="alert alert-info">
                                            <h4>Generated Answer:</h4>
                                            <p>{generatedAnswer}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : showLogin ? (
                            <Login onLogin={handleLogin} onRegister={() => setShowLogin(false)} />
                        ) : (
                            <Register onRegister={handleRegister} onLogin={handleLogin} />
                        )
                    } />
                    <Route path="/upload" element={isLoggedIn ? <Upload /> : <Navigate to="/" />} />
                </Routes>

                <ToastContainer />
            </div>
        </Router>
    );
}

export default App;