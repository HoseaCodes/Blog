import React from 'react'
import ShareIcon from '@material-ui/icons/Share';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const PopUp = () => {
    return (
        <>
            <Popup trigger={<a className="social"><ShareIcon /></a>} position="right center" >
                <div>Share Link with Others</div>
            </Popup >
        </>

    )
}
export default PopUp 