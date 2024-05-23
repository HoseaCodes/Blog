import React, {useContext} from 'react'
import { GlobalState } from '../../GlobalState'

const Github = () => {
    const state = useContext(GlobalState)
    const [githubData, setGithubData] = state.githubAPI.githubData
    const [repoData, setRepoData] = state.githubAPI.repoData
    const [searchTerm, setSearchTerm] = state.githubAPI.searchTerm
  
    const handleChange = event => {
        setSearchTerm(event.target.value);
     };

       
    const fetchData = event => {
        console.log(event)
        // setSearchTerm(event.target.value);
     };

    return (
        <section >
            <h1 class="jumbotron text-center" style={{width: '200%'}}>Welcome to GitHub Users</h1>
            <div class="row">
                <div class="col-xs-6 col-xs-offset-6">
                    <div class="input-group">
                        <input type="text" name='username' value={searchTerm} onChange={handleChange}
                        class="form-contorl" placeholder="Enter a GitHub Username"/>
                        <span class="input-group-btn">
                            <button onClick={fetchData} class=" btn btn-sucess"type="submit">GO!</button>
                        </span>
                    </div>
                </div>
            </div>
            <hr></hr>
            <div class="row col-xs-8 col-xs-offset-2">
                <div class="plane panel-default">
                    <div class="panel-heading text-center">
                        <img src={githubData.avatar_url}
                        class="img-circle" width="300"/>
                        <h2>{githubData.login}</h2>
                        <h3><a href={githubData.blog} target="_blank" rel="noopener noreferrer">
                        {githubData.blog}</a></h3>
                    </div>
                    <div class="panel-body">
                        <h3>{githubData.public_repos} Repos:</h3>
                        <div class="list-group">
                        {repoData.map(repo => {
                        return (
                            <div class="list-group-item">
                                <a href={repo.html_url} 
                                target="_blank">
                                {repo.name}
                                </a>
                                <p>Language: {repo.language || "N/A"}</p>
                            </div>
                        )
                        })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Github