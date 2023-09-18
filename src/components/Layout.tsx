import { BottomSheet, Header } from "@/components";
import { cartModalState } from "@/utils/atom/cart";
import { useRecoilValue } from "recoil";

type LayoutProps = {
  children: React.ReactNode;
  headerText?: string;
  goBack?: boolean;
};

const Layout = ({ children, headerText, goBack }: LayoutProps) => {
  const { isClicked } = useRecoilValue(cartModalState);

  return (
    <div className="w-full h-[812px] flex items-center justify-center my-auto">
      <main className="w-[375px] h-[812px] bg-zinc-100 overflow-scroll">
        <Header headerText={headerText} goBack={goBack} />
        <div className="w-full h-full px-5">{children}</div>
        {isClicked && <BottomSheet />}
      </main>
    </div>
  );
};

export default Layout;
