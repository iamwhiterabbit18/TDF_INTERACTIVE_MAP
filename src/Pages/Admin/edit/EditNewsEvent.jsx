import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles/EditNewsEvent.module.scss';

export default function NewsEventImage({ isOpen, onClose }) {
    const [imageFile, setImageFile] = useState(null); // For adding new images
    const [newImageFile, setNewImageFile] = useState(null); // For updating an existing image
    const [images, setImages] = useState([]); // Holds the list of images
    const [selectedImageFilename, setSelectedImageFilename] = useState(null); // Store the filename of the selected image
    const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false); // State for add image modal
    
    // Fetch images from the single document
    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/images');
            const document = response.data[0]; // Assuming there's only one document
            setImages(document.images || []); // Set the images array
        } catch (error) {
            console.error("Error fetching images", error);
        }
    };

    // Handle file change for adding new images
    const handleFileChange = (e) => {
        setImageFile(Array.from(e.target.files)); // Multiple files can be selected
    };

    // Handle file change for updating an existing image
    const handleUpdateFileChange = (e) => {
        setNewImageFile(e.target.files[0]); // Only one file is selected for update
    };

    // Handle adding new images (POST)
    const handleUpload = async () => {
        const formData = new FormData();
        imageFile.forEach(file => {
            formData.append('images', file); // Name should match what's expected by the server
        });

        try {
            await axios.post(`http://localhost:5000/api/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Uploaded successfully!');
            fetchImages(); // Refresh image list after successful upload
            setIsAddImageModalOpen(false); // Close the add image modal
        } catch (error) {
            console.error("Error uploading images", error);
        }
    };

    // Handle updating a specific image (PUT)
    const handleUpdate = async () => {
        if (!newImageFile || !selectedImageFilename) {
            console.error("Missing file or filename");
            return;
        }

        const formData = new FormData();
        formData.append('image', newImageFile); // Append the selected file for update

        try {
            const response = await axios.put(`http://localhost:5000/api/images/${selectedImageFilename}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update the images array in the frontend
            setImages(response.data.images);
            setSelectedImageFilename(null); // Reset after update
            setNewImageFile(null); // Clear the file input
            alert('Update successfully!');
            fetchImages();
        } catch (error) {
            console.error("Error updating image:", error);
        }
    };

    // Handle deleting an image (DELETE)
    const handleDelete = async (filename) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/images/${filename}`);
            if (response.status === 200) {
                alert('Image deleted successfully!');
                fetchImages(); // Refresh image list after successful deletion
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error deleting image. Please try again.');
        }
    };

    // Fetch images when the modal is opened
    useEffect(() => {
        if (isOpen) {
            fetchImages();
        }
    }, [isOpen]);

    if (!isOpen) return null; // Don't render the modal if it isn't open

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <h2>{selectedImageFilename ? 'Update Image' : 'Manage News and Events'}</h2>

                    {/* Button to trigger the add image modal */}
                <button onClick={() => setIsAddImageModalOpen(true)}>
                    Add Images
                </button>

                {/* Section for updating an existing image */}
                {selectedImageFilename && (
                    <div>
                        <input type="file" onChange={handleUpdateFileChange} />
                        <button onClick={handleUpdate}>Update Image</button>
                    </div>
                )}

                {/* Add Image Modal */}
                {isAddImageModalOpen && (
                    <div>
                        <h3>Add New Images</h3>
                        <input type="file" multiple onChange={handleFileChange} />
                        <button onClick={handleUpload} > 
                            Upload New Images
                        </button>
                        <button onClick={() => setIsAddImageModalOpen(false)}>Cancel</button>
                    </div>
                )}

                {/* Table showing existing images */}
                <table className={styles.imageTable}>
                    <thead>
                        <tr>
                            <th>Image Filename</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.map((image, index) => (
                            <tr key={index}>
                                <td className={styles.fileName}>{image}</td>
                                <td className={styles.actionBtn}>
                                    <button onClick={() => setSelectedImageFilename(image)}>Edit</button>
                                    <button onClick={() => handleDelete(image)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
