import React from 'react'
import Japan from '../../icons/Japan.jpeg';
import skills from '../../icons/skills.jpg';
import TSU2 from '../../icons/TSU2.jpeg';
import { CardView } from 'react-card-with-image'
import 'react-card-with-image/dist/index.css'
import './Cards.css'

const items = [
    {
        id: 1,
        header: 'Skill',
        description:
            'I am  well versed in the JavaScript and Python lanuage. I have experience developing both the front and back-end. I excel framework and libraries such as React.js, Django, and Node.js',
        image: skills
    },
    {
        id: 2,
        header: 'Education',
        description:
            'I graduated from Texas Southern University in 2014 with a B.B.A in Management and again in 2017 with a M.S. in Management Information Systems. Recently, I  took the Software Engineer Immersive Course at General Assembly.',
        image: TSU2
    },
    {
        id: 3,
        header: 'Fun',
        description:
            'I love to learn new things. I am also, a gamer that loves to play COD. My favorite activity is traveling. Most recently, I found a new found love for Software Engineering and aesthetically pleasing applications.',
        image: Japan
    }
]
const Cards = () => {
    return (<>
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