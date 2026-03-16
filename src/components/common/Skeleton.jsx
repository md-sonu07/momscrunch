import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, className = "", variant = "rectangular" }) => {
    const style = {
        width: width || '100%',
        height: height || '1rem',
    };

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
