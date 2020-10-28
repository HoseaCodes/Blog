import React, { useState, useEffect } from 'react';
import axios from 'axios'



// function Repo() {
//     const [githubUser, setAppState] = useState({
//         repos: null,
//     });

//     useEffect(() => {
//         const githubURL = 'https://api.github.com/users/hoseacodes/repos';
//         axios.get(githubURL).then((repos) => {
//             const allRepos = repos.data;
//             setAppState({ repos: allRepos });
//         });
//     }, []);


//     return (
//         <>
//             <List repos={githubUser.repos} />
//         </>

//     );
// }


// const List = (props) => {
//     const { repos } = props;
//     if (!repos || repos.length === 0) return <p>No repos available</p>;
//     return (
//         <ul>
//             <hr />
//             <h2 className='list-head'> Repository</h2>
//             <hr />

//             {repos.map((repo, index) => {
//                 const number = index + 1;

//                 return (
//                     <li key={repo.id} className='list'>
//                         <span className='repo-text'>Repo {number}: {repo.name} </span>
//                         <p className='repo-description'>{repo.description}</p>
//                         <hr />
//                     </li>
//                 );
//             })}
//         </ul>
//     );
// };

function Github({ login, githubUser }) {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch(`https://api.github.com/users/${login}`)
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);
    if (data) {
        return (
            <>
                <h2 style={{ color: 'white', fontSize: '2.2rem', textAlign: 'center' }}>Github: {data.login}</h2>
                <p style={{ textAlign: 'center' }}>Followers: {data.followers}</p>
                <p style={{ textAlign: 'center' }}>Following: {data.following}</p>
                <p style={{ textAlign: 'center' }}>Repos: {data.public_repos}</p>
                {/* <Repo repos={githubUser.repos} /> */}
            </>
        )
    }
    return null;
}


export default Github;