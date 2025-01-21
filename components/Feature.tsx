import React from 'react';

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="feature">
      <i className={icon}></i>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Feature;