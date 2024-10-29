import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import styles from './styles/EditNewsEvent.module.scss';

export default function NewsEventImage({ isOpen, onClose }) {
    const [imageFile, setImageFile] = useState([]); // For adding new images
    const [newImageFile, setNewImageFile] = useState(null); // For updating an existing image
    const [images, setImages] = useState([]); // Holds the list of images
    const [selectedImageFilename, setSelectedImageFilename] = useState(null); // Store the filename of the selected image
    const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false); // State for add image modal
    const [isUpdateModalOpen , setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen  , setisDeleteModalOpen] = useState(false);

    const [imagePreviews, setImagePreviews] = useState([]);

    const [uploadImagePreviews, setUploadImagePreviews] = useState([]); // Preview for adding images
    const [updatePreviewImages, setUpdatePreviewImages] = useState([]); // Preview for updating images

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    // Fetch images from the single document
    // Fetch images from the single document
const fetchImages = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/images');
        const document = response.data[0]; // Assuming there's only one document

        // Set the images array
        const fetchedImages = document.images || [];
        setImages(fetchedImages);

        // Generate image preview URLs based on the fetched images
        const imagePreviews = fetchedImages.map((img) => `http://localhost:5000/${img}`);

        // Set state to hold the preview URLs for the slider
        setImagePreviews(imagePreviews);
    } catch (error) {
        console.error("Error fetching images", error);
    }
};


    // Handle file change for adding new images with preview
    const handleAddFileChange = (e) => {
        const fileArray = Array.from(e.target.files);
        const imageUrls = fileArray.map((file) => URL.createObjectURL(file)); // Create URLs for previews

        const unsupportedFiles = fileArray.filter(file => !allowedTypes.includes(file.type));

        if (unsupportedFiles.length > 0) {
            alert('Unsupported file format. Only JPG, JPEG, and PNG images are allowed.');
            return;
        }

        setImageFile(fileArray); // Store actual files for submission
        setUploadImagePreviews(imageUrls); // Generate preview URLs for uploading
    };

    // Handle file change for updating an existing image with preview
    const handleUpdateFileChange = (e) => {
        const fileArray = Array.from(e.target.files);
        const imageUrls = fileArray.map((file) => URL.createObjectURL(file)); // Create URLs for previews

        const unsupportedFiles = fileArray.filter(file => !allowedTypes.includes(file.type));

        if (unsupportedFiles.length > 0) {
            alert('Unsupported file format. Only JPG, JPEG, and PNG images are allowed.');
            return;
        }

        setNewImageFile(fileArray[0]); // Only one file for update
        setUpdatePreviewImages(imageUrls); // Generate preview URLs for updating
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
            setUploadImagePreviews([]);
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
    
        // Use only the filename for the PUT request
        const filename = selectedImageFilename.split('/').pop(); // Get only the filename
    
        try {
            const response = await axios.put(`http://localhost:5000/api/images/uploads/images/${filename}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            // Update the images array in the frontend
            setImages(response.data.images);
            setSelectedImageFilename(null); // Reset after update
            setNewImageFile(null); // Clear the file input
            alert('Update successfully!');
            fetchImages();
            setUpdatePreviewImages([]);
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error("Error updating image:", error);
        }
    };
    

            // Handle deleting an image (DELETE)
            const handleDelete = async (fullImagePath) => {
                const filename = fullImagePath.split('/').pop(); // Get only the filename from the full path

                try {
                    const response = await axios.delete(`http://localhost:5000/api/images/uploads/images/${filename}`);
                    if (response.status === 200) {
                        alert('Image deleted successfully!');
                        fetchImages(); // Refresh image list after successful deletion
                    }
                } catch (error) {
                    console.error('Error deleting image:', error);
                    alert('Error deleting image. Please try again.');
                }
            };

    const cancelBtn = () => {
        setIsAddImageModalOpen(false);
        setIsUpdateModalOpen(false);
        setUploadImagePreviews([]);
        setUpdatePreviewImages([]);
    };

    // Fetch images when the modal is opened
    useEffect(() => {
        if (isOpen) {
            fetchImages();
        }
    }, [isOpen]);

    if (!isOpen) return null; // Don't render the modal if it isn't open

//Settings of Slick Carousel
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalEditingSection}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <h2>{selectedImageFilename ? 'Update Image' : 'Manage News and Events'}</h2>
    
                <button className={styles.saveBtn} onClick={() => setIsAddImageModalOpen(true)}>
                    Add Images
                </button>
    
                {/* Carousel for existing images */}
                {images.length > 0 ? (
                    <div className={styles.imageCarousel}>
                        <Slider {...settings}>
                            {imagePreviews.map((image, index) => (
                                <div key={index} className="slick-slide">
                                    <img
                                        src={image}
                                        alt={`Uploaded preview ${index}`}
                                        className={styles.carouselImage}
                                    />
                                    <button
                                        className={styles.saveBtn}
                                        type="button"
                                        onClick={() => {
                                            setSelectedImageFilename(image); // Select image for updating
                                            setIsUpdateModalOpen(true);
                                        }}
                                    >
                                        Update Image
                                    </button>
                                    <button
                                        className={styles.closeBtn}
                                        onClick={() => {
                                            handleDelete(image); // Handle delete
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </Slider>
                    </div>
                ) : (
                    <p className={styles.noImageMessage}>No image available</p> // Message when no images are available
                )}
        
    
    
                {/* Add Image Modal */}
                {isAddImageModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h3>Upload New Images</h3>
                            <input 
                                type="file" 
                                accept="image/jpeg, image/jpg, image/png" 
                                multiple 
                                onChange={handleAddFileChange} 
                            />
                            {/* Preview New Images Before Upload */}
                            <h2>Preview Image:</h2>
                            {uploadImagePreviews.length > 0 && (
                                <div className={styles.imageCarousel}>
                                    <Slider {...settings}>
                                        {uploadImagePreviews.map((image, index) => (
                                            <div key={index} className="slick-slide">
                                                <img
                                                    src={image}
                                                    alt={`Uploaded preview ${index}`}
                                                    className={styles.carouselImage}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            )}
                            <button type="button" className={styles.saveBtn} onClick={handleUpload}>Upload</button>
                            <button type="button" className={styles.closeBtn} onClick={cancelBtn}>Cancel</button>
                        </div>
                    </div>
                )}
    
                {/* Update Image Modal */}
                {isUpdateModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h3>Update Image:</h3>
                            <input 
                                type="file" 
                                accept="image/jpeg, image/jpg, image/png" 
                                onChange={handleUpdateFileChange} 
                            />
                            {/* Preview Update Images */}
                            <h2>Update Preview Image</h2>
                            <div className={styles.updatePreview}>
                                {updatePreviewImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Preview ${index}`}
                                    className={styles.previewImage}
                                />
                                ))}
                            </div>
                            <button type="button" className={styles.saveBtn} onClick={handleUpdate}>Upload</button>
                            <button type="button" className={styles.closeBtn} onClick={cancelBtn}>Cancel</button>
                        </div>
                    </div>
                )}
    
                {/* Delete Modal */}
                {isDeleteModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h3>Confirm Delete</h3>
                            <p>Are you sure you want to delete this image?</p>
                            <button type="button" className={styles.saveBtn} onClick={() => handleDelete(selectedImageFilename)}>Yes, Delete</button>
                            <button type="button" className={styles.closeBtn} onClick={() => setisDeleteModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                )}
    
                <button className={styles.closeBtn} type="button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
    
}
