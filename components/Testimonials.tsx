'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { testimonials } from '@/constants';
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Testimonials = () => {
  return (
    <section className="py-12 px-4 bg-gray-50 rounded-lg my-16 relative">
      <h2 className="text-4xl font-bold text-center uppercase mb-8 text-primary">
        What Our Customers Say
      </h2>
      <Swiper
        spaceBetween={30}
        slidesPerView={1} // Default for mobile
        navigation={true}
        loop
        modules={[Navigation]}
        breakpoints={{
          // When screen width is >= 640px (tablets)
          640: {
            slidesPerView: 1,
          },
          // When screen width is >= 768px (small desktops)
          768: {
            slidesPerView: 2,
          },
          // When screen width is >= 1024px (desktops)
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className="p-4 sm:p-6 lg:p-8">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 italic mb-4">
                {`"${testimonial.quote}"`}
              </p>
              <h4 className="text-lg font-semibold text-blue-600">
                - {testimonial.name}
              </h4>
              <p className="text-sm text-gray-500 mt-2">{testimonial.date}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;