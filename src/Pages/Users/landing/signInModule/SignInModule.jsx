// import { CSSTransition } from 'react-transition-group';
import { useState, useEffect } from 'react';
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

    const [isBtnClicked, setIsBtnClicked] = useState(false);

    const [optionUnmountDelay, setOptionUnmountDelay] = useState(false);
    const [signinUnmountDelay, setSigninUnmountDelay] = useState(true);

    // checks if the sign in button is clicked
    function handleBtnClick() {
        if(!isBtnClicked) {
            setIsBtnClicked(!isBtnClicked);
            
            // sets unmount delay
            setTimeout(() => {
                setOptionUnmountDelay(!optionUnmountDelay); 
                setSigninUnmountDelay(!signinUnmountDelay); 
            }, 150);
        } else {
            setIsBtnClicked(!isBtnClicked);

            // sets unmount delay
            setTimeout(() => {
                setOptionUnmountDelay(!optionUnmountDelay); 
                setSigninUnmountDelay(!signinUnmountDelay); 
            }, 150)
        }
        
    }
    
    const [isUser, setIsUser] = useState(null);
    const handleUser = (user) => {
        setIsUser(user);
        console.log(`${user} logged in`);
    }

    return(
        <div className={styles.mainContainer}>
            <div className = { styles.loginContainer }> {/* Main container for option and login form*/}
                <div className = { styles.firstContainer }>
                    {optionUnmountDelay && (
                        <SignIn 
                            handleBtnClick = { handleBtnClick }
                            isBtnClicked = {isBtnClicked}
                            handleUser = { handleUser }
                        />
                    )} 
                    
                    {signinUnmountDelay && ( 
                        <Option 
                            handleBtnClick = { handleBtnClick }
                            isBtnClicked = {isBtnClicked}
                            handleUser = { handleUser }
                        /> 
                    )}   
                </div>
                
                <Greeting />
            </div>
        </div>
    )
}