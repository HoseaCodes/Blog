
import React, {useState} from 'react';
import Birds from '../Components/Games/BirdShooter/birds';
import FoodFall from '../Components/Games/FoodFall/foodfall';
import SpaceInvaders from '../Components/Games/SpaceInvaders/spaceinvaders';

const Games = () => {
    const [loading, setLoading] = useState(true)

    
    return (
        <>
            <div className='header2'>
                <div className='header-logo'></div>
            </div>
            <div>
                {/* <SpaceInvaders/> */}
                {/* <Birds/> */}
                <FoodFall/>
            </div>
        </>
    )

}

export default Games;
