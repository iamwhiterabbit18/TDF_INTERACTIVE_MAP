import React, { useState, useRef } from 'react'
// import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { motion, AnimatePresence } from 'framer-motion'

import dropdownStyles from './Components/UserDropdownComponent/styles/userDropdownStyles.module.scss';
import navListItemsStyles from './Components/NavListComponent/styles/navListItemsStyles.module.scss';

// ------- Navigation Components Section -------
import NavBar from './Components/NavBarComponent/NavBar.jsx'
import NavList from './Components/NavListComponent/NavList.jsx'
import UserDropdown from './Components/UserDropdownComponent/UserDropdown.jsx'

// ------- NavList Items Section -------
import ContactUsComponent from './Components/NavListComponent/SubComponent/ContactUsComponent/ContactUs.jsx'
import AboutUsComponent from './Components/NavListComponent/SubComponent/AboutUsComponent/AboutUs.jsx'
import NewsAndEvents from './Components/NavListComponent/SubComponent/newsAndEventsModule/Components/NewsAndEvents.jsx'
import SubmitFeedback from './Components/NavListComponent/SubComponent/FeedbackComponent/SubmitFeedback.jsx'
import NewsEventImage from '../../Admin/edit/EditNewsEvent.jsx';

export default function NavigationModule () {

// ------- Global -------

    // Checks if the user clicked outside of the active modal
    // Checks if the user clicked outside of the user dropdown
    // Checks if the user clicked outside of the navList
    function handleClickOutside(e) {
        if (currentModal && !document.getElementById(currentModal).contains(e.target)) {
            setCurrentModal(null);
        } else if (isDropClicked && !document.getElementById("dropdown").contains(e.target) && !document.getElementById("userIcon").contains(e.target)) {
            setIsDropClicked(!isDropClicked);
        } else if (!isNavListClosed && !document.getElementById("navigationList").contains(e.target) && !document.getElementById("hamburger").contains(e.target)) {
            handleNavClick();   
        }
    }

    

// ------- NavBar Logic Section -------
    const [isHamClicked, setIsHamClicked] = useState(false);

    //check is hamburger is clicked, change bool value whenever it is clicked
    function handleNavClick() {
        setIsHamClicked(!isHamClicked);
        setIsNavListClosed(!isNavListClosed); 
        setIsEditContent(false);
    }

// ------- NavList Logic Section -------  
    const nodeRef = useRef(null)
    
    const [isNavListClosed, setIsNavListClosed] = useState(true);
    const [currentModal, setCurrentModal] = useState(null);
    const [isEditContent, setIsEditContent] = useState(false);

    // ----------- For Edit News and Event Modal --------------
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal 

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen); // Toggle modal visibility
    };

    // --------------------------------------------------------

    function toggleEditContent() {
        setIsEditContent(!isEditContent);
    }

    // fetch which modal is clicked from the navList (Applied for every modal within the navList)
    function captureNavListClick (modal) {
        setCurrentModal(modal);
    }

    // checks if a link from navList is clicked. Shows the modal of the clicked link, revert the navList and hamburger menu (Applied for every modal within the navList)
    function handleModalClick() {
        setIsNavListClosed(!isNavListClosed);
        setIsHamClicked(!isHamClicked);
    }
    
// ------- UserDropdown Logic Section -------

    // separate nodeRef is used to avoid returning null value after fade-enter className
    // null happends because of the nature of the original nodeRef 
    const dropdownNodeRef = useRef(null);

    const [isDropClicked, setIsDropClicked] = useState(false);

    function handleDropClick() {
        setIsDropClicked(!isDropClicked);
    }
    
    console.log(currentModal);

    return (
        <>
            {/* ------- Navigation Components Section ------- */}
                <NavBar 
                    isHamClicked = { isHamClicked } 
                    isNavListClosed = { isNavListClosed }
                    handleNavClick = { handleNavClick } 
                    handleDropClick = { handleDropClick }
                />
    
                <NavList 
                    handleClickOutside = { handleClickOutside }
                    isHamClicked = { isHamClicked } 
                    isNavListClosed = { isNavListClosed }
                    handleModalClick = { handleModalClick }  
                    captureNavListClick = { captureNavListClick }  
                    isEditContent = { isEditContent }
                    toggleEditContent = { toggleEditContent }
                    toggleModal = { toggleModal }
                />
                
                <UserDropdown
                    handleClickOutside = { handleClickOutside }
                    isDropClicked = { isDropClicked }
                />

                <div className = { navListItemsStyles.modalContainer } >
                    {/* ------- ContactUs Component Section ------- */}
                        <ContactUsComponent 
                            setCurrentModal = { setCurrentModal }
                            currentModal = { currentModal }
                            handleClickOutside = { handleClickOutside }
                        />

                    {/* ------- AboutUs Component Section ------- */}
                        <AboutUsComponent 
                            setCurrentModal = { setCurrentModal }
                            currentModal = { currentModal }
                            handleClickOutside = { handleClickOutside }
                        
                        />
                    
                    {/* ------- NewsAndEvents Component Section ------- */}
                        <NewsAndEvents 
                            setCurrentModal = { setCurrentModal }
                            currentModal = { currentModal }
                            handleClickOutside = { handleClickOutside }
                    />
                    
                    {/* ------- SubmitFeedback Component Section ------- */}
                        <SubmitFeedback 
                            setCurrentModal = { setCurrentModal }
                            currentModal = { currentModal }
                            handleClickOutside = { handleClickOutside }
                        />

                    {/* EditNewsEvent */}
                        <NewsEventImage 
                            setCurrentModal = { setCurrentModal }
                            currentModal = { currentModal }
                            handleClickOutside = { handleClickOutside }
                        />
                </div> 
            
        </>
    )
}