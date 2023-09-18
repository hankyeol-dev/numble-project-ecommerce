import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { ProductDataType } from "@/types";
import { cartModalState } from "@/utils/atom/cart";

type ProductCardProps = {
  datas: ProductDataType;
};

const ProductCard = ({ datas }: ProductCardProps) => {
  const { product_name, product_no, description, main_image_url, price } =
    datas;

  const setCartModalState = useSetRecoilState(cartModalState);

  const addToCart = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setCartModalState(() => ({
        isClicked: true,
        productNo: Number(e.currentTarget.dataset.productno),
      }));
    },
    [setCartModalState]
  );

  return (
    <div className="w-full p-2 flex flex-col items-center bg-white hover:scale-105 hover:ease-linear hover:transition hover:duration-150">
      <Link
        to={`/product/${product_no}`}
        className="flex flex-col items-start gap-y-1 mb-3"
      >
        {main_image_url && (
          <img
            src={main_image_url}
            alt={product_name}
            className="w-full object-cover mb-1"
          />
        )}
        <h3 className="line-clamp-1 font-medium">{product_name}</h3>
        <p className="text-xs line-clamp-1 text-gray-400">{description}</p>
        <p className="mt-2">{price.toLocaleString("ko-KR")} 원</p>
      </Link>
      <button
        data-productno={product_no}
        onClick={addToCart}
        className="w-full p-2 text-xs text-gray-600 border border-gray-500 hover:bg-gray-500 hover:text-white hover:transition hover:duration-200"
      >
        장바구니 담기
      </button>
    </div>
  );
};

export default ProductCard;
