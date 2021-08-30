import React from 'react'
import './Subscribe.css'

const Subscribe = () => {
    return (
        <div className='subscribe-container' >
            <h1>Subscribe</h1>
            <hr />
            <p > Sign up with your email address to reveive news and updates.</p>
            <div className="mb-3">
                <input placeholder={'First Name'}></input>
                <input placeholder={'Last Name'}></input>
                <input placeholder={'Email'}></input>
            </div>
            <button className=" mb-3 personal-btn portfolio-link subscribe-link" >Subscribe</button>
        </div>
    )
}
export default Subscribe;