import React from 'react';
import './Timeline.css'
import WordCloud from '../../icons/wordcloud.png'
import ReactWordcloud from 'react-wordcloud';
import { Timeline } from 'react-twitter-widgets';

const TweeterTimeline = () => {
    return (
        <div className='twitter'>
            <Timeline dataSource={{
                sourceType: "profile", screenName: "DominiqueRHosea",
            }}
                options={{ theme: "dark", width: "600", height: "600" }}
            />
            <img className='word-cloud' src={WordCloud} alt="Twitter Info" style={{ width: '600', height: '700 !important' }} />
        </div>
    )
}
export default TweeterTimeline;