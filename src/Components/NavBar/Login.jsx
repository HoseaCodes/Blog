import React from 'react';

function Login({ login }) {
    return (
        <section>
            <h1> Sorry, you must be logged in to see the rest of the articles.</h1>
            <button onClick={login}>Login with Google</button>
        </section>
    )
}
export default Login;