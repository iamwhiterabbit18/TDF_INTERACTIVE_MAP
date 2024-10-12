import React, { useState, useEffect } from 'react';

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
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{user ? 'Edit User' : 'Add User'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password:</label>  {/* New password field */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={!user}  // Password is required when adding a new user
                    />
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                    </select>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default UserModal;