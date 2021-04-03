import React from 'react';
import './Timeline.css'
import { Timeline } from 'react-twitter-widgets';

const TweeterTimeline = () => {
    return (
        <div className='twitter'
            data-aos="fade-right"
            data-aos-offset="600"
            data-aos-easing="ease-in"
            data-aos-duration="500"

        >
            <Timeline dataSource={{
                sourceType: "profile", screenName: "DominiqueRHosea",
            }}
                options={{ theme: "dark", width: "600", height: "600" }} />
        </div>
    )
}
export default TweeterTimeline;