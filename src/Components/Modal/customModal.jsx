import React from 'react';
import Github from '../API/github';
import KanyeWest from '../API/kanyeWest';
import './modal.css'

const APISelection = props => {
  let { displayModal } = props;
  switch (displayModal) {
    case "Test":
      return <div displayModal={"test"}>Test</div>
    case "Github":
      return <Github />
    case "KanyeWest":
      return <KanyeWest />
    default:
      return <div displayModal={"test"}>Test</div>
  }
};

const CustomModal = ({ displayModal, isShowing, hide }) => isShowing ? 
  <>
    <div className="modal-overlay"/>
     <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
       <div className="customModal">
         <div className="modal-header">
           <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
             <span aria-hidden="true">&times;</span>
           </button>
         </div>         
         <p>
          <APISelection displayModal={displayModal}/>
         </p>
       </div>
     </div>
   </>
 : null;

export default CustomModal;