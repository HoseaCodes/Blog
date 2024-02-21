import React, { useState } from 'react'
import OptionSelection from './SelectionOptions';
import Translation from './Translation';
import { Configuration, OpenAIApi } from "openai";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AITemplate({ showAITemplate, setShowAITemplate }) {
    const [result, setResult] = useState("");
    const [input, setInput] = useState("");
    const [option, setOption] = useState({});

    const configuration = new Configuration({
        apiKey: process.env.REACT_APP_VITE_Open_AI_Key,
    });

    const openai = new OpenAIApi(configuration);

    const doStuff = async () => {
        try {
            let object = { ...option, prompt: input };
            const response = await openai.createCompletion(object);
            setResult(response.data.choices[0].text);
        } catch (error) {
            console.log(error);
            alert("Error in AI", error);
        }
    };

    const handleChangeInputOPENPAI = e => {
        const { value } = e.target
        setInput(value)
    }

    const selectOption = (option) => {
        setOption(option);
        setResult("")
    };

    const handleState = () => {
        setShowAITemplate(!showAITemplate)
    }

    return (
        <>
            <Button variant="primary" onClick={handleState}>
                Need Help
            </Button>
            &nbsp;
            <span className="qs">? <span className="popover above">Our AI blog bot will help you create stunning blog in a flash.</span></span>
            <Modal
                show={showAITemplate}
                animation={false}
                onHide={() => setShowAITemplate(false)}
                // dialogClassName="modal-100w"
                aria-labelledby="example-custom-modal-styling-title"
                style={{width: '200% !important', right: '40% !important'}}
            >
                <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    AI Solutions
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.values(option).length === 0 ? (
                        <OptionSelection selectOption={selectOption} setInput={setInput} />
                        ) : (
                            <>
                            <Translation  
                            handleChangeInputOPENPAI={handleChangeInputOPENPAI} 
                            doStuff={doStuff} result={result} input={input}
                            selectOption={selectOption} />
                            </>
                    )}
                </Modal.Body>
            </Modal>
        </>
        
    )
}

export default AITemplate;