import React from 'react';
import SkeletonElement from './skeletonElement';
import Shimmer from './shimmer';
import Skeleton from "react-loading-skeleton";

const SkeletonBlog = () => {
    return (
      <div className="skeleton-wrapper skeleton-blog col-lg-11 ">
        <div style={{ display: "flex" }}>
          <div className="article-card">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'baseline', justifyContent: 'flex-start'}}>
              <SkeletonElement type="avatar" />
              <Skeleton width={100} />
            </div>
          </div>

          <div className="article-content">
            <SkeletonElement type="title" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
          </div>
        </div>
        <Shimmer />
      </div>
    );
}

export default SkeletonBlog;
