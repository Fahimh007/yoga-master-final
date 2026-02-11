import React, { useEffect, useRef } from 'react';
import { register } from 'swiper/element/bundle';
import Hero from './Hero';
import Hero2 from './Hero2';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

register();

const HeroContainer = () => {
  const swiperElRef = useRef(null);

  useEffect(() => {
    const el = swiperElRef.current;
    if (!el) return;

    const swiperParams = {
      slidesPerView: 1,
      navigation: true,
      pagination: { clickable: true },
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      }
    };

    Object.assign(el, swiperParams);
    el.init = false;
    el.initialize();
  }, []);

  return (
    <div className="relative">
      <swiper-container ref={swiperElRef} init="false" style={{ width: '100%', height: '100vh' }}>
        <swiper-slide style={{ height: '100%' }}>
          <Hero />
        </swiper-slide>
        <swiper-slide style={{ height: '100%' }}>
          <Hero2 />
        </swiper-slide>
      </swiper-container>
    </div>
  );
};

export default HeroContainer;