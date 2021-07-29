import React from 'react';
import { Link } from 'react-router-dom';
import './Articles.css'
import BtnRender from './BtnRender';
// import ReactHtmlParser from 'react-html-parser';
import VisibilityIcon from '@material-ui/icons/Visibility';

// Main Article Cards
const ProjectCard = (props) => {

    const { title, type, info, description, img, id, name, date } = props.project;
    return (
        <div className="article-card">
            {/* <input type="checkbox" checked={checked}
                onChange={() => props.handleCheck(_id)} /> */}
            <img className='article-img' src={img} alt={title} />
            <div className='article-content'>
                <div style={{ padding: '1rem' }}>

                    <Link to={`/project/${id}`} className='article-card-header'
                    // onClick={() => this.handleCount()}
                    >
                        <h2 className='article-card-header' >{title}</h2>
                    </Link>
                    <p><span>1 &nbsp;<VisibilityIcon /> &nbsp;</span>{date}</p>
                    <p className="work-content">{description}</p>
                    <br />
                    {/* <div>{ReactHtmlParser(sanitizedHtml)}</div> */}

                </div>
                <Link to={`/project/${id}`} className="tag-item active" style={{ textDecoration: 'none' }}>
                <div className='tag-group'>
                    <div className="tag-logo">
                        <img src={img} width='200' height='150' alt="JavaScript" />
                    </div>
                    <div className="tag-info">
                        <h2 className='tag-header'>{title}</h2>
                        <p>{info}</p>
                        <label>{type}</label>
                        <label>{name}</label>
                    </div>
                </div>
            </Link>
            </div>
        </div>
    )
}

export default ProjectCard;