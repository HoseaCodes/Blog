import React, {useContext} from 'react'
import { GlobalState } from '../../GlobalState'

const KanyeWest = () => {
    const state = useContext(GlobalState)
    const [kayneWestData] = state.kayneWestAPI.kayneWestData
    const [fetchData] = state.kayneWestAPI.kayneWestData

    const handleSubmit = () => {
        console.log(fetchData)
    }
    return (
        <div class="card">
            <button class="btn displayBtn" id="kanyeDisplayBtn">View Kanye's Tweets</button>
            <section id="kanye" class="kanye-container">
                <div class="kanye-text">
                    <p id="kanye-quote">{kayneWestData}</p>
                    <p> -by Kanye West</p>
                </div>
                <button onClick={handleSubmit} class="btn" id="kanye-quote-btn">Click Here</button>
            </section>
        </div>
    )
}

export default KanyeWest