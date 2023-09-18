import { CartDataType } from "@/types";

type getPartialDeliveryArgs = {
  cartProducts: CartDataType[];
};

export default function getPartialDelivery({
  cartProducts,
}: getPartialDeliveryArgs) {
  const sorted = cartProducts
    .sort(
      (product1, product2) =>
        product1.product_delivery - product2.product_delivery
    )
    .map((product) => product.product_delivery);

  return sorted
    .filter((sort, idx) => sorted.indexOf(sort) === idx)
    .map((el) =>
      cartProducts.filter((product) => product.product_delivery === el)
    );
}
