// import { CSSTransition } from 'react-transition-group';
import { useState, useEffect } from 'react';
import { UserProvider } from '/src/Pages/Admin/ACMfiles/UserContext';
import Option from './Components/OptionComponent/Option.jsx';
import SignIn from './Components/SignInComponent/SignIn.jsx';
import Greeting from './Components/GreetingComponent/Greeting.jsx';
import styles from './styles/signInModuleStyles.module.scss';

export default function SignInModule() {

    // adds the className rootContainer to the #root and removes it once the component unmounts
    useEffect(function() {
        const root = document.getElementById('root');
        root.classList.add(styles.rootContainer);

        //removes the className once unmount
        return function() {
            root.classList.remove(styles.rootContainer);
        };
    }, []);

    // --------- Option Component ---------
    const [isBtnClicked, setIsBtnClicked] = useState(false);

    // checks if the sign in button is clicked
    function handleBtnClick() {
        setIsBtnClicked(!isBtnClicked);
    }
    
    const [isUser, setIsUser] = useState(null);
    const handleUser = (user, role) => {
        setIsUser(user);
        console.log(`${user} logged in with ID: ${role}`); // Log the user role

    };
    

    return(
        <UserProvider>
        <div className={styles.mainContainer}>
            <div className = { styles.loginContainer }> {/* Main container for option and login form*/}
                {isBtnClicked 
                    ? <SignIn 
                        handleBtnClick = { handleBtnClick }
                        handleUser = { handleUser }
                        />
                    : <Option 
                        handleBtnClick = { handleBtnClick }
                        handleUser = { handleUser }
                        /> }
                <Greeting />
            </div>
        </div>
        </UserProvider>
    )
}