import CommonHeading from "@/components/common/CommonHeading";
import { Logo } from "@/components/common/Icons";
import CheckoutPayment from "@/components/cadastro/passo4/CheckoutPayment";
import React from "react";
import CommonstepLine from "@/components/common/CommonstepLine";
import Image from "next/image";

const Page = () => {
  return (
    <>
      <div className="px-4 pb-6 max-w-[1280px] w-full mx-auto pt-6 sm:pt-8 md:pt-10 lg:pt-12">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <div className="flex flex-col items-center mt-5 sm:mt-16  lg:mt-[110px]">
          <CommonHeading heading="Parabéns, seu cadastro esta completo!" />
          <Image
            src="/images/png/member_confirm.png"
            height={446}
            width={766}
            alt="confirm img"
            className="-mt-8 lg:-mt-14"
          />
        </div>
      </div>
    </>
  );
};

export default Page;
