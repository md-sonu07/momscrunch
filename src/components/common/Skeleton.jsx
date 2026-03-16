import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, className = "", variant = "rectangular" }) => {
    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;

    const variantClass = {
        rectangular: 'skeleton-rounded',
        circular: 'skeleton-circle',
        text: 'skeleton-text',
        title: 'skeleton-title'
    }[variant] || 'skeleton-rounded';

    return (
        <div
            className={`skeleton ${variantClass} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
