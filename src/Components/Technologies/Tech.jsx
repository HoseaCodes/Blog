import React, { Component } from 'react';
import Bootstrap from '../../icons/Bootstrap.png';
import JS from '../../icons/jsicon.png';
import Django from '../../icons/django.png';
import MongoDB from '../../icons/MongoDB.png';
import Node from '../../icons/Node.png';
import postgresql from '../../icons/postgresql.png';
import Py from '../../icons/Py.png';
import Reactt from '../../icons/Reactt.png';
import Swift from '../../icons/swift.png';
import JQuery from '../../icons/jquery.png';
import './Technologies.css';

class Tech extends Component {
    render() {
        const img = [Bootstrap, JS, Django, MongoDB, Node, postgresql, Py, Reactt, Swift, JQuery, 'https://i.imgur.com/wiEM1zo.png', 'https://i.imgur.com/NhpXJN2.png'];
        return (
            <>
                <div className="tech-container">
                    <h2 className='tech-title'>Technologies</h2>

                    <div class="client-slider">
                        <div class="client-slide-track">
                            <div class="client-slide">
                                <img src={Bootstrap} height="100" width="150" alt="Social Ring" />
                            </div>
                            <div class="client-slide">
                                <img src={JS} height="100" width="150" alt="" />
                            </div>
                            <div class="client-slide">
                                <img src={Django} height="100" width="150" alt="" />
                            </div>
                            <div class="client-slide">
                                <img src={MongoDB} height="100" width="150" alt="" />
                            </div>
                            <div class="client-slide">
                                <img src={Node} height="100" width="150" alt="" />
                            </div>
                            <div class="client-slide">
                                <img src={postgresql} height="100" width="150" alt="" />
                            </div>
                            <div class="client-slide">
                                <img src={Py} height="100" width="150" alt="" />
                            </div>
                            <div class="client-slide">
                                <img src={Reactt} height="100" width="150" alt="" />
                            </div>
                            <div class="client-slide">
                                <img src={Swift} height="100" width="150" alt="Social Ring" />
                            </div>
                            <div class="client-slide">
                                <img className="pinklemonade" src={img[10]} height="100" width="120" alt="PinkLemonade" />
                            </div>
                            <div class="client-slide">
                                <img src={img[11]} height="100" width="150" alt="" />
                            </div>

                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default Tech;
