import { useCallback } from "react";
import { CartDataType, ProductDataType } from "@/types";
import { fetcher } from "@/utils";
import axios from "axios";
import useSWR from "swr";

type CartCardProps = {
  datas: CartDataType;
};

const CartCard = ({ datas }: CartCardProps) => {
  const { product_no, product_quantity, id, product_price, available_coupon } =
    datas;
  const { data: productData } = useSWR<ProductDataType[]>(
    `http://localhost:8080/products?product_no=${product_no}`,
    fetcher
  );

  const deleteFromCart = useCallback(async () => {
    await axios.delete(`http://localhost:8080/cart/${id}`);
  }, [id]);

  return productData ? (
    <>
      {productData.map((product) => (
        <div
          key={product.product_no}
          className="w-full flex gap-x-4 items-center justify-between p-3 relative"
        >
          <img
            src={product.main_image_url}
            alt={product.product_name}
            className="w-1/5 object-cover"
          />
          <div className="w-4/5 flex flex-col items-start">
            <h2 className="text-sm">{product.product_name}</h2>
            <p className="flex items-center text-xs">
              <span className="text-sm text-gray-400 mr-1">수량: </span>
              {product_quantity}개
            </p>
            <p className="text-sm">
              {(product_quantity * product_price).toLocaleString("ko-KR")}원
            </p>
          </div>
          {available_coupon !== false && (
            <div className="absolute top-3 right-8 text-xs badge badge-accent badge-outline">
              쿠폰
            </div>
          )}
          <button className="absolute top-3 right-3" onClick={deleteFromCart}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      ))}
    </>
  ) : (
    <div className="w-full py-5 px-3 flex items-center justify-center text-lg">
      장바구니가 비었습니다.
    </div>
  );
};

export default CartCard;
