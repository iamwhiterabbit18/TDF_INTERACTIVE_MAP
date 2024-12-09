import { useState , useEffect } from 'react'
import styles from "./styles/markerModalStyles.module.scss"
import marker from "../../../assets/icon/Icons";
import icons from "../../../assets/for_landingPage/Icons";
import axios from 'axios';
import UseToast from '../utility/AlertComponent/UseToast';

export default function MarkerModal({ onClose ,markerData, fetchMarkers}) {
    const mountToast = UseToast();
    const [isMarker, setMarker] = useState(null);
    const [areaName, setAreaName] = useState(markerData?.areaName || "");
    const [iconType, setIconType] = useState(markerData?.iconType || ""); 
    const [isAreaNameEdited, setIsAreaNameEdited] = useState(false);
    const [isIconTypeEdited, setIsIconTypeEdited] = useState(false);

    // Handle changes to areaName or iconType
    useEffect(() => {
        if (areaName !== markerData?.areaName) {
            setIsAreaNameEdited(true);
        } else {
            setIsAreaNameEdited(false);
        }

        if (iconType !== markerData?.iconType) {
            setIsIconTypeEdited(true);
        } else {
            setIsIconTypeEdited(false);
        }
    }, [areaName, iconType, markerData]);
  
    

    const handleIconTypeChange = (e) => {
        const selectedType = e.target.value;
        setIconType(selectedType); // Update selected icon type
        //setMarker(marker[selectedType]); // Dynamically set the corresponding marker icon
    };

    const handleSave = async (e) => {
        e.preventDefault();
          // Check if no changes have been made
          if (!isAreaNameEdited && !isIconTypeEdited) {
            mountToast('No changes detected for Marker Name or Icon Type', 'warn');
            return;
        }
        try {
            const response = await axios.put(`http://localhost:5000/api/markers/${markerData._id}`, {
                areaName,
                iconType,
            });

            mountToast(response.data.message, 'success');
            onClose(); // Close modal
        } catch (error) {
            console.error('Error updating marker:', error);
            mountToast('Error updating marker', 'error');
        }
    };

    const handleClose = () => {
        onClose();
    };

    console.log(isMarker);

    return (
        <>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={handleClose}> 
                    <img src={icons.close} alt="close" />
                </span>

                <div className={styles.header}>
                    <span className = { styles.txtTitle}>
                        EDIT MARKER
                    </span>
                </div>

                <form className = { styles.form }>
                    <div className = { styles.editContent }>
                        <label className = { styles.txtSubTitle }>Marker Name</label>
                        <input 
                            type="text"
                            value={areaName}
                            onChange={(e) => setAreaName(e.target.value)}
                            required
                        />
                        <div className = { styles.iconType }>
                            <div className = { styles.section1 }>
                                <label className = { styles.txtSubTitle }>Icon Type</label>
                                <select value={iconType} onChange={handleIconTypeChange}>
                                    {/*<option value="">Select an Icon</option>*/}
                                    <option value="Others">Pin</option>
                                    <option value="Poultry">Bird</option>
                                    <option value="Structure">Building</option>
                                    <option value="Swarm">Bee</option>
                                    <option value="Crops">Crops</option>
                                    <option value="Fishery">Fish</option>
                                </select>
                            </div>
                            <div className = { styles.section2 }>
                            {isMarker && <img className={styles.marker} src={isMarker} alt="Selected Icon" />}                            </div>
                        </div>
                    </div>

                    <div className = { styles.btns }>
                        <button 
                            className = { `${styles.saveBtn} ${styles.txtTitle}` }
                            type="submit" 
                            onClick={handleSave}
                            // onClick={handleUpdate}
                        >
                            Save
                        </button>
                        <button 
                            className = { `${styles.cancelBtn} ${styles.txtTitle}` } 
                            type="button" 
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
} 