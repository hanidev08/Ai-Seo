"use client";
import {
  DotLottieCommonPlayer,
  DotLottiePlayer,
} from "@dotlottie/react-player";
import Image from "next/image";
import productImage from "@/assets/product-image.png";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  ValueAnimationTransition,
} from "framer-motion";
import { ComponentPropsWithRef, useEffect, useRef, useState } from "react";

const tabs = [
  {
    icon: "/assets/lottie/vroom.lottie",
    title: "User-friendly dashboard",
    isNew: false,
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSizeX: 150,
  },
  {
    icon: "/assets/lottie/click.lottie",
    title: "One-click optimization",
    isNew: false,
    backgroundPositionX: 98,
    backgroundPositionY: 100,
    backgroundSizeX: 135,
  },
  {
    icon: "/assets/lottie/stars.lottie",
    title: "Smart keyword generator",
    isNew: true,
    backgroundPositionX: 100,
    backgroundPositionY: 27,
    backgroundSizeX: 177,
  },
];

const FeatureTap = (
  tab: (typeof tabs)[number] &
    ComponentPropsWithRef<"div"> & { selected: boolean }
) => {
  const tabRef = useRef<HTMLDivElement>(null);
  const dotLottieRef = useRef<DotLottieCommonPlayer>(null);

  const xPercentTage = useMotionValue(0);
  const yPercentTage = useMotionValue(0);

  const maskImage = useMotionTemplate`radial-gradient(80px 80px at ${xPercentTage}% ${yPercentTage}%, black, transparent)`;

  useEffect(() => {
    if (!tabRef.current) return;
    const { height, width } = tabRef.current?.getBoundingClientRect();
    const circumference = height * 2 + width * 2;

    const times = [
      0,
      width / circumference,
      (width + height) / circumference,
      (width * 2 + height) / circumference,
      1,
    ];
    const options: ValueAnimationTransition = {
      times,
      duration: 4,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
    };
    animate(xPercentTage, [0, 100, 100, 0, 0], options);

    animate(yPercentTage, [0, 0, 100, 100, 0], options);
  }, [tab.selected, xPercentTage, yPercentTage]);
  const handleTabHover = () => {
    if (dotLottieRef.current === null || tab.selected) return;
    xPercentTage.set(0);
    yPercentTage.set(0);

    dotLottieRef.current.seek(0);
    dotLottieRef.current.play();
  };
  return (
    <div
      ref={tabRef}
      onMouseEnter={handleTabHover}
      className=" border border-white/15 flex p-2.5 rounded-xl gap-2.5 items-center lg:flex-1 relative"
      onClick={tab.onClick}
    >
      {tab.selected && (
        <motion.div
          style={{
            maskImage,
          }}
          className=" absolute inset-0 -m-px border border-[#A369FF] rounded-xl [mask-image:]"
        ></motion.div>
      )}

      <div className=" h-12 w-12 border border-white/15 rounded-lg inline-flex items-center justify-center">
        <DotLottiePlayer
          ref={dotLottieRef}
          src={tab.icon}
          className=" h-5 w-5"
          autoplay
        />
      </div>
      <div className=" font-medium">{tab.title}</div>
      {tab.isNew && (
        <div className="text-xs rounded-full px-2 py-0.5 bg-[#8c44ff] text-black font-semibold">
          new
        </div>
      )}
    </div>
  );
};

export const Features = () => {
  const [seletedTab, setSeletedTab] = useState(0);

  const backgroundPositionX = useMotionValue(tabs[0].backgroundPositionX);
  const backgroundPositionY = useMotionValue(tabs[0].backgroundPositionY);
  const backgroundSizeX = useMotionValue(tabs[0].backgroundSizeX);

  const backgroundPosition = useMotionTemplate`${backgroundPositionX}% ${backgroundPositionY}%`;
  const backgroundSize = useMotionTemplate`${backgroundSizeX}% auto`;
  const handleSelectedTab = (index: number) => {
    setSeletedTab(index);

    animate(
      backgroundSizeX,
      [backgroundSizeX.get(), 100, tabs[index].backgroundSizeX], // تأكد أن tabs[index].backgroundSizeX رقم
      {
        duration: 2,
        ease: "easeInOut",
      }
    );

    animate(backgroundPositionX, tabs[index].backgroundPositionX, {
      duration: 2,
      ease: "easeInOut",
    });
    animate(backgroundPositionY, tabs[index].backgroundPositionY, {
      duration: 2,
      ease: "easeInOut",
    });
  };
  return (
    <section className=" py-20 md:py-24">
      <div className="container">
        <h2 className=" text-5xl md:text-6xl font-medium text-center tracking-tighter">
          Elevate your SEO efforts
        </h2>
        <p className=" text-white/70 text-lg md:text-xl max-w-2xl mx-auto mt-2 tracking-tighter text-center">
          From small startups to large enterprises, our AI-driven tool has
          revelutionized the way businesses approach SEO
        </p>
        <div className=" mt-10 flex flex-col lg:flex-row gap-3">
          {tabs.map((tab, tabIndex) => (
            <FeatureTap
              {...tab}
              selected={seletedTab === tabIndex}
              key={tab.title}
              onClick={() => {
                handleSelectedTab(tabIndex);
              }}
            />
          ))}
        </div>
        <div className=" border border-white/20 p-2.5 rounded-xl mt-3">
          <motion.div
            className=" aspect-video bg-cover border border-white/20 rounded-lg"
            style={{
              backgroundPosition,
              backgroundSize,
              backgroundImage: `url(${productImage.src})`,
            }}
          ></motion.div>
          {/* <Image src={productImage} alt="Product image" /> */}
        </div>
      </div>
    </section>
  );
};
