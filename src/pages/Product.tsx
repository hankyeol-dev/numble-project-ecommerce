import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";

import { Layout } from "@/components";
import { ProductDataType } from "@/types";
import { fetcher } from "@/utils";
import { cartModalState } from "@/utils/atom/cart";

const Product = () => {
  const { productno } = useParams();
  const { data: productData } = useSWR<ProductDataType[]>(
    `http://localhost:8080/products?product_no=${productno}`,
    fetcher
  );

  const setCartModalState = useSetRecoilState(cartModalState);
  const handleClick = useCallback(() => {
    if (productno) {
      setCartModalState({
        isClicked: true,
        productNo: +productno,
      });
    }
  }, [setCartModalState]);

  return (
    <Layout goBack headerText="제품">
      {productData &&
        productData.map((product) => {
          const {
            product_no,
            description,
            main_image_url,
            prev_delivery_times,
            price,
            product_name,
            maximum_quantity,
          } = product;

          const deliveryTimes =
            prev_delivery_times.length !== 0
              ? Math.ceil(
                  prev_delivery_times.reduce((acc, cv) => acc + cv) /
                    prev_delivery_times.length
                )
              : 2;

          return (
            <section
              id="product-detail-section"
              className="w-full flex flex-col items-start"
              key={product_no}
            >
              <img
                src={main_image_url}
                alt={product_name}
                className="w-[240px] h-[240px] object-cover mb-5"
              />
              <div
                id="divider"
                className="w-full border-t border-t-gray-300 border-opacity-80 mb-4"
              />
              <h2 className="text-xl font-medium">{product_name}</h2>
              <p className="text-sm text-gray-500 mb-3">{description}</p>
              <p className="text-xl font-medium mb-5">
                {price.toLocaleString("ko-KR")}{" "}
                <span className="text-base text-gray-700"> 원</span>
              </p>
              <div
                id="noted-box"
                className="w-full py-2 border-y border-y-gray-300 border-opacity-80 grid grid-flow-col grid-rows-2 gap-y-2 mb-4"
              >
                <div
                  id="noted-delivery"
                  className="w-full row-span-1 grid grid-cols-6"
                >
                  <p
                    id="noted-delivery-title"
                    className="col-span-2 text-sm text-gray-500"
                  >
                    예상 배송 소요일
                  </p>
                  <p className="col-span-1" />
                  <p
                    id="noted-delivery-data"
                    className="col-span-3 text-sm text-gray-700"
                  >
                    {deliveryTimes}일
                  </p>
                </div>
                <div
                  id="noted-max-quantity"
                  className="w-full row-span-1 grid grid-cols-6"
                >
                  <p
                    id="noted-max-quantity-title"
                    className="col-span-2 text-sm text-gray-500"
                  >
                    최대 구매 수량
                  </p>
                  <p className="col-span-1" />
                  <p
                    id="noted-max-quantity-data"
                    className="col-span-3 text-sm text-gray-700"
                  >
                    {maximum_quantity ? `${maximum_quantity}개` : "-"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClick}
                className="w-full text-base p-3 border border-slate-300 rounded-sm flex items-center justify-center hover:bg-slate-300 hover:duration-200"
              >
                장바구니 담기
              </button>
            </section>
          );
        })}
    </Layout>
  );
};

export default Product;
