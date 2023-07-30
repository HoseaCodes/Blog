import React from 'react'

function Translation({ input, selectOption, doStuff, handleChangeInputOPENPAI, result }) {
    return (
        <div>
            <textarea
                name="input"
                type="text"
                className="text-area"
                cols={55}
                rows={10}
                onChange={handleChangeInputOPENPAI}
                value={result.length > 0 ? result : input}
            ></textarea>
            <button className="action-btn" onClick={doStuff}>
                Create Content
            </button>
            <button className="action-btn" onClick={() => selectOption({})}>
                Reset
            </button>
        </div>
    );
}

export default Translation;