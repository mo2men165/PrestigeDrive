import React from 'react';

interface TestimonialProps {
  image: string;
  quote: string;
  name: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ image, quote, name }) => {
  return (
    <div className="testimonial">
      <img src={image} alt={name} className="testimonial-image" />
      <p>"{quote}"</p>
      <h4>- {name}</h4>
    </div>
  );
};

export default Testimonial;