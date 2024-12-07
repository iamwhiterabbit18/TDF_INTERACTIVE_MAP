import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

import icons from "../../../assets/for_landingPage/Icons";
import NavBar from './navBar/NavBar';
import styles from './styles/archiveStyles.module.scss'

import UseToast from '../utility/AlertComponent/UseToast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Archive() {
    // toast alert pop up
     const mountToast = UseToast();

    const location = useLocation();

    useEffect(() => {
        const rootDiv = document.getElementById("root");
    
        // Add or remove className based on current page
    
        if (location.pathname === "/archive") {
          rootDiv.classList.add(styles.rootDiv);
        } else {
          rootDiv.classList.remove(styles.rootDiv);
        }
      }, [location])

    return (
        <>
            <NavBar />

            <div className = { styles.archiveContainer }>
                <div className={styles.header}>
                    <span className = { styles.txtTitle }>Deleted Items</span>
                </div>

                <span className = { `${ styles.txtTitle} ${ styles.archiveHeader }` }>Archive List</span>

                <table className = { styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Data</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sample Name</td>
                            <td>Sample Name</td>
                            <td>Sample Name</td>
                            <td>Sample Name</td>
                            <td>
                                <div className = { styles.actionBtns }>
                                    <button className = {styles.editBtn}>
                                        <img className = { `${ styles.icon } ${ styles.undo}` } src = { icons.undo } alt = "Edit Item" />
                                    </button>
                                    <button className = {styles.delBtn}>
                                        <img className = { `${ styles.icon } ${ styles.delete}` } src = { icons.remove } alt = "Delete Item" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <ToastContainer />
        </>
    )
}