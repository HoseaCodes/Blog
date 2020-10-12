import { Visibility } from '@material-ui/icons'
import React from 'react'
import './Subscribe.css'

const subscribeStyle = {
    background: '#c2e6f4',
    margin: '50px',
    padding: '50px'
}

const Subscribe = () => {
    return (
        <div className='subscribe-container' style={subscribeStyle}>
            <h1 style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: '30px', fontWeight: 'bold' }}>Subscribe</h1>
            <p style={{ textAlign: 'center', margin: '30px', fontWeight: 'bold' }}> Sign up with your email address to reveive news and updates.</p>
            <div>
                <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '205px', borderColor: 'white' }} placeholder={'First Name'}></input>
                <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '205px', borderColor: 'white' }} placeholder={'Last Name'}></input>
                <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '205px', borderColor: 'white' }} placeholder={'Email'}></input>
                <button className='sub-btn' >Subscribe</button>
            </div>
        </div>
    )
}
export default Subscribe;