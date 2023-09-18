import { CouponDataType } from "@/types";

type CouponeProps = {
  datas: Pick<CouponDataType, "title" | "expireDate">;
};

const Coupon = ({ datas }: CouponeProps) => {
  return (
    <div className="relative w-full p-3 rounded-sm flex flex-col bg-white mb-3">
      <h2 className="font-medium">{datas.title}</h2>
      <p className="text-sm text-gray-500">
        {datas.expireDate.toLocaleString("ko-KR")} 마감
      </p>
      <div
        id="circle"
        className="absolute w-1/3 h-1/3 top-1/2 left-[97%] rounded-full translate-y-[-50%] bg-zinc-100"
      />
    </div>
  );
};

export default Coupon;
