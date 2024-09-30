import React from 'react'
import styles from './Preloader.module.scss'

function Preloader() {
  return (
    <div className={`${styles.preloader} preloader`}>
        <div className={styles.logo}>
            <img src="/images/loading2.gif" alt="preload-logo" />
        </div>
        <h1>Loading</h1>
    </div>
  )
}

export default Preloader