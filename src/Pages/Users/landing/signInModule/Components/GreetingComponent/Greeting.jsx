/*
-- Files where Greeting is imported --
SignInModule.jsx
*/

import icons from '../../../../../../assets/for_landingPage/Icons.jsx';
import styles from './styles/greetingStyles.module.scss';

export default function Greeting() {
  return (
    <div className = { styles.secondContainer }> {/* <!-- Second container --> */} 
      <div className = { styles.greetingContent }>
        <span className = { styles.txtTitle }>Welcome</span>
        <p className = { styles.txtSubtitle }>Exerience and explore the Technology Demonstration Farm</p>
        <img src = { icons.mapIcon } alt = "Icon" /> {/* <!-- Insert graphic element --> */}
      </div>          
    </div>
  )
}