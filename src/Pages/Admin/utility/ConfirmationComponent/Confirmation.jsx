
import styles from "./styles/confirmationStyles.module.scss"

export default function Confirmation({ onCancel, onDelete }) {
    
    return (
        <>
            <div className = { styles.container }>
                <div className = { styles.content }>
                    <span className = { styles.txtTitle }> ARE YOU SURE</span>
                    <p className = { styles.txtSubTitle }>
                        Are you sure you want to delete this item? <br />
                        This action cannot be undone.
                    </p>
                    <div className = { styles.btns}>
                        <div className = { styles.delete }>
                            <button 
                                className = { styles.txtTitle}
                                onClick = { onDelete }    
                            >
                                Delete
                            </button>
                        </div>
                        <div className = { styles.cancel }>
                            <button 
                                className = { styles.txtTitle}
                                onClick ={ onCancel }    
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}