import { useState, useEffect } from 'react';

function KanyeWestAPI() {
    const [callback, setCallback] = useState(false)
    const [kayneWestData, setKayneWestData] = useState([])

    const fetchData = () => {
        return fetch(`https://api.kanye.rest/`)
          .then((response) => response.json())
          .then((data) => {
            setKayneWestData(data.quote)
          })};
      

    useEffect(() => {
        fetchData()
    }, [callback])

    return {
        kayneWestData: [kayneWestData, setKayneWestData],
        fetchData: [fetchData],
        callback: [callback, setCallback],
    }

}

export default KanyeWestAPI;