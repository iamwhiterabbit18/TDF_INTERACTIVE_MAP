import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '/src/Pages/Admin/ACMfiles/authContext';
import styles from  '/src/Pages/Admin/edit/styles/UserManagement.module.scss';  // Import CSS
import UserModal from './UserModal'; // Component for handling modal input

import icons from "../../../assets/for_landingPage/Icons";
import { motion, AnimatePresence } from 'framer-motion'
import Confirmation from '../utility/ConfirmationComponent/Confirmation';
import NavBar from './navBar/NavBar';
import AccessBtn from '/src/Pages/Users/landing/signInModule/AccessBtn'; // Import the new AccessBtn component
import '/src/Pages/Users/landing/signInModule/AccessBtn.module.scss';

const UserManagement = () => {
    //passing props from the AccessBtn
    const location = useLocation();
    const userProp = location.state?.user;

    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isDelete, setIsDelete] = useState(false); // Confirmation Modal 
    const [userToDelete, setUserToDelete] = useState(null);
    
    const handleDeleteBtn = (userId) => {
        setUserToDelete(userId);
        setIsDelete(!isDelete);
    }

    const confirmAndDelete = () => {
        setConfirmDelete(true);
    }

    useEffect(() => {
        if (confirmDelete && userToDelete) {
            handleDeleteUser();
            setConfirmDelete(false);
        }
    }, [confirmDelete, userToDelete]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        console.log("Attempting to fetch users...");
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/users/all');  // Use the full URL
            console.log("Users fetched:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const handleAddOrUpdateUser = async (user) => {
        try {
            if (currentUser) {
                await axios.put(`http://127.0.0.1:5000/api/users/update/${currentUser._id}`, user);
                alert('User update successful');
                setModalOpen(false);
            } else {
                await axios.post('http://127.0.0.1:5000/api/users/add', user);
                alert('User successfully added');
                setModalOpen(false);
            }
            fetchUsers();
            
            setCurrentUser(null);
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    };

    console.log(confirmDelete);

    const handleDeleteUser = async () => {
        try {
            if (confirmDelete && userToDelete) {
                await axios.delete(`http://127.0.0.1:5000/api/users/delete/${userToDelete}`);
                fetchUsers();
                alert('User deleted successfully');
                setConfirmDelete(false);
                setUserToDelete(null);
                setIsDelete(false);
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const openModal = (user = null) => {
        setCurrentUser(user);
        setModalOpen(true);
    };

    const navigate = useNavigate();
    const { user } = useAuth();
    const handleBackClick = () => {
        if (user && user.role === 'admin') {
          navigate('/map');
        } else {
          navigate('/');
        }
    };

    // Get the root ID and and apply className 
    useEffect(() => {
        const rootDiv = document.getElementById("root");

        // Add or remove className based on current page

        if (location.pathname === "/usermanage") {
        rootDiv.classList.add(styles.rootDiv);
        } else {
        rootDiv.classList.remove(styles.rootDiv);
        }
    }, [location])

    return (
        <>
            <NavBar />

            <div className = { styles.userManageContainer}>
                <div className = { styles.header }>
                    <span className = { styles.txtTitle }>User Management</span>
                </div>
            
                <div className = { styles.tblWrapper }>
                    <div className = { styles.btn }>
                        <button className={styles.addBtn} onClick={() => openModal()}>Add User</button>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Created At</th>
                                {/* <th>Updated At</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <div className = { styles.nameColumn }>
                                            {/* remove user Icon for now */}
                                            {/* <div className = { styles.userIcon }>
                                                <img className = { styles.icon } src = { icons.user } />
                                            </div> */}
                                            <div className = { styles.userInfo }>
                                                <span>{user.name}</span>
                                                <span className = { styles.email }>{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className = { user?.role === "admin" ? `${ styles.role } ${ styles.admin}` : `${ styles.role } ${ styles.staff}` }>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                                    {/* <td>{new Date(user.updatedAt).toLocaleString()}</td> */}
                                    <td>
                                        { user?.role !== "admin" && (
                                            <div className = { styles.actionBtns}>
                                                <button className = {styles.editBtn} onClick={() => openModal(user)}>
                                                    <img className = { `${ styles.icon } ${ styles.pencil}` } src = { icons.pencil } alt = "Edit Item" />
                                                </button>
                                                <button className = {styles.delBtn} onClick = {() => { handleDeleteBtn(user._id);}}>
                                                    <img className = { `${ styles.icon } ${ styles.delete}` } src = { icons.remove } alt = "Delete Item" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* onClick={() => handleDeleteUser(user._id)} */}
            </div>


            {/* Add and edit user modal */}
            <AnimatePresence>
            {modalOpen && 
                <motion.div 
                    className = { styles.modal }
                    initial = {{opacity: 0}}
                    animate = {{opacity: 1}}
                    exit = {{opacity: 0}}
                    transition = {{duration: 0.2, ease: "easeInOut"}}
                >
                    <UserModal user={currentUser} onSave={handleAddOrUpdateUser} onClose={() => setModalOpen(false)} />
                </motion.div>
            }
            </AnimatePresence>
            
            {/* Confirmation Modal */}
            <AnimatePresence>
                {isDelete && (
                    <motion.div 
                        className = { styles.confirmation }
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0}}
                        transition = {{duration: 0.2, ease: "easeInOut"}}
                    >
                        <Confirmation 
                            onCancel = {() => handleDeleteBtn()}
                            setConfirmDelete = { confirmAndDelete }
                        />
                    </motion.div>
                )}
            </AnimatePresence>    
        </>
    );
    
};

export default UserManagement;