import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { cartModalState } from "@/utils/atom/cart";
import { BottomSheetMenu } from "@/components";

const BottomSheet = () => {
  const [cartState, setCartState] = useRecoilState(cartModalState);

  const offBottomSheet = useCallback(() => {
    setCartState(() => ({
      isClicked: false,
      productNo: 0,
    }));
  }, [setCartState]);

  return (
    <div className="w-[375px] h-[812px] mx-auto fixed inset-0 bg-gray-500/50 z-50">
      <div className="w-full absolute bottom-0 left-0 h-fit p-5 bg-white rounded-t-lg opacity-100 drop-shadow-sm animate-[bottom-sheet-up_200ms_ease-in-out]">
        <BottomSheetMenu productNo={cartState.productNo} />
      </div>
      <button
        className="absolute bottom-[7.6rem] right-5"
        onClick={offBottomSheet}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default BottomSheet;
