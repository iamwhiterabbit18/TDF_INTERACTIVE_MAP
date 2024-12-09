import { useState } from 'react'
import styles from "./styles/markerModalStyles.module.scss"
import marker from "../../../assets/icon/Icons";
import icons from "../../../assets/for_landingPage/Icons";

import UseToast from '../utility/AlertComponent/UseToast';

export default function MarkerModal({ onClose }) {
    const [isMarker, setMarker] = useState(null);

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
                            // value={title}
                            // onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <div className = { styles.iconType }>
                            <div className = { styles.section1 }>
                                <label className = { styles.txtSubTitle }>Icon Type</label>
                                <select onChange={(e) => setMarker(marker[e.target.value])}>
                                    <option value="">--Select--</option> 
                                    <option value="Others">Pin</option>
                                    <option value="Poultry">Bird</option>
                                    <option value="Structure">Building</option>
                                    <option value="Swarm">Bee</option>
                                    <option value="Crops">Crops</option>
                                    <option value="Fishery">Fish</option>
                                </select>
                            </div>
                            <div className = { styles.section2 }>
                                <img className = { styles.marker} src = { isMarker } />
                            </div>
                        </div>
                    </div>

                    <div className = { styles.btns }>
                        <button 
                            className = { `${styles.saveBtn} ${styles.txtTitle}` }
                            type="submit" 
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