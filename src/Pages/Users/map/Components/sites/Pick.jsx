import React, { useState } from 'react';

function Pick({pos, moveArrow, removeLine, cameraPF}) {
    const [current, setCurrent] = useState('');
    const [destination, setDestination] = useState('');
    const [Modal, setModal] = useState(false);
    // to handle open close modal name remove when UI/Ux is created
    const [name, setName] = useState('Open');
    const handleButtonClick = (type) => {
        if(type === 'Enter'){
            moveArrow(current, destination);
        }
        else if(type === 'Delete'){
            if(Modal){
                setCurrent('');
                setDestination('');
                removeLine();
                setModal(false);
                setName('Open');
                cameraPF();
            }
            else if(Modal === false){
                setModal(true);
                setName('Close');
                cameraPF();
            }
        }
    };

  return (
    <div style={{
        position: 'absolute', 
        top: 0, 
        left: 0, 
        backgroundColor: 'white',
        display: 'flex',
        gap: '1rem'}}>
        {Modal && <>
            <div className="current">
            <label>Current</label>
            <select name="current" value={current} 
            onChange={(e) => setCurrent(e.target.value)}>
                <option value=""></option>
                {pos.map((pos) =>{
                    return <option key={pos.name} value={pos.name}>{pos.name}</option>
                })}
            </select>
        </div>
        <div className="destination">
            <label>Destination</label>
            <select name="destination" value={destination}
            onChange={(e) => setDestination(e.target.value)}>
                <option value=""></option>
                {pos.map((pos) =>{
                    return <option key={pos.name} value={pos.name}>{pos.name}</option>
                })}
            </select>
        </div>
        </>}
        
        <button style={{backgroundColor: 'green', color: 'white'}} onClick={() => handleButtonClick('Enter')}>Enter</button>
        <button style={{backgroundColor: 'red', color: 'white'}} onClick={() => handleButtonClick('Delete')}>{name}</button>
    </div>
  )
}

export default Pick