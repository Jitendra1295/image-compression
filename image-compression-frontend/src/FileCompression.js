import React, { useState, useRef } from 'react';
import './App.css';

function FileCompression() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [compressedFileUrl, setCompressedFileUrl] = useState(null);
    const fileInputRef = useRef(null);
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const compressFile = async () => {
        const formData = new FormData();
        formData.append('image', selectedFile); // Use 'image' as the field name

        try {
            const response = await fetch('https://image-compression-9f6y-cyan.vercel.app/compress-image', { // Update endpoint to /compress-image
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const compressedImageBlob = await response.blob(); // Parse response as Blob
            const url = URL.createObjectURL(compressedImageBlob);
            setCompressedFileUrl(url); // Store the compressed image URL in state
            console.log("CompressedFileUrl::", compressedImageBlob, url);
            alert('File compressed!');
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const downloadFile = async () => {
        try {
            if (compressedFileUrl) {
                // Create a temporary anchor element to trigger the download
                const link = document.createElement('a');
                link.href = compressedFileUrl;
                link.setAttribute('download', 'compressed.zip'); // Set the filename
                document.body.appendChild(link);
                link.click();

                // Clean up
                document.body.removeChild(link);
            } else {
                throw new Error('No compressed file URL available');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const cancelCompression = () => {
        setSelectedFile(null);

        setCompressedFileUrl(null);

        fileInputRef.current.value = '';
    };

    return (
        <div className="container">
            <h1> Image Compression </h1>
            <div className="input-group">
                <label htmlFor="fileInput">Select File:</label>
                {/* Use the ref attribute to assign the ref to the file input element */}
                <input ref={fileInputRef} type="file" id="fileInput" onChange={handleFileChange} />
            </div>
            <div className="btn-group">
                <button className="btn btn-primary" onClick={compressFile}>Compress</button>
                <button className="btn btn-primary" onClick={downloadFile}>Download</button>
                <button className="btn btn-danger" onClick={cancelCompression}>Cancel</button>
            </div>
        </div>
    );
}

export default FileCompression;