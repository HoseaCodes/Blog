import React from 'react';
import './ImgComp.css'

function ImgComp({ src }) {
    let imgStyles = {
        width: 100 + '%',
        height: 'auto'
    }
    return (
        <div>
            <img className='cover' src={src} alt="project-img" style={imgStyles}></img>
        </div>
    )
}
export default ImgComp;