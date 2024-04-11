import React, { Component } from 'react';
import './Technologies.css';
import SkillSlider from './SkillSlider';
import SkillSlider2 from './SkillSlider2';


class Tech extends Component {

    render() {
        return (
          <>
            <div className="tech-container">
              <h2
                data-aos="fade-down"
                data-aos-offset="500"
                data-aos-duration="3000"
                data-aos-easing="ease-in"
                className="tech-title"
              >
                Technologies
              </h2>
              <SkillSlider2 />
              {/* <SkillSlider /> */}

            </div>
          </>
        );
    }
}

export default Tech;
