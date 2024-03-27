import React from "react";
import imageCompression from "browser-image-compression";

class ImageCompressor extends React.Component {
    constructor() {
        super();
        this.state = {
            compressedLink: "https://testersdock.com/wp-content/uploads/2017/09/file-upload-1280x640.png",
            originalImage: null,
            originalLink: "",
            clicked: false,
            compressedImage: "",
            uploadImage: false
        };
        this.fileInputRef = React.createRef();
    }

    handleFileChange = (event) => {
        const imageFile = event.target.files[0];
        console.log("handleFileChange :", imageFile);
        this.setState({
            originalLink: URL.createObjectURL(imageFile),
            originalImage: imageFile,
            outputFileName: imageFile.name,
            uploadImage: true
        });
    };

    handleCancel = () => {
        this.setState({
            originalImage: null,
            originalLink: "",
            compressedLink: "",
            clicked: false,
            uploadImage: false
        });
        this.fileInputRef.current.value = "";
    };

    compressImage = (event) => {
        event.preventDefault();

        const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 800,
            useWebWorker: true
        };

        if (this.state.originalImage === null) {
            alert("Please select image");
            return;
        }

        if (options.maxSizeMB >= this.state.originalImage.size / 1024) {
            alert("Bring a bigger image");
            return;
        }

        imageCompression(this.state.originalImage, options).then(compressedImage => {
            const downloadLink = URL.createObjectURL(compressedImage);
            this.setState({
                compressedImage: compressedImage,
                compressedLink: downloadLink,
                clicked: true
            });
            alert("Image compressed successfully");
        });
    };

    render() {
        return (
            <div className="container">
                <h1>Image Compression</h1>
                <div className="input-group">
                    <div className="input-group">
                        <label htmlFor="fileInput">Select File:</label>
                        <input
                            ref={this.fileInputRef}
                            type="file"
                            accept="image/*"
                            className="input-image"
                            onChange={this.handleFileChange}
                        />
                    </div>
                    <div className="btn-group">
                        <button className="btn btn-primary" onClick={this.compressImage}>Compress</button>
                        <a
                            href={this.state.compressedLink}
                            download={this.state.outputFileName}
                            className="btn btn-primary"
                        >
                            Download
                        </a>
                        <button className="btn btn-danger" onClick={this.handleCancel}>Cancel</button>
                    </div>
                    {/* Display original image */}
                    {this.state.uploadImage && (
                        <div>
                            <h3>Original Image:</h3>
                            <img src={this.state.originalLink} width={"50%"} height={"30%"} alt="Original" />
                            <p>Size: {Math.round(this.state.originalImage.size / 1024)} KB</p>
                        </div>
                    )}
                    {/* Display compressed image */}
                    {this.state.clicked && (
                        <div>
                            <h3>Compressed Image:</h3>
                            <img src={this.state.compressedLink} width={"50%"} height={"30%"} alt="Compressed" />
                            <p>Size: {Math.round(this.state.compressedImage.size / 1024)} KB</p>
                        </div>
                    )}
                </div>

            </div>
        );
    }
}

export default ImageCompressor;
