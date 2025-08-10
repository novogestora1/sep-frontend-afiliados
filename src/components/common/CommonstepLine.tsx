import {
  ClearedStepIcon,
  CurrentStepIcon,
  NextStepArrowIcon,
  NextStepIcon,
  PastStepArrowIcon,
} from "@/components/common/Icons";
import React from "react";
interface CommonstepLineProps {
  CurrentStep: number;
}
const CommonstepLine: React.FC<CommonstepLineProps> = ({ CurrentStep }) => {
  const staplineDatta = [
    {
      text: "Endereço",
    },
    {
      text: "Dados da Empresa",
    },
    {
      text: "Adesão",
    },
    {
      text: "Mensalidades",
    },
    {
      text: "Confirmação",
    },
  ];

  return (
    <section className="flex items-center justify-between gap-1 xl:gap-2 w-full mt-5 lg:mt-8">
      {staplineDatta.map((items, index) => (
        <div key={index} className="flex w-full items-center gap-2">
          <div className="flex items-center gap-1 xl:gap-2">
            <span>
              {index + 1 === CurrentStep ? (
                <CurrentStepIcon />
              ) : index + 1 < CurrentStep ? (
                <ClearedStepIcon />
              ) : (
                <NextStepIcon />
              )}
            </span>
            <div className="flex  items-center justify-center gap-1 xl:gap-2">
              <p
                className={` steptext ${
                  index + 1 <= CurrentStep
                    ? "text-[#433c50]"
                    : "text-[#2E263D]/40"
                }`}
              >
                0{index + 1}
              </p>
              <p className="text-[#433c50] stepdesc">{items.text}</p>
            </div>
          </div>
          {staplineDatta.length - 1 !== index && (
            <>
              {" "}
              <span className="lg:hidden -rotate-90">
                <PastStepArrowIcon />
              </span>
              <div
                className={`stepline max-lg:hidden ${
                  index + 1 <= CurrentStep - 1
                    ? "bg-[#0E2B57]"
                    : "bg-[rgba(14,43,87,0.10)]"
                }`}
              ></div>
            </>
          )}
        </div>
      ))}
    </section>
  );
};

export default CommonstepLine;
