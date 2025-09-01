'use client';

import React from 'react';
import Image from 'next/image';

interface SharedModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SharedModalWrapper: React.FC<SharedModalWrapperProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-[3px] max-w-[739px] w-full h-auto min-h-[500px] lg:min-h-[600px] overflow-hidden relative shadow-2xl text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute lg:top-4.75 right-5.5 text-white hover:bg-white/20 rounded-full transition-colors z-10"
          aria-label="Close modal"
          onClick={onClose}
        >
          <Image
            src="/icons/Navigation.svg"
            alt="close"
            width={49}
            height={23}
            className="w-[49px] h-[23px]"
          />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Section - Form */}
          <div className="bg-kbt-deep-green flex flex-col justify-center gap-[12px] w-full lg:max-w-[370px] pt-6 lg:pt-9 pb-4 lg:pb-5">
            {children}
          </div>

          {/* Right Section - Full Image */}
          <div className="hidden lg:block flex-1 h-full w-full">
            <Image
              src="/images/KDA_Image_Rickhouse_2.jpg"
              alt="Bourbon barrel warehouse"
              width={450}
              height={780}
              className="w-full h-full object-cover object-center rounded-r-xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedModalWrapper;
