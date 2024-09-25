import axios from 'axios';
import { useEffect, useState } from 'react';


const get = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios
            .get('http://localhost:5000/card')
            .then((res) => { setData(res.data) })
            .catch((err) => { console.log(err)})
    }, []);

    return data
};

export default get;