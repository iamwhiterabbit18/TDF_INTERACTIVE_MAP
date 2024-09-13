import React, { useState, useEffect } from 'react';

const Time = () =>{
    const [currentTime, setCurrentTime] = useState(new Date());

    const getCurrentTime = async () =>{
        return new Date();
    };

    const updateCurrentTime = async () => {
        const time = await getCurrentTime();
        setCurrentTime(time);
    };

    const formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }

    useEffect(() => {
        updateCurrentTime();
    
        const intervalId = setInterval(updateCurrentTime, 60000);
    
        return () => clearInterval(intervalId);
      }, []);

      return (
        <p>{formatAMPM(currentTime)}</p>
      );
};
 
export default Time;