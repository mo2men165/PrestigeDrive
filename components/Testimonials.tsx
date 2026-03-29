'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { testimonials } from '@/constants';
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  return (
    <section className="py-12 relative">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">
          Client Feedback
        </p>
        <h2 className="text-3xl font-bold text-gray-900">
          What Our Customers Say
        </h2>
      </div>

      <Swiper
        spaceBetween={24}
        slidesPerView={1}
        navigation
        loop
        modules={[Navigation]}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className="pb-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow mx-2">
              <FaQuoteLeft className="text-secondary/30 text-2xl mb-4" />
              <p className="text-gray-600 leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-secondary text-sm" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(testimonial.date).toLocaleDateString('en-GB', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
