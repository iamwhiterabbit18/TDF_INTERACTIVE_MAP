import React, { useState, useEffect } from 'react';
import styles from '/src/Pages/Admin/edit/styles/UserModal.module.scss';

import icons from "../../../assets/for_landingPage/Icons";


const UserModal = ({ user, onSave, onClose }) => {
    const [name, setName] = useState(user ? user.name : '');
    const [email, setEmail] = useState(user ? user.email : '');
    const [password, setPassword] = useState('');  // New password state
    const [role, setRole] = useState(user ? user.role : 'staff');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setRole(user.role || 'staff');
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, email, password, role });  // Include password in the save operation
    };

    return (
        <div className = { styles.modalContent }>
            <button className = { styles.close } onClick = { onClose }>
                <img src={icons.close} alt="close" />
            </button>
            <div className = { styles.header }>
                <span className = { styles.txtTitle }>{user ? 'Edit User' : 'Add User'}</span>
            </div>
            <form className ={styles.form} onSubmit={handleSubmit}>
                <div className = { styles.container1 }>
                    <div className = { styles.subContainer }>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className = { styles.subContainer }>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className = { styles.subContainer }>
                        <label>Password:</label>  {/* New password field */}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!user}  // Password is required when adding a new user
                        />
                    </div>
                </div>
                <div className = { styles.container2 }>
                    <div className = { styles.subContainer }>
                        <label>Role:</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                    <button type="submit">Save</button>
                </div>
                
            </form>
        </div>
    );
};

export default UserModal;