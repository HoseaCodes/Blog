import React from 'react'
import { arrayItems } from "../../utils/AIOptions";

function OptionSelection({ selectOption, setInput }) {
    const handleClick = (item) => {
        selectOption(item.option)
        setInput(item.description)
    }
    return (
        <>
        <h1 className="heading">AI Solutions</h1>

        <div className="grid-main">
            {arrayItems.map((item) => {
            return (
                <div
                className="grid-child"
                onClick={() => handleClick(item)}
                >
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                </div>
            );
            })}
        </div>
        </>
    );
}

export default  OptionSelection;