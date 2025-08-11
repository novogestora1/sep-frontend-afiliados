import CommonstepLine from "@/components/common/CommonstepLine";
import CommonHeading from "@/components/common/CommonHeading";
import { Logo } from "@/components/common/Icons";
import Image from "next/image";
import AffiliateForm from "@/components/afiliado/AfiliadoForm";

export default function page() {
  return (
    <div className="px-4 pb-6 max-w-[1280px] w-full mx-auto pt-6 sm:pt-8 md:pt-10 lg:pt-12">
      <div className="flex items-center justify-center">
        <Logo />
      </div>
      <AffiliateForm />
    </div>
  );
}
