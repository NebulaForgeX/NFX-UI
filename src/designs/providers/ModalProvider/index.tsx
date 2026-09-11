import type { ReactNode } from "react";

import Base from "./components/Base";
import Confirm from "./components/Confirm";
import Loading from "./components/Loading";

export interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider = ({ children }: ModalProviderProps) => {
  return (
    <>
      {children}
      <Base />
      <Confirm />
      <Loading />
    </>
  );
};

ModalProvider.displayName = "ModalProvider";
export default ModalProvider;
