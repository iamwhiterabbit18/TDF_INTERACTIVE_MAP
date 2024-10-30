/*
-- Files where Greeting is imported --
SignInModule.jsx
*/

import icons from '../../../../../../assets/for_landingPage/Icons.jsx';
import styles from './styles/greetingStyles.module.scss';
import { motion, AnimatePresence } from 'framer-motion'

export default function Greeting() {
  return (
    <div className = { styles.secondContainer }> {/* <!-- Second container --> */} 
      <motion.div 
        className = { styles.greetingContent }
        initial = {{opacity: 0}}
        animate = {{opacity: 1}}
        transition = {{duration: 0.3, delay: 0.2, ease: "easeInOut"}}
      >
        <span className = { styles.txtTitle }>Welcome</span>
        <p className = { styles.txtSubtitle }>Exerience and explore the Technology Demonstration Farm</p>
        <img src = { icons.mapIcon } alt = "Icon" /> {/* <!-- Insert graphic element --> */}
      </motion.div>          
    </div>
  )
}