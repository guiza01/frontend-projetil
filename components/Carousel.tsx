'use client'
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";

interface CarouselProps {
  images: string[];
}

const carouselConfig = {
  spaceBetween: 10,
  slidesPerView: 1,
  navigation: true,
  pagination:true,
  breakpoints: {
    320:{
      pagination:{enabled: false}
    },
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination:{enabled: false}
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 40,
      pagination:{enabled: false}
    },
    1024: {
      slidesPerView:3,
      spaceBetween: 30,
      navigation: {enabled:false},
      pagination:{enabled: true, }
    },
  },
};

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  return (
    <Swiper
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      breakpoints={carouselConfig.breakpoints}
      loop={true}
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      navigation={carouselConfig.navigation}
      pagination={carouselConfig.pagination}
      slidesPerView={carouselConfig.slidesPerView}
      spaceBetween={carouselConfig.spaceBetween}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index} className="">
          <div className="h-64 w-72 lg:w-full rounded-3xl border-2 border-white lg:border-none mx-auto flex items-center justify-center">
            <img alt={`Slide ${index + 1}`} className="h-full w-full rounded-3xl lg:rounded-xl object-cover" src={image} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
