import { useState, useEffect } from 'react';

function JokeAPI() {
    const [callback, setCallback] = useState(false)
    const [jokeData, setJokeData] = useState([])

    const fetchData = () => {
        const selectJoke = ['Any', 'Miscellaneous', 'Programming',
        'Dark', 'Pun']
        return fetch(`https://sv443.net/jokeapi/v2/joke/${selectJoke[0]}`)
          .then((response) => response.json())
          .then((data) => {
            setJokeData(data.quote)
          })};
      

    useEffect(() => {
        fetchData()
    }, [callback])

    return {
        jokeData: [jokeData, setJokeData],
        fetchData: [fetchData],
        callback: [callback, setCallback],
    }

}

export default JokeAPI;