import { useState, useEffect } from 'react';

function GithubAPI() {
    const [callback, setCallback] = useState(false)
    const [githubData, setGithubData] = useState([])
    const [repoData, setRepoData] = useState([])
    const [searchTerm, setSearchTerm] = useState("hoseacodes")

    const fetchData = () => {
        return fetch(`https://api.github.com/users/${searchTerm}`)
          .then((response) => response.json())
          .then((data) => {
            fetchRepoData(data)
            setGithubData(data)
          })};
      

    const fetchRepoData = (userData) => {
        return fetch(userData.repos_url)
          .then((response) => response.json())
          .then((data) => setRepoData(data));
      }

    useEffect(() => {
        fetchData()
    }, [callback, searchTerm])

    return {
        githubData: [githubData, setGithubData],
        repoData: [repoData, setRepoData],
        callback: [callback, setCallback],
        searchTerm: [searchTerm, setSearchTerm],
    }


}

export default GithubAPI;