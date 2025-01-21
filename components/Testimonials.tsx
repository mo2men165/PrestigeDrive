'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { testimonials } from '@/constants';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  date: string;
}

const Testimonials = () => {
  return (
    <section className="py-12 px-4 bg-gray-50 rounded-lg my-16 relative">
      <h2 className="text-4xl font-bold text-center uppercase mb-8 text-gray-800">
        What Our Customers Say
      </h2>
      <Swiper
        spaceBetween={30}
        slidesPerView={2}
        navigation={true}
        modules={[Navigation]}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className='p-20'>
            <div className="mx-2 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 italic mb-4">
                "{testimonial.quote}"
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