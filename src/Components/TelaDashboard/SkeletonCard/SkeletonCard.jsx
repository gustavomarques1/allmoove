import React from 'react';
import './SkeletonCard.css';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-header">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-icon"></div>
      </div>
      <div className="skeleton-number"></div>
      <div className="skeleton-text skeleton-description"></div>
    </div>
  );
}

export default SkeletonCard;
