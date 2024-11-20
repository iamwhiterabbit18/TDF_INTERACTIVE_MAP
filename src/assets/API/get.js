import axios from 'axios';
import { useEffect, useState } from 'react';


const get = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios
            .get('http://127.0.0.1:5000/card')
            .then((res) => { setData(res.data) })
            .catch((err) => { console.log(err)})
    }, []);

    return data
};

export default get;