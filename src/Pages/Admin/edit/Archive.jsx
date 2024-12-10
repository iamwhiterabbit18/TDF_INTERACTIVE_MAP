import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

import icons from "../../../assets/for_landingPage/Icons";
import NavBar from './navBar/NavBar';
import styles from './styles/archiveStyles.module.scss';

import UseToast from '../utility/AlertComponent/UseToast';

export default function Archive() {
    const [archives, setArchives] = useState([]);
    const mountToast = UseToast();
    const location = useLocation();
    const [fetchLimit, setFetchLimit] = useState(10);

    useEffect(() => {
        // Add or remove className based on current page
        const rootDiv = document.getElementById("root");
        if (location.pathname === "/archive") {
          rootDiv.classList.add(styles.rootDiv);
        } else {
          rootDiv.classList.remove(styles.rootDiv);
        }
    }, [location]);

   {/*  useEffect(() => { //Fetch all Markers
        // Fetch archived items
        const fetchArchives = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/archive/archivesData'); // Update with your API endpoint
                setArchives(response.data);
            } catch (error) {
                mountToast('Error fetching archives', 'error');
                console.error('Error fetching archives:', error);
            }
        };

        fetchArchives();
    }, []);*/}

    const fetchArchives = async (limit) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/archive/archivesData?limit=${limit}`); // Pass limit as query param
            setArchives(response.data);
        } catch (error) {
            mountToast('Error fetching archives', 'error');
            console.error('Error fetching archives:', error);
        }
    };

    useEffect(() => {
        fetchArchives(fetchLimit); // Fetch archives with the current limit
    }, [fetchLimit]); // Re-run when fetchLimit changes


        // Delete handler
        const handleDelete = async (archiveId) => {
            try {
                const confirm = window.confirm("Are you sure you want to permanently delete this item?");
                if (!confirm) return;

                const response = await axios.delete(`http://localhost:5000/api/delete/archive/${archiveId}`);
                mountToast(response.data.message, 'success');
                fetchArchives(fetchLimit);

                // Update UI by filtering out the deleted item
                setArchives((prev) => prev.filter((archive) => archive._id !== archiveId));
            } catch (error) {
                console.error('Error deleting archive entry:', error);
                mountToast('Error deleting archive entry', 'error');
            }
        };
        

                // Restore handler
                const handleRestore = async (archiveId, type) => {
                    try {
                        const confirm = window.confirm(
                            `Are you sure you want to restore this ${type === 'document' ? 'document' : 'field'}?`
                        );
                        if (!confirm) return;

                        // Choose the correct endpoint based on the type
                        const endpoint = type === 'document' ? `http://localhost:5000/api/restore/user/${archiveId}` : `http://localhost:5000/api/restore/${archiveId}`;

                        const response = await axios.put(endpoint);
                        mountToast(response.data.message, 'success');

                        // Update UI by filtering out the restored item
                        setArchives((prev) => prev.filter((archive) => archive._id !== archiveId));
                    } catch (error) {
                        console.error('Error restoring archive entry:', error);
                        mountToast('Error restoring archive entry', 'error');
                    }
                };

    return (
        <>
            <NavBar />
            <div className={styles.archiveContainer}>
                <div className={styles.header}>
                    <span className={styles.txtTitle}>Deleted Items</span>
                </div>
                <span className={`${styles.txtTitle} ${styles.archiveHeader}`}>Archive List</span>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Collection Name</th>
                            <th>Type</th>
                            <th>Data</th>
                            <th>Date&Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {archives.length > 0 ? (
                            archives.map((archive) => {
                                const isDocument = archive.originalCollection === 'User'; // Check if it's a document (User)
                                const dataToDisplay = isDocument ? (
                                    <ul className={styles.noBullets}>
                                    <li><strong>Name:</strong> {archive.data.name || 'N/A'}</li>
                                    <li><strong>Email:</strong> {archive.data.email || 'N/A'}</li>
                                    <li><strong>Role:</strong> {archive.data.role || 'N/A'}</li>
                                </ul>
                                ) : (
                                    archive.data[archive.fieldName] // For fields, show the file name
                                );

                                return (
                                <tr key={archive._id}>
                                        <td>{archive.originalCollection}</td>
                                        <td>{archive.fieldName}</td>
                                        <td>{dataToDisplay}</td>
                                        <td>{moment(archive.archivedAt).format('MMM D, YYYY , h:mm A')}</td> 
                                    <td>
                                        <div className={styles.actionBtns}>
                                            
                                                <button className={styles.editBtn} onClick={() => handleRestore(archive._id,
                                                    archive.originalCollection === 'User' ? 'document' : 'field')}>
                                                
                                                    <img className={`${styles.icon} ${styles.undo}`} src={icons.undo} alt="Restore Item" />
                                                </button>
                                            
                                                <button className={styles.delBtn} onClick={() => handleDelete(archive._id)} >
                                                    <img className={`${styles.icon} ${styles.delete}`} src={icons.remove} alt="Delete Item" />
                                                </button>
                                            
                                        </div>
                                    </td>
                                </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5">No archived items found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </>
    );
}
