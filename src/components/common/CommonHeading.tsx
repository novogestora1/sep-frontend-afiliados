import React from "react";

interface CommonHeadingProps {
  heading: string;
}

const CommonHeading: React.FC<CommonHeadingProps> = ({ heading }) => {
  return (
    <p className="text-black text-[25px] sm:text-[30px] lg:text-[40px] font-semibold leading-normal tracking--[-0.4px] my-6 sm:my-8 md:my-10 lg:my-12">
      {heading}
    </p>
  );
};

export default CommonHeading;
