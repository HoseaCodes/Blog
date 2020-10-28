import React from 'react';
import './PersonalBrand.css';
import Resume from '../Resume/Resume';
import Cards from '../Cards/Cards'


const PersonalBrand = () => {
    return (<>

        <div className='personal-container'>
            <Cards />
            <Resume />
        </div>

    </>
    )
}

export default PersonalBrand;
