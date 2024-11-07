import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import styles from './styles/aboutUsStyles.module.scss'
import images from '../../../../../../../assets/for_landingPage/Images.jsx'
import icons from '../../../../../../../assets/for_landingPage/Icons.jsx'

export default function AboutUs({ setCurrentModal, handleClickOutside, currentModal, nodeRef, ...props }) {

    // closes the modal box if the user clicked outside (anywhere in the screen except the modal box)
    useEffect(function() {
        if (currentModal) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [currentModal]);

    return (
        <>
            <AnimatePresence>
                {currentModal === 'aboutUs' && (
                    <motion.div
                        className = { `${ styles.aboutUsContainer } ${ props.className }` }
                        id = "aboutUs"
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0}}
                        transition = {{ duration: 0.3, ease: "easeInOut"}}
                    >
                        <div className = { styles.aboutUsContent }>
                            <div className = { styles.close } onClick = { function() { setCurrentModal(null); }}>
                                <img src = { icons.close } alt = "Close" />
                            </div>

                            <div className = { styles.header }>
                                <span className = { styles.txtTitle }>About Us</span>
                            </div>

                            <div className = { styles.content }>
                                <img src = { images.aboutUs } alt = "Extension Services Image" />

                                <div className = { styles.history }>
                                    <span className = { styles.txtTitle }>Historical Background</span>
                                    <p className = { styles.txtSubTitle }>
                                        For decades, the University has been involved in community outreach 
                                        and extension activities. When this was converted into Don Severino Agricultural 
                                        College (DSAC) in 1964, extension became one of the functions of this institution, 
                                        in addition to instruction and research. DSAC started with two major units, 
                                        the Secondary Department and the College Department. 
                                        The latter conducted extension services in the form of seminars on improved 
                                        farm practices and certified seeds and veterinary services to the 
                                        animals of the service area. In addition, the College maintained a one-and-a-half hectare 
                                        nursery for the propagation of and multiplication of important plants for 
                                        on-campus and for farmers’ use. The Swine Project which was used for instruction 
                                        purposes also served as a source of foundation stock for farmers. Boar services 
                                        were made available to small hog raisers for the improvement of their stock 
                                        (DSAC Annual Report, SY 1968-69).

                                        Since then, the milestones of extension services were recorded in the Annual 
                                        Reports of this educational institution.
                                    </p>
                                </div>

                                <div className = { styles.vision}>
                                    <span className = { styles.txtTitle }>Vision</span>
                                    <p className = { styles.txtSubTitle }>
                                        Alleviating the standard of living of the economically 
                                        and socially disadvantaged sectors of society.
                                    </p>
                                </div>

                                <div className = { styles.mission}>
                                    <span className = { styles.txtTitle }>Mission</span>
                                    <p className = { styles.txtSubTitle }>
                                        To engage in the improvement of the quality of life of 
                                        farmers/fisherfolks, women, out-of-school youths, local 
                                        government employees, and other clients through the conduct 
                                        of relevant education and training; farm and business 
                                        advisory services; demonstration services; and information, 
                                        communication, and technology services.
                                    </p>
                                </div>

                                <div className = { styles.goal}>
                                    <span className = { styles.txtTitle }>Goal</span>
                                    <p className = { styles.txtSubTitle }>
                                        The Extension Services of Cavite State University (CvSU) 
                                        shall be geared towards the improvement of the lives of 
                                        the community especially those that belong to economically 
                                        and socially disadvantaged sectors through the conduct of 
                                        relevant education and training; farm and business advisory 
                                        activities; demonstration projects; and information, 
                                        communication, and technology services.
                                    </p>
                                </div>

                                <div className = { styles.objective}>
                                    <span className = { styles.txtTitle }>Objectives</span>
                                    <p className = { styles.txtSubTitle }>
                                        Conceptualize, coordinate, and conduct relevant, efficient, gender-responsive, and sustainable interdisciplinary extension programs, projects, and activities;<br />
                                        Establish linkages with government and private agencies engaged in extension and community development;<br />
                                        Coordinate, monitor, and evaluate the extension programs, projects, and activities of various colleges, campuses, and other extension implementing units of the University;<br />
                                        Promote community and social enterprises; and<br />
                                        Coordinate with the Office of Business Affairs and Marketing in promoting agricultural and other potential income-generated projects.
                                    </p>
                                </div>


                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}