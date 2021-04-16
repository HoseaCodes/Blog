import React from "react";
import NavBar2 from "../../Components/NavBar/NavBar2";
import Footer from "../../Components/Footer/Footer"
import SocialRing from "../../Components/Clients/SocialRing";

const Client = () => {
    return (<>
        <NavBar2 />
        <SocialRing />
        <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
        <Footer />
    </>
    )
}


export default Client;