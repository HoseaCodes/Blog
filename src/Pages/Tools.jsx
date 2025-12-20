
import React, {useState} from 'react';
import axios from 'axios'
// import './Projects.css';
// import {projectData} from './ProjectsData';
// import ProjectCard from '../../Components/Cards/project';
import { StyledHr } from '../Layout/Hr/styledHr';
import { GlobalState } from '../GlobalState';
import useModal from '../Components/Modal/useModal';
import CustomModal from '../Components/Modal/customModal';

const Tools = () => {
    const [loading, setLoading] = useState(true)
    // const [githubData, setGithubData] = useState([])
    // const [repoData, setRepoData] = useState([])
    // const [searchTerm, setSearchTerm] = useState("hoseacodes")
    const [displayModal, setDisplayModal] = useState("")

    const {isShowing, toggle} = useModal();

    
    const setDisplay = (api) => {
        setDisplayModal(api)
        toggle()
    }
    
    return (
        <>
            <div className='header2'>
                <div className='header-logo'>
                </div>
            </div>
            {/* {!loading ?
                <section>Loading..</section>
                :
                
            } */}
            {/* <button className="button-default" onClick={toggle}>Show Modal</button> */}
            <CustomModal displayModal={displayModal} isShowing={isShowing} hide={toggle} />
            <img onClick={() => setDisplay('Github')} height="250" width="500" src="https://i.imgur.com/cYhj1B7.png" alt="github" />
            <img onClick={() => setDisplay('KanyeWest')} height="250" width="500" src="https://i.imgur.com/xiAiDxI.jpg?2" alt="kanyewest" />
            <StyledHr Primary/>
        </>
    )

}

export default Tools;
