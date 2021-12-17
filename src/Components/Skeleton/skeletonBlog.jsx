import React from 'react';
import SkeletonElement from './skeletonElement';
import Shimmer from './shimmer';

const SkeletonBlog = () => {
    return (
        <div className="skeleton-wrapper skeleton-blog col-lg-11 ">
          <div style={{display: 'flex'}}>
            <div className="article-card">
                <SkeletonElement type="avatar"/>
            </div>

            <div className='article-content'>
                <SkeletonElement type="title" />
                <SkeletonElement type="text" />
                <SkeletonElement type="text" />
                <SkeletonElement type="text" />
                <SkeletonElement type="text" />
                <SkeletonElement type="text" />
            </div>
          </div>
            <Shimmer/>
        </div>
    )
}

export default SkeletonBlog;
