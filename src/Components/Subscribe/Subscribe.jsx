import React from 'react'
import './Subscribe.css'

const subscribeStyle = {
    display: 'flex',
    flexDirection: 'column',
    background: 'gray',
    marginBottom: '15rem',
    padding: '1rem',
    borderRadius: '12px',
    width: 'auto',
    height: 'auto',
    textAlign: 'center'

}

const Subscribe = () => {
    return (
        <div className='subscribe-container' style={subscribeStyle}>
            <h1 style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: '30px', fontWeight: 'bold' }}>Subscribe</h1>
            <hr />
            <p style={{ textAlign: 'center', margin: '30px', color: 'black' }}> Sign up with your email address to reveive news and updates.</p>
            <div>
                <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '70%', borderColor: 'white' }} placeholder={'First Name'}></input>
                <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '70%', borderColor: 'white' }} placeholder={'Last Name'}></input>
                <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '80%', borderColor: 'white' }} placeholder={'Email'}></input>
            </div>
            <button className='btn' >Subscribe</button>
        </div>
    )
}
export default Subscribe;