import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Preview({show, setShow, marked, article}) {
    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>
                Blog Post Preview
            </Button>

            <Modal
                show={show}
                animation={false}
                onHide={() => setShow(false)}
                // dialogClassName="modal-100w"
                aria-labelledby="example-custom-modal-styling-title"
                style={{width: '200% !important', right: '40% !important'}}
            >
                <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    Blog Post Preview
                </Modal.Title>
                </Modal.Header>
                <Modal.Body dangerouslySetInnerHTML={{ __html: marked(article.markdown) }}>
                    
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Preview