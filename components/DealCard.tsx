import Image from 'next/image';
import React from 'react';

interface DealCardProps {
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const DealCard: React.FC<DealCardProps> = ({ image, title, description, ctaText, ctaLink }) => {
  return (
    <div className="deal-card">
      <Image src={image} alt={title} className="deal-image" />
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={ctaLink} className="cta-button">
        {ctaText}
      </a>
    </div>
  );
};

export default DealCard;