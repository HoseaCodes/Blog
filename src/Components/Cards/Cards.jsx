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
            'I am skilled in front and back-end technologies, frameworks, tools, and methods. I currently excel with React.js and Node.js',
        image: skills
    },
    {
        id: 2,
        header: 'Education',
        description:
            'I followed my passion and took the Software Engineer Immersive Course at General Assembly. Before that, I graduated from Texas Southern University in 2017 with a degree in Management Information Systems. Since 2014 I have been working as an Operations Manager in logistics.',
        image: TSU2
    },
    {
        id: 3,
        header: 'Fun',
        description:
            'I love to learn, COD, traveling and sports like activities. I am passionate about Software Engineering and aesthetically pleasing applications.',
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