import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from './styles/optionStyles.module.scss';

export default function Option({ handleBtnClick, handleUser }) {

    return (
        <>
            <div className = { `${styles.firstContainer}  ${styles.option}` }> {/* Sign in or Log in */}
                <div className = { `${ styles.optionContent }` }>
                    <span className = { styles.txtTitle }>Login</span>
                    <button className = { styles.btnSignIn } onClick = { handleBtnClick }>Sign in</button>
                    <span className = { styles.txtSubTitle }>OR</span>
                    <button className = { styles.btnGuest }
                    onClick = { () => handleUser('Guest') }>
                        <Link to ={ "/map"}>Guest Login</Link>
                    </button> 
                </div>
            </div>
        </>
    )
}