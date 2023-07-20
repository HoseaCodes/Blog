import React from 'react'
import './Subscribe.css'

const Subscribe = () => {
    return (
        <form className='subscribe-container' action="https://getform.io/f/7efda21f-ca67-48f6-8a1e-723776d4ae3b" method='POST' >
            <h1>Subscribe</h1>
            <hr />
            <p > Sign up with your email address to reveive news and updates.</p>
            <div className="mb-3">
                <input type="text" name="firstName" placeholder={'First Name'}></input>
                <input type="text" name="lastName" placeholder={'Last Name'}></input>
                <input type="email" name="email"  placeholder={'Email'}></input>
            </div>
            <button className=" mb-3 personal-btn portfolio-link subscribe-link" >Subscribe</button>
        </form>
    )
}
export default Subscribe;