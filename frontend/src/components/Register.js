import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

const Register = ({ onRegister, onLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            // Send registration request to the backend
            await axios.post('http://localhost:8000/register', {
                username,
                email,
                password
            });
            toast.success('Registration successful! Please log in.'); // Show success toast notification
            onLogin(); // Call the onLogin function to redirect to the login page
        } catch (err) {
            // Handle error (e.g., username already exists)
            if (err.response && err.response.data) {
                setError(err.response.data.detail);
                toast.error(err.response.data.detail); // Show error toast notification
            } else {
                setError('An error occurred during registration.');
                toast.error('An error occurred during registration.'); // Show error toast notification
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Register</h2>
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
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <p className="mt-3">
                Already registered? <button onClick={onLogin} className="btn btn-link">Login here</button>
            </p>
        </div>
    );
};

export default Register;