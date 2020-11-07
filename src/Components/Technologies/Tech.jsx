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
import Carousel from 'react-elastic-carousel';
import './Technologies.css';




class Tech extends Component {
    state = {
        items: [
            { id: 1, title: 'JavaScript', img: JS },
            { id: 2, title: 'Bootstrap', img: Bootstrap },
            { id: 3, title: 'Django', img: Django },
            { id: 4, title: 'MongoDB', img: MongoDB },
            { id: 5, title: 'postgresql', img: postgresql },
            { id: 6, title: 'Swift', img: Swift },
            { id: 7, title: 'jQuery', img: JQuery },
            { id: 8, title: 'React', img: Reactt },
            { id: 9, title: 'Python', img: Py },
            { id: 10, title: 'Node', img: Node },
        ]
    }
    constructor(props) {
        super(props)
        this.breakPoints = [
            { width: 375, itemsToShow: 1 },
            { width: 768, itemsToShow: 2 },
            { width: 850, itemsToShow: 2 },
        ];

    }
    render() {
        const { items } = this.state;

        return (
            <>
                <h2 className='tech-title'>Technologies</h2>
                <Carousel itemsToScroll={1} itemsToShow={3}
                    initialActiveIndex={0} focusOnSelect={true}
                    enableAutoPlay autoPlaySpeed={2000}
                    itemPadding={[10, 40]} breakPoints={this.breakPoints} >
                    {items.map(item => <div key={item.id}>
                        <img src={item.img} alt={item.title} width='375px' height='300px' />
                    </div>)}
                </Carousel>
            </>
        );
    }
};

export default Tech;
