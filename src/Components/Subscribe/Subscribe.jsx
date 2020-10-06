
const subscribeStyle = {
    background: '#c2e6f4',
    margin: '50px',
    padding: '50px'
}

const subscribe = (
    <div style={subscribeStyle}>
        <h1 style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: '30px', fontWeight: 'bold' }}>Subscribe</h1>
        <p style={{ textAlign: 'center', margin: '30px', fontWeight: 'bold' }}> Sign up with your email address to reveive news and updates.</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '205px', borderColor: 'white' }} placeholder={'First Name'}></input>
            <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '205px', borderColor: 'white' }} placeholder={'Last Name'}></input>
            <input style={{ margin: '10px', padding: '15px', borderRadius: '12px', width: '205px', borderColor: 'white' }} placeholder={'Email'}></input>
        </div>
        <button style={{ padding: '15px', width: '250px', textAlign: 'center', borderRadius: '10px', margin: '20px', marginLeft: '500px', background: '#f47474', color: 'white', borderColor: '#f47474' }}> Subscribe</button>
    </div>
)