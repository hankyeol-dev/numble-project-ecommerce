import { useCallback, useState } from "react";
import { useSetRecoilState } from "recoil";
import { cartModalState } from "@/utils/atom/cart";
import { CartDataType, ProductDataType } from "@/types";
import { fetcher } from "@/utils";
import useSWR from "swr";
import axios from "axios";

type BottomSheetMenuProps = {
  productNo: number;
};

const BottomSheetMenu = ({ productNo }: BottomSheetMenuProps) => {
  const { data: productData } = useSWR<ProductDataType[]>(
    `http://localhost:8080/products?product_no=${productNo}`,
    fetcher
  );

  const setCartModalState = useSetRecoilState(cartModalState);

  const [quantity, setQuantity] = useState(0);
  const [quantityError, setQuantityError] = useState(false);

  const handleQuantity = useCallback((type: "minus" | "plus") => {
    if (type === "minus") {
      setQuantity((old) => old - 1);
    } else {
      setQuantity((old) => old + 1);
    }
  }, []);

  const addToCart = async () => {
    const { data: cartData } = await axios.get<CartDataType[]>(
      "http://localhost:8080/cart"
    );

    if (cartData) {
      const cartQuantity = cartData
        .map((el) => el.product_quantity)
        .reduce((acc, cv) => acc + cv, 0);
      const totalQuantity = cartQuantity + quantity;
      if (totalQuantity > 10) {
        setQuantityError(true);
        setQuantity(10 - totalQuantity < 0 ? 0 : 10 - totalQuantity);
      } else {
        if (productData && quantity !== 0) {
          const {
            product_no,
            product_name,
            prev_delivery_times,
            available_coupon,
            price,
          } = productData[0];
          const deliveryTimes =
            prev_delivery_times.length !== 0 &&
            Math.ceil(
              prev_delivery_times.reduce((acc, cv) => acc + cv) /
                prev_delivery_times.length
            );
          await axios.post(`http://localhost:8080/cart`, {
            product_no,
            product_name,
            product_quantity: quantity,
            product_price: price * quantity,
            product_delivery: deliveryTimes,
            available_coupon,
          });
          setCartModalState(() => ({
            isClicked: false,
            productNo: 0,
          }));
        }
      }
    }
  };

  return (
    <>
      {productData && (
        <>
          <h3 className="font-bold text-lg mb-2">
            {productData[0].product_name}
          </h3>
          <p className="text-xl mb-5">
            {(productData[0].price * quantity).toLocaleString("ko-KR")}
            <span className="text-lg text-gray-500"> 원</span>
          </p>
        </>
      )}
      <div className="w-full flex items-center justify-center gap-x-2">
        <div className="w-1/2">
          <label htmlFor="Quantity" className="sr-only">
            {" "}
            Quantity{" "}
          </label>

          <div className="flex items-center justify-center border border-slate-300 rounded-sm h-10">
            <button
              disabled={quantity <= 0 ? true : false}
              type="button"
              className="w-1/3 h-10 leading-10 text-gray-600 transition hover:opacity-75"
              onClick={() => {
                handleQuantity("minus");
              }}
            >
              -
            </button>
            <input
              min={0}
              type="number"
              id="Quantity"
              value={quantity}
              className="h-10 w-1/3 border border-slate-300 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              className="w-1/3 h-10 leading-10 text-gray-600 transition hover:opacity-75"
              onClick={() => {
                handleQuantity("plus");
              }}
            >
              +
            </button>
          </div>
        </div>
        <button
          onClick={addToCart}
          type="submit"
          className="w-1/2 h-10 p-3 text-sm border border-slate-300 rounded-sm flex items-center justify-center hover:bg-slate-300 hover:duration-200"
          disabled={quantity <= 0 ? true : false}
        >
          장바구니 담기
        </button>
      </div>
      {quantityError && (
        <p className="text-sm text-left text-red-500">
          장바구니에는 10개의 상품만 담을 수 있습니다.
        </p>
      )}
    </>
  );
};

export default BottomSheetMenu;
