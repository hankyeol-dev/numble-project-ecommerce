export interface ProductDataType {
  product_no: number;
  product_name: string;
  main_image_url: string;
  price: number;
  prev_delivery_times: number[];
  description: string;
  available_coupon?: boolean;
  maximum_quantity?: number;
}

export interface CouponDataType {
  id: number;
  type: "default" | "rate" | "amount" | "conditional_amount";
  title: string;
  discountRate?: number;
  discountAmount?: number;
  minOrderAmount?: number;
  expireDate: Date;
}

export interface UserDataType {
  uuid: number;
  name: string;
  nickname: string;
  coupons: [] | CouponDataType[];
  mileage: number;
}

export interface CartDataType {
  id: number;
  product_no: number;
  product_name: string;
  product_quantity: number;
  product_price: number;
  product_delivery: number;
  available_coupon?: boolean;
}
