/* 
-- Files where SubmitFeedback is imported --
NavigationModule.jsx

*/

import { React, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios';

import styles from './styles/submitFeedbackStyles.module.scss';
import icons from '../../../../../../../assets/for_landingPage/Icons.jsx';

export default function NewsAndEvents({ setCurrentModal, handleClickOutside, currentModal, nodeRef, ...props }) {

    const numberOfStars = [1, 2, 3, 4, 5]; // array of the star rating
    const [selectedStar, setSelectedStar] = useState (-1);
    const [isStarClicked, setIsStarClicked] = useState(false);
    const [comment, setComment] = useState(''); // For storing the comment

    function handleStarClick(index) {
        setIsStarClicked(!isStarClicked);
        setSelectedStar(index); // Save the rating (index + 1)
    }

    function resetFeedback() {
        setSelectedStar(-1);
        setIsStarClicked(false);
        setComment('');
    }


    const handleSubmit = async () => {
        console.log('handleSubmit is triggered'); // Check if this is triggered
        const guestId = localStorage.getItem('guestId'); // Retrieve the guestId from localStorage
        console.log('Retrieved guestId from localStorage:', guestId); // Check if this logs correctly

         // Check if no star is selected
        if (selectedStar === -1) {
            alert('Please select a star rating before submitting your feedback.');
            return; // Prevent submission if no star is selected
        }
          // Check if comment exceeds the character limit
          if (comment.length > 300) {
            alert('Comment cannot exceed 300 characters.');
            return; // Prevent submission if over limit
        }
    
        const feedbackData = {
            guestId,
            rating: selectedStar + 1, // Assuming star rating starts from 0
            comment: document.querySelector('textarea[name="feedback"]').value
        };
    
        try {
            console.log('Sending feedback data:', feedbackData); // Check before sending
            const response = await axios.post('http://localhost:5000/api/guest/updateFeedback', feedbackData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.status === 200) {
                console.log('Feedback submitted successfully');
                // Alert the user and reload the page
                alert('Feedback submitted successfully!'); 
                setCurrentModal(null);
                return;
                //window.location.reload(); // Reload the page
            } else {
                console.error('Failed to submit feedback');
            }

        } catch (error) {
            console.error('Error submitting feedback:', error.response ? error.response.data : error.message);
        }
    };
    
    

    // closes the modal box if the user clicked outside (anywhere in the screen except the modal box)
    useEffect(function() {
        if (currentModal) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            resetFeedback();
            document.removeEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [currentModal]);

    return (
        <>
            <AnimatePresence>
                {currentModal === 'submitFeedback' && (
                    <motion.div
                        className = { styles.submitFeedbackContainer }
                        id = "submitFeedback"
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0}}
                        transition = {{ duration: 0.3, ease: "easeInOut"}}
                    >
                        <div className = { styles.submitFeedbackContent }>
                            <div className = { styles.close } onClick = { function() { setCurrentModal(null); }}>
                                <img src = { icons.close } alt = "Close" />
                            </div>
                            <span className = { styles.txtTitle }>Submit FeedBack</span>
                            <p className = { styles.txtSubTitle }> 
                                We highly value your feedback. Kindly take a <br/> 
                                moment to rate your experience and <br/>
                                provide us with your valuable feedback. 
                            </p>
                            <div className = { styles.starContainer }>
                                {numberOfStars.map((_ , index) => (
                                    <img 
                                        key = { index }
                                        onClick = {() => {handleStarClick(index)}}
                                        className = { selectedStar >= index ? `${ styles.icon } ${ styles.star } ${ styles.active }` : `${ styles.icon } ${ styles.star }`} 
                                        src = { icons.star } 
                                        alt = {`${index + 1} Star rating`}
                                    />
                                ))}
                        </div>
                        <form className={styles.form} onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                                <textarea 
                                    name="feedback" 
                                    value={comment} 
                                    onChange={e => setComment(e.target.value)} 
                                    placeholder="Enter your feedback (optional)"
                                    //maxLength="300" // Set the maximum length for the textarea
                                />
                                <div className = { styles.txtLimit }>
                                    <span className = { comment.length > 300 ? ` ${styles.txtSubTitle} ${styles.error} ` : styles.txtSubTitle }>
                                        {300 - comment.length} characters remaining
                                    </span> {/* Show remaining characters */}
                                </div>
                                <button className={styles.submitBtn} type="submit" >Submit</button>
                            </form>
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}