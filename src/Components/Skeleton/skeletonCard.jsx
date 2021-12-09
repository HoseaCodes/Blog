import React from 'react';
import SkeletonElement from './skeletonElement';
import Shimmer from './shimmer';

const SkeletonCard = () => {
    return (
        <div className="skeleton-wrapper col-lg-5 ">
            <div className="skeleton-card">
                <SkeletonElement type="avatar"/>
                <SkeletonElement type="title" />
                <SkeletonElement type="text" />
                <SkeletonElement type="text" />
            </div>
            <Shimmer/>
        </div>
    )
}

export default SkeletonCard;
