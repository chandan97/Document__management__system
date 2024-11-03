import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

const Login = ({ onLogin, onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            // Send login request to the backend
            const response = await axios.post('http://localhost:8000/token', new URLSearchParams({
                username,
                password
            }));

            // Store the token in local storage for future requests
            localStorage.setItem('token', response.data.access_token);
            onLogin(); // Call the onLogin function passed as prop to indicate successful login
            
            // Show success toast notification
            toast.success('Login successful!');
        } catch (err) {
            // Handle error (e.g., invalid credentials)
            if (err.response && err.response.data) {
                setError(err.response.data.detail);
                toast.error(err.response.data.detail); // Show error toast notification
            } else {
                setError('An error occurred during login.');
                toast.error('An error occurred during login.'); // Show error toast notification
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <p className="mt-3">
                Not registered? <button onClick={onRegister} className="btn btn-link">Register here</button>
            </p>
        </div>
    );
};

export default Login;