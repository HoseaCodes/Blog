import React from 'react';
import { Link } from 'react-router-dom';
import {ProjectCardWrapper, CardMask, CardSubtitle, CardTitle,
  CardTextWrapper, CardOverlay, CardCover,
   CardBtn, CardBtnMask, CardIcon, CardSVG,
   CardSVGPath} from '../../Layout/Card/styledCard';

function ProjectCard(props) {

  return (
      <>
        <ProjectCardWrapper>
          <CardMask />
          <div>
            <div className="case-studies-list">
                  <Link to={`/project/${props.project.id}`}  className="case-study" style={{backgroundImage: `url(${props.project.img})`}}>
                    <div className="case-study-mask"></div>
                    <div className="case-study-reveal-mask"></div>
                    <div className="case-study-mask-number">
                      <CardCover >0{props.project.id}</CardCover>
                      <CardCover>
                        <CardOverlay data-index={`0${props.project.id}`}>{props.project.id}</CardOverlay>
                      </CardCover>
                    </div>
                    <CardTextWrapper>
                      <CardTitle>{props.project.name}</CardTitle>
                      <CardSubtitle>{props.project.title}</CardSubtitle>
                      <CardBtn>
                        <span>Case Study</span>
                        <CardBtnMask />
                        <CardIcon>
                          <CardSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476.213 476.213"><CardSVGPath d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></CardSVGPath></CardSVG>
                        </CardIcon>
                      </CardBtn>
                    </CardTextWrapper>
                  </Link>
                </div>
              </div>
        </ProjectCardWrapper>
      </>
    )
}

export default ProjectCard;
