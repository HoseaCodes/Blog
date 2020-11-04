import React from 'react';
import './SocialMediaTags.css'
// import PModal from '../../Components/Modal/Modal';
import PopUp from '../../Components/Modal/Modal';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import YouTubeIcon from '@material-ui/icons/YouTube';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import GetAppIcon from '@material-ui/icons/GetApp';
import Resume2020 from '../../icons/Resume2020.pdf'
import { createMuiTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#206a5d',
        },
    },
});

const SocialMediaTags = () => {
    return (
        <div className='social-container'>
            <a className='social' href="https://twitter.com/DominiqueRHosea" target="_blank"><TwitterIcon fontSize="large" style={{ color: theme }} /></a>
            <a className='social' href="https://www.linkedin.com/in/dominique-hosea/" target="_blank"><LinkedInIcon fontSize="large" /></a>
            <a className='social' href="https://github.com/HoseaCodes" target="_blank"><GitHubIcon fontSize="large" /></a>
            <a className='social' href="https://www.youtube.com/channel/UCW0iZYA3zE03qlVJqVE_ajQ/about?view_as=subscriber" target="_blank"><YouTubeIcon fontSize="large" /></a>
            <a className='social' href="https://mail.google.com/mail/u/0/#inbox?compose=new" target="_blank"><AlternateEmailIcon fontSize="large" /></a>
            <a className="social-resume social" href={Resume2020} download="Resume2020.pdf"><GetAppIcon fontSize='large' /></a>
            {/* <PModal /> */}

        </div >
    )
}

export default SocialMediaTags;