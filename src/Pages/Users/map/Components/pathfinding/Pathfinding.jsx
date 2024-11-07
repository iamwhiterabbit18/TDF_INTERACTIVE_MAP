import React, { useState, useRef, useEffect } from 'react';
import styles from './Pathfinding.module.scss';
import { arrow } from './assets/index';
import { positionGeometry } from 'three/webgpu';

function Pick({pos, moveArrow, removeLine, cameraPF, togglePathfinding}) {
    const [isPfBtn, setIsPfBtn] = useState(true);
    const [buttonHidden, setButtonHidden] = useState(false);
    const headerRef = useRef(null);
    const modalWrapperRef = useRef(null)
    const [current, setCurrent] = useState(null);
    const [cname, setCname]= useState('Current');
    const [destination, setDestination] = useState(null);
    const [dname, setDname]= useState('Destination');
    useEffect(() =>{
        const container = document.getElementById('container');
        if(container && !modalWrapperRef.current){
            const wrapper = document.createElement('div');
            wrapper.id = 'pfModal-wrapper';
            container.appendChild(wrapper);
            modalWrapperRef.current = wrapper;
            wrapper.addEventListener('click', (e) => toggleModal(e));

            const header = document.createElement('h1');
            header.id = 'header';
            wrapper.appendChild(header);
            headerRef.current = header;
            
            const modal = document.createElement('div');
            modal.id = 'pfModal';
            wrapper.appendChild(modal);

            const itemCont = document.createElement('div');
            itemCont.id = 'items-container';
            modal.appendChild(itemCont);

            pos.forEach((p)=>{
                const item = document.createElement('a');
                item.className = 'items';
                item.href = '#';
                item.dataset.name = p.name;
                item.textContent = p.name;
                item.addEventListener('click', (e) => e.preventDefault());
                itemCont.appendChild(item);
                
                item.addEventListener('click', (e) => {
                    chosenPath(e.target.dataset.name);
                })
            });
        }
        return () =>{
            if(modalWrapperRef.current){
                modalWrapperRef.current.remove();
                modalWrapperRef.current = null;
            }
        }
    }, [pos])
    // const handleButtonClick = (type) => {

    //     if(type === 'Enter'){
    //         moveArrow(current, destination);
    //     }
    //     else if(type === 'Delete'){
    //         if(Modal){
    //             setCurrent('');
    //             setDestination('');
    //             removeLine();
    //             setModal(false);
    //             setName('Open');
    //             // cameraPF();
    //         }
    //         else if(Modal === false){
    //             setModal(true);
    //             setName('Close');
    //             // cameraPF();
    //         }
    //     }
    // };

//   return (
//     <div className="pathfinding" style={{
//         backgroundColor: 'white',
//         display: 'flex',
//         gap: '1rem'}}>
//         {Modal &&
//         <>
//             <div className="current">
//                 <label>Current</label>
//                 <select name="current" value={current} 
//                 onChange={(e) => setCurrent(e.target.value)}>
//                     <option value=""></option>
//                     {pos.map((pos) =>{
//                         return <option key={pos.name} value={pos.name}>{pos.name}</option>
//                     })}
//                 </select>
//             </div>
//             <div className="destination">
//                 <label>Destination</label>
//                 <select name="destination" value={destination}
//                 onChange={(e) => setDestination(e.target.value)}>
//                     <option value=""></option>
//                     {pos.map((pos) =>{
//                         return <option key={pos.name} value={pos.name}>{pos.name}</option>
//                     })}
//                 </select>
//             </div>
//         <button style={{backgroundColor: 'green', color: 'white'}} onClick={() => handleButtonClick('Enter')}>Enter</button>
//         </>}
//         <div className="openBtn">
//             <button style={{backgroundColor: 'red', color: 'white'}} onClick={() => handleButtonClick('Delete')}>{name}</button>
//         </div>
//     </div>
//   )\
    // To render Pathfinding Modal on the main parent div

    // pathfinding methods
    const handleButtonClick = (type) =>{
        if(type === 'Open'){
            togglePathfinding();
            setButtonHidden(true)
            setTimeout(() => {
                setIsPfBtn(false);
            }, 300)
            console.log('open modal');
        }
        else if(type === 'Enter'){
            if(!current && !destination) return;
            togglePathfinding();
            setButtonHidden(false)
            setTimeout(() => {
                setIsPfBtn(true);
            }, 300)
            moveArrow(current, destination);
            setCname('Current');
            setDname('Destination');
            setCurrent(null);
            setDestination(null);
            console.log('enter');

        }
        else if(type === 'Close'){
            togglePathfinding();
            setButtonHidden(false)
            setTimeout(() => {
                setIsPfBtn(true);
            }, 300)
            console.log('close modal');

        }
    }
    const toggleModal = (btn) => {
        // displays current button choice
        choiceHelper(btn);
        const wrapper = document.getElementById('pfModal-wrapper');
        const pfModal = document.getElementById('pfModal');
        if (!wrapper.classList.contains("active")) {
            wrapper.classList.add("active");
            pfModal.classList.add("active");
    
        } else {
            wrapper.classList.remove("active");
            pfModal.classList.remove("active");
        }
            
    }
    const choiceHelper = (btn) => {
        headerRef.current.textContent = btn;
        console.log(btn)
    }
    const chosenPath = (choice) =>{
        const header = headerRef.current?.textContent;
        if(header){
            if(header === 'Current'){
                setCurrent(choice);
                setCname(choice);
            }
            else if(header === 'Destination'){
                setDestination(choice);
                setDname(choice);
                
            }
        }
    }

    return (
        <div id="pathfinding">
            {isPfBtn && 
            <button className={`${styles.pfBtn} ${buttonHidden ? styles.hidden : ''}`} onClick={() => handleButtonClick('Open')}>
                <p>CVSU-TDF</p>
                <h1>Search for your path</h1>
            </button>}
            
            <div className={styles.pfCont}>
                {/* contents */}
                <button className={styles.logo} onClick={() => handleButtonClick('Close')}>
                    <p>INTERACTIVE MAP</p>
                    <h1>CVSU-TDF</h1>
                </button>
                    <button className={styles.current}
                    data-id='Current'
                    onClick={()=> toggleModal('Current')}
                    >
                        <span>{cname}</span>
                        <div className={styles.arrow}>
                            <img src={arrow} alt="arrow" />
                        </div>
                    </button>
                    <button className={styles.destination}
                    data-id='Destination'
                    onClick={()=> toggleModal('Destination')}
                    >
                        <span>{dname}</span>
                        <div className={styles.arrow}>
                            <img src={arrow} alt="arrow" />
                        </div>
                    </button>
                <button className={styles.enter}
                onClick={() => handleButtonClick('Enter')}>Enter</button>
            </div>
        </div>
    )
}

export default Pick