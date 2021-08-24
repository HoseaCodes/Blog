import React from 'react'
import './Subscribe.css'

const subscribeStyle = {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgb(35, 41, 47)',
    color: 'white',
    marginBottom: '15rem',
    padding: '1rem',
    borderRadius: '12px',
    height: 'auto',
    textAlign: 'center',
    width: '80%',
    margin: '0 auto'

}

const Subscribe = () => {
    return (
        <div className='subscribe-container' style={subscribeStyle}>
            <h1 style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: '30px', fontWeight: 'bold' }}>Subscribe</h1>
            <hr />
            <p style={{ textAlign: 'center', margin: '30px', color: 'white', fontSize: '1.8rem' }}> Sign up with your email address to reveive news and updates.</p>
            <div className="mb-3">
                <input style={{ margin: '10px', padding: '10px', borderRadius: '12px', width: '70%', borderColor: 'white' }} placeholder={'First Name'}></input>
                <input style={{ margin: '10px', padding: '10px', borderRadius: '12px', width: '70%', borderColor: 'white' }} placeholder={'Last Name'}></input>
                <input style={{ margin: '10px', padding: '10px', borderRadius: '12px', width: '70%', borderColor: 'white' }} placeholder={'Email'}></input>
            </div>
            <button className=" mb-3 personal-btn portfolio-link subscribe-link" >Subscribe</button>
        </div>
    )
}
export default Subscribe;