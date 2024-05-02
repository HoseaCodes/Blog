import React, { useEffect, useState } from 'react';

import squeek from '../../../Assets/Sounds/squeek.wav'
import win from '../../../Assets/Sounds/99636__tomlija__small-crowd-yelling-yeah.wav'
import crashSound from '../../../Assets/Sounds/crash.wav'
import '../games.css';

import turtle from '../../../Assets/SVG/turtle-svgrepo-com.svg'
import click from '../../../Assets/SVG/click-svgrepo-com.svg'
import ambulance from '../../../Assets/SVG/ambulance-svgrepo-com.svg'
import bicycle from '../../../Assets/SVG/bicycle-bike-svgrepo-com.svg'
import bus from '../../../Assets/SVG/bus-front-view-svgrepo-com.svg'
import cab from '../../../Assets/SVG/cab-svgrepo-com.svg'
import car from '../../../Assets/SVG/car-svgrepo-com.svg'
import truck from '../../../Assets/SVG/truck-lorry-svgrepo-com.svg'

let showMouse = true

// function ClickLots ({ setPaused, handleWin, losePoint }) {
function ClickLots ( ) {
    document.body.style.backgroundColor = '#88cc00'
    const trafficArray = [ambulance, bicycle, bus, cab, car, truck]
    const [vehicle, setVehicle] = useState(trafficArray[Math.floor(Math.random() * trafficArray.length)])
    const [vehiclePosition, setVehiclePosition] = useState(15)
    const [vehicle2, setVehicle2] = useState(trafficArray[Math.floor(Math.random() * trafficArray.length)])
    const [vehicle2Position, setVehicle2Position] = useState(5)
    const [positionX, setPositionX] = useState(5)
        
    useEffect(() => {
        const int = setInterval(() => {
            if (vehiclePosition < 120) {
                setVehiclePosition(vehiclePosition + 1.6)
            } else {
                setVehicle(trafficArray[Math.floor(Math.random() * trafficArray.length)])
                setVehiclePosition(0)
            }
            if (vehicle2Position < 120) {
                setVehicle2Position(vehicle2Position + 2.4)
            } else {
                setVehicle2(trafficArray[Math.floor(Math.random() * trafficArray.length)])
                setVehicle2Position(0)
            }
            if (vehiclePosition >= 40 && vehiclePosition <= 41 && positionX >= 45 && positionX <= 55) {
                // losePoint()
                let creash = new Audio(crashSound);
                creash.loop = false;
                creash.play();
            }
            if (vehicle2Position >= 50 && vehicle2Position <= 51 && positionX >= 35 && positionX <= 45) {
                // losePoint()
                let creash = new Audio(crashSound);
                creash.loop = false;
                creash.play();
            }
        }, 20);
        return () => clearInterval(int)
    })

    function handleClick () {
        showMouse = false
        let move = new Audio(squeek);
        move.loop = false;
        move.play();
        // setPaused(false)
        let x = positionX
        let i = 0
        const int = setInterval(() => {
            x++
            i++
            setPositionX(x)
            if (i > 4) { clearInterval(int) }
            if (positionX >= 85 && i > 4) {
                let winGame = new Audio(win);
                winGame.loop = false;
                winGame.play();
                // handleWin(true)
                setPositionX(0)
            }
        }, 10)
    }
    return (
        <div onClick={() => handleClick()} className='clickWrapper' >
            {showMouse && <p className='instructionText'>click lots. don't get hit by traffic</p>}

            <img className='turtle' src={turtle} alt="" style={{left: `${positionX}vw`}} />
            <div className='finishLine'></div>
            {showMouse && <img className='clickLots' alt='click' src={click} /> }
            <div className='road'>
                <img className='vehicle' style={{top: `${vehiclePosition}vh`}} src={vehicle}  alt="" />
                <img className='vehicle2' style={{bottom: `${vehicle2Position}vh`}} src={vehicle2} alt="" />
                <div className='centreline' />
            </div>
        </div>
    );
}

export default ClickLots;