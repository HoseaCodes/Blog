import React from 'react';

function ImgComp({ src }) {
    let imgStyles = {
        width: 100 + '%',
        height: 'auto'
    }
    return (
        <div>
            <img src={src} alt="project-img" style={imgStyles}></img>
        </div>
    )
}
export default ImgComp;