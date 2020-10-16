import React from 'react';
import './Timeline.css'
import WordCloud from '../../icons/wordcloud.png'
// import ReactWordcloud from 'react-wordcloud';
import { Timeline } from 'react-twitter-widgets';

const words = [
    {
        text: 'text',
        value: 79,
    },
    {
        text: 'twitter',
        value: 143,
    },
    {
        text: '#softwareengineer',
        value: 30,
    },
    {
        text: 'http',
        value: 125,
    },
    {
        text: 'tweet',
        value: 10,
    },
    {
        text: 'webdeveloper',
        value: 2,
    },
    {
        text: 'preparation',
        value: 8,
    },
    {
        text: 'logo',
        value: 8,
    },
    {
        text: 'dailycssimages',
        value: 14,
    },
    {
        text: 'different career path',
        value: 1,
    },
    {
        text: 'JavaScript',
        value: 100,
    },
    {
        text: 'Python',
        value: 232,
    },
    {
        text: 'hero of tomorrow',
        value: 1,
    },
    {
        text: 'first coding class',
        value: 1,
    },
    {
        text: 'project',
        value: 2,
    },
    {
        text: 'Texas Southern University',
        value: 1,
    },
    {
        text: 'interview',
        value: 1,
    },
    {
        text: 'byte',
        value: 1,
    },
    {
        text: 'ajax call',
        value: 1,
    },
    {
        text: 'professional summary',
        value: 1,
    },
    {
        text: 'favicon',
        value: 1,
    },
    {
        text: 'hamburger menu',
        value: 1,
    },
    {
        text: 'random site',
        value: 1,
    },
    {
        text: 'animation',
        value: 1,
    },
    {
        text: 'key frame',
        value: 1,
    },
    {
        text: 'selma',
        value: 1,
    },
    {
        text: 'mobile device',
        value: 1,
    },
    {
        text: 'hard time',
        value: 1,
    },
    {
        text: 'tutorial ',
        value: 1,
    },
]

const TweeterTimeline = () => {
    return (
        <div className='twitter'>
            <Timeline dataSource={{
                sourceType: "profile", screenName: "DominiqueRHosea",
            }}
                options={{ theme: "dark", width: "600", height: "600" }}
            />
            {/* <ReactWordcloud words={words} /> */}
            <img className='word-cloud' src={WordCloud} alt="Twitter Info" style={{ width: '600', height: '700 !important' }} />
        </div>
    )
}
export default TweeterTimeline;