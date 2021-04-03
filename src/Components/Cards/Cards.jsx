import React from 'react'
import Japan from '../../icons/Japan.jpeg';
import skills from '../../icons/cpu.jpeg';
import TSU2 from '../../icons/TSU2.jpeg';
import { CardView } from 'react-card-with-image'
import 'react-card-with-image/dist/index.css'
import './Cards.css'

const items = [
    {
        id: 1,
        header: 'Skill',
        description:
            'I am  well versed in the JavaScript and Python lanuage. I have experience developing both the front and back-end. I excel with frameworks and libraries such as React.js, Django, and Node.js',
        image: skills
    },
    {
        id: 2,
        header: 'Education',
        description:
            'I graduated from Texas Southern University in 2014 with a B.B.A in Management.  I graduated in 2017 with a M.S. in Management Information Systems. Recently, I completed the Software Engineer Immersive Course at General Assembly.',
        image: TSU2
    },
    {
        id: 3,
        header: 'Fun',
        description:
            'I love to learn new things and experience different cultures. I am also, a gamer that loves to play COD. My favorite activity is traveling. Most recently, I found a new found love for Software Engineering and aesthetically pleasing applications.',
        image: Japan
    }
]
const Cards = () => {
    return (<>
        <h2 className='card-click' style={{ fontSize: '2rem', color: 'white', opacity: '.8', textShadow: '2px 2px 2px #206a5d' }}>
            Click titles below to read more about my skills, eduction and interest.</h2>
        <CardView
            items={items}
            activeColor='#206a5d'
            imageHeight='650px'
            imageWidth='800px'
        />

    </>
    )
}
export default Cards