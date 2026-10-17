"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import React, { useCallback, useEffect, useState } from "react";
import ServiceIntroductionCard from "../cards/ServiceIntroductionCard";

export default function ServicesIntroductionSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    direction: "rtl",
  });

  useEffect(() => {
    if (emblaApi) {
      // console.log(emblaApi.slideNodes()); // Access API
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="flex w-full flex-col items-center gap-8">
      <div className="flex w-full flex-row items-center gap-2">
        <Image
          src="/icons/icon-close-square.svg"
          alt="Special Offers"
          width={32}
          height={32}
        />
        <h2 className="text-2xl font-medium text-grey">معرفی سرویس ها</h2>
      </div>
      <div className="embla relative w-full">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            <div className="embla__slide flex items-center justify-center">
              <ServiceIntroductionCard />
            </div>
            <div className="embla__slide flex items-center justify-center">
              <ServiceIntroductionCard />
            </div>
            <div className="embla__slide flex items-center justify-center">
              <ServiceIntroductionCard />
            </div>
            <div className="embla__slide flex items-center justify-center">
              <ServiceIntroductionCard />
            </div>
          </div>
        </div>
        <button
          className="embla__next absolute -right-5 top-36 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-grey-200"
          onClick={scrollPrev}
        >
          <Image
            src="/icons/icon-arrow-right-black.svg"
            alt="Previous"
            width={24}
            height={24}
          />
        </button>
        <button
          className="embla__next absolute -left-5 top-36 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-grey-200"
          onClick={scrollNext}
        >
          <Image
            src="/icons/icon-arrow-left-black.svg"
            alt="Next"
            width={24}
            height={24}
          />
        </button>
      </div>
    </section>
  );
}
