import React, { useState } from 'react';
import mouse from '../../../Utils/useMousePosition'
import useWindowSize from '../../../Utils/useWindowSize'

import birdhit from '../../../Assets/Sounds/squawk.wav'

// export default function Bird({ randomYindex, handleWin }) {
export default function Bird({ randomYindex }) {

    const { x, y } = mouse();
    const size = useWindowSize();

    const [positionX, setPositionX] = useState('')
    const [positionY, setPositionY] = useState(randomYindex)
    const [birdClass, setBirdClass] = useState('bird birdfly')
 

    function handleHit () {
        setPositionX(x - 65)
        setPositionY(((y / size.height) * 100) - 4)
        setBirdClass('bird birdhit')
        let birdSound = new Audio(birdhit);
        birdSound.loop = false;
        birdSound.play();
        // handleWin()
    }

    return (
            <div draggable='false' className={birdClass} style={{top: `${positionY}vh`, left: positionX}} alt="bird" >
                <div className='birdTarget' onClick={() => handleHit()} />
            </div>
    );
}