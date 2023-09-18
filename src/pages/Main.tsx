import "../index.css";
import useSWR from "swr";

import { Layout, ProductCard } from "@/components";
import { fetcher } from "@/utils";
import { ProductDataType } from "@/types";

function Main() {
  const { data, isLoading } = useSWR<ProductDataType[]>(
    `http://localhost:8080/products`,
    fetcher
  );

  return (
    <Layout headerText="제품 목록">
      {isLoading ? (
        <div>로딩중</div>
      ) : (
        <div className="w-full grid grid-cols-2 gap-5 items-center justify-center">
          {data?.map((el) => (
            <ProductCard datas={el} key={el.product_no} />
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Main;
