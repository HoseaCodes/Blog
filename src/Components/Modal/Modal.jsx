import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import ShareIcon from '@material-ui/icons/Share';


function PModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <a className='social'> <ShareIcon fontSize="large" onClick={handleShow} /> </a>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Get Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>Share this portfolio!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
            </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PModal;