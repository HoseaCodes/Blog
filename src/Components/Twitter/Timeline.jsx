import React from 'react';
import { Timeline } from 'react-twitter-widgets';

const TweeterTimeline = () => {
    return (
        <div>
            <Timeline dataSource={{
                sourceType: "profile", screenName: "DominiqueRHosea",
            }}
                options={{ theme: "dark", width: "600", height: "600" }}
            />

        </div>
    )
}
export default TweeterTimeline;