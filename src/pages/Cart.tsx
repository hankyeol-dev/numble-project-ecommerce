import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

import { CartCard, Layout } from "@/components";
import { CartDataType, CouponDataType, UserDataType } from "@/types";
import { fetcher, getDeliveryDays, getPartialDelivery } from "@/utils";

type checkBoxType = {
  deliveryType: "partial" | "all";
};
type milageInputType = {
  mileage: number;
};

const Cart = () => {
  const { data: cartData } = useSWR<CartDataType[]>(
    `http://localhost:8080/cart`,
    fetcher,
    { refreshInterval: 100 }
  );
  const { data: userData } = useSWR<UserDataType>(
    `http://localhost:8080/user`,
    fetcher
  );

  const availableCouponPrice = cartData
    ? cartData
        .filter((data) => data.available_coupon !== false)
        .map((el) => el.product_price * el.product_quantity)
        .reduce((acc, cv) => acc + cv, 0)
    : 0;
  const basePrice = cartData
    ? cartData
        .map((data) => data.product_price * data.product_quantity)
        .reduce((acc, cv) => acc + cv, 0)
    : 0;

  const [couponDiscount, setCouponDiscount] = useState(0);
  const handleCouponDiscount = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const coupon = userData!.coupons.find(
      (coupon) => coupon.id === +event.currentTarget.value
    );
    switch (coupon?.type) {
      case "rate":
        setCouponDiscount(0);
        setCouponDiscount(
          (prev) =>
            prev +
            Math.floor(availableCouponPrice! * (coupon.discountRate! / 100))
        );
        return;
      case "amount":
      case "conditional_amount":
        setCouponDiscount(0);
        setCouponDiscount((prev) => prev + coupon.discountAmount!);
        return;
      default:
        setCouponDiscount(0);
        return;
    }
  };

  const { register, watch: cartWatch } = useForm<checkBoxType>({
    defaultValues: { deliveryType: "all" },
  });
  const { register: couponSelect } = useForm<Pick<CouponDataType, "id">>();
  const {
    register: mileageInput,
    formState: { errors: mileageErrors },
    watch: mileageWatch,
  } = useForm<milageInputType>({
    mode: "onChange",
  });

  return (
    <Layout headerText="장바구니" goBack>
      {cartData && cartData?.length !== 0 ? (
        <>
          <form
            id="form-delivery-type"
            className="w-full flex items-center justify-between gap-x-3 py-3 border-y border-y-gray-300 border-opacity-70 mb-5"
          >
            <label
              htmlFor="radio-all"
              className="w-1/2 flex items-center justify-around gap-x-1 px-1"
            >
              <input
                type="radio"
                id="radio-all"
                value="all"
                className="checkbox"
                {...register("deliveryType")}
              />
              <span>일괄 배송</span>
            </label>
            <label
              htmlFor="radio-partial"
              className="w-1/2 flex items-center justify-around gap-x-1 px-1 border-r border-r-gray-300"
            >
              <input
                type="radio"
                id="radio-partial"
                className="checkbox"
                value="partial"
                {...register("deliveryType")}
              />
              <span>개별 배송</span>
            </label>
          </form>
          {cartWatch("deliveryType") === "partial" ? (
            getPartialDelivery({ cartProducts: cartData }).map((el) => (
              <div className="w-full py-2 flex flex-col gap-y-2 border-b border-b-gray-500 border-opacity-50 mb-5">
                <p>
                  예상 배송일:{" "}
                  {getDeliveryDays({ deliveryDay: el[0].product_delivery })}
                </p>
                {el
                  .sort((item1, item2) => item1.product_no - item2.product_no)
                  .map((data) => (
                    <CartCard datas={data} key={data.id} />
                  ))}
              </div>
            ))
          ) : (
            <div className="w-full py-2 flex flex-col gap-y-2 border-b border-b-gray-500 border-opacity-50 mb-5">
              {cartData && (
                <p>
                  예상 배송일:{" "}
                  {getDeliveryDays({
                    deliveryDay: cartData.sort(
                      (item1, item2) =>
                        item1.product_delivery - item2.product_delivery
                    )[cartData.length - 1].product_delivery,
                  })}
                </p>
              )}
              {cartData
                .sort((item1, item2) => item1.product_no - item2.product_no)
                .map((data) => (
                  <CartCard datas={data} key={data.id} />
                ))}
            </div>
          )}
          <div className="w-full flex items-center justify-center py-3">
            <select
              className="select select-bordered w-full max-w-xs"
              {...couponSelect("id", { onChange: handleCouponDiscount })}
            >
              <option defaultChecked value="default">
                {availableCouponPrice
                  ? "쿠폰을 선택해주세요."
                  : "사용할 수 있는 쿠폰이 없습니다."}
              </option>
              {userData &&
                cartData &&
                availableCouponPrice &&
                userData.coupons
                  .filter((coupon) => new Date(coupon.expireDate) >= new Date())
                  .filter((el) => {
                    switch (el.type) {
                      case "rate":
                        return el;
                      case "amount":
                        return el;
                      case "conditional_amount":
                        return el.minOrderAmount! <= basePrice!;
                      default:
                    }
                  })
                  .map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.title}
                    </option>
                  ))}
            </select>
          </div>
          <div className="w-full flex flex-col items-end justify-center py-3 px-2">
            <input
              type="number"
              placeholder="상품의 5%까지 마일리지를 사용할 수 있습니다."
              className="input input-bordered w-full text-sm"
              {...mileageInput("mileage", {
                min: 0,
                max: basePrice
                  ? Math.floor(basePrice * 0.05) > 30000
                    ? 30000
                    : Math.floor(basePrice * 0.05)
                  : 0,
              })}
            />
            {mileageErrors.mileage && (
              <p className="text-xs text-red-500 mt-2 pr-1">
                사용 가능한 마일리지는{" "}
                {basePrice
                  ? Math.floor(basePrice * 0.05) > 30000
                    ? "30,000"
                    : Math.floor(basePrice * 0.05).toLocaleString("ko-KR")
                  : ""}{" "}
                포인트 입니다.
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2 pr-1">
              사용 가능한 마일리지 :{" "}
              {basePrice
                ? Math.floor(basePrice * 0.05) > 30000
                  ? "30,000"
                  : Math.floor(basePrice * 0.05).toLocaleString("ko-KR")
                : ""}
            </p>
          </div>
          <div
            id="cart-divider"
            className="w-full border-t border-t-gray-400 border-opacity-60 my-5"
          />
          <div
            id="cart-price-area"
            className="w-full flex flex-col items-end justify-around mb-5"
          >
            {basePrice && (
              <p className="text-lg text-slate-500 mb-2">
                <span className="text-xs text-gray-500">할인 전 금액: </span>
                {basePrice.toLocaleString("ko-KR")}{" "}
                <span className="text-xs text-gray-500">원</span>
              </p>
            )}
            <p className="text-xl text-slate-700">
              <span className="text-xs text-gray-500">최종 금액: </span>
              {basePrice &&
                (
                  basePrice -
                  (!mileageErrors.mileage
                    ? couponDiscount !== 0
                      ? +mileageWatch("mileage") + couponDiscount
                      : mileageWatch("mileage")
                    : couponDiscount !== 0
                    ? couponDiscount
                    : 0)
                ).toLocaleString("ko-KR")}
              <span className="text-xs text-gray-500"> 원</span>
            </p>
          </div>
        </>
      ) : (
        <div className="w-full h-[80%] py-5 px-3 flex flex-col gap-y-5 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-20 h-20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>

          <h2 className="text-5xl">텅</h2>
        </div>
      )}
    </Layout>
  );
};

export default Cart;
