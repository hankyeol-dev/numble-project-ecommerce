import { useParams } from "react-router-dom";
import useSWR from "swr";

import { Coupon, Layout } from "@/components";
import { UserDataType } from "@/types";
import { fetcher } from "@/utils";

const Profile = () => {
  const { userId } = useParams();
  const { data: userData } = useSWR<UserDataType>(
    userId ? `http://localhost:8080/user` : null,
    fetcher
  );

  return (
    <Layout headerText="마이페이지" goBack>
      {userData && (
        <div id="user-info" className="w-full flex flex-col">
          <h2 className="text-lg font-medium mb-5">{userData?.nickname} 님</h2>
          <div className="w-full flex items-center justify-between border-t border-t-slate-300 py-2">
            <p className="text-sm">적립금</p>
            <p className="font-medium">
              {userData?.mileage.toLocaleString("kr-KR")}
            </p>
          </div>
          <div className="w-full flex items-center justify-between border-t border-t-slate-300 py-2">
            <p className="text-sm">쿠폰</p>
            <p className="pr-[2px]">
              <span className="font-medium text-blue-700 pr-[2px]">
                {
                  userData?.coupons.filter(
                    (coupon) => new Date(coupon.expireDate) > new Date()
                  ).length
                }
              </span>
              개
            </p>
          </div>
          {userData?.coupons &&
            userData.coupons
              .filter((coupon) => new Date(coupon.expireDate) > new Date())
              .map((coupon, i) => <Coupon datas={coupon} key={i} />)}
        </div>
      )}
    </Layout>
  );
};

export default Profile;
