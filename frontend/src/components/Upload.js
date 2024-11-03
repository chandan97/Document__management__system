import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState(''); // State for title
    const [description, setDescription] = useState(''); // State for description
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSize = 5 * 1024 * 1024; // 5 MB

        if (selectedFile) {
            if (!allowedTypes.includes(selectedFile.type)) {
                setMessage('Please upload a valid file type (PDF or DOCX).');
                setFile(null);
                toast.error('Invalid file type. Please upload a PDF or DOCX.');
                return;
            }
            if (selectedFile.size > maxSize) {
                setMessage('File size exceeds 5 MB limit.');
                setFile(null);
                toast.error('File size exceeds 5 MB limit.');
                return;
            }
            setFile(selectedFile);
            setMessage(''); // Clear message if file is valid
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title || !description) {
            setMessage('Please fill in all fields and select a file to upload.');
            toast.error('Please fill in all fields and select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title); // Add title to formData
        formData.append('description', description); // Add description to formData

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('File uploaded successfully!');
            toast.success('File uploaded successfully!');
            setFile(null);
            setTitle(''); // Reset title
            setDescription(''); // Reset description
            e.target.reset(); // Reset the form
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Error uploading file. Please try again.');
            toast.error('Error uploading file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Upload File</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required 
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="text" 
                        placeholder="Description" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required 
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        required 
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
};

export default Upload;