import { atom } from "recoil";

export type cartModalStateType = {
  isClicked: boolean;
  productNo: number;
};

export const cartModalState = atom<cartModalStateType>({
  key: "cartModalState",
  default: { isClicked: false, productNo: 0 },
});
