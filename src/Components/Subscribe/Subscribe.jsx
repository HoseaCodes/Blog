import { Visibility } from '@material-ui/icons'
import React from 'react'
import './Subscribe.css'

const subscribeStyle = {
    background: 'gray',
    margin: '50px',
    padding: '50px',
    borderRadius: '12px'

}

const Subscribe = () => {
    return (
        <div className='subscribe-container' style={subscribeStyle}>
            <h1 style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: '30px', fontWeight: 'bold' }}>Subscribe</h1>
            <hr />
            <p style={{ textAlign: 'center', margin: '30px', color: 'black' }}> Sign up with your email address to reveive news and updates.</p>
            <div>
                <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '205px', borderColor: 'white' }} placeholder={'First Name'}></input>
                <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '205px', borderColor: 'white' }} placeholder={'Last Name'}></input>
                <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '305px', borderColor: 'white' }} placeholder={'Email'}></input>
            </div>
            <button className='btn' >Subscribe</button>
        </div>
    )
}
export default Subscribe;