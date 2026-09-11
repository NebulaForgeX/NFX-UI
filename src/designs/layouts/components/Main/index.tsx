import type { CSSProperties, ReactNode } from "react";

import { Box } from "@radix-ui/themes";
import { useLayoutStore } from "@/stores/layout";

import Header from "../Header";

export type MainProps = {
  children?: ReactNode;
  header?: ReactNode;
};

function Main({ children, header }: MainProps) {
  const headerHeight = useLayoutStore((state) => state.headerHeight);

  return (
    <Box position="relative" minHeight="100dvh" style={{ background: "var(--color-background)" }}>
      {header ?? <Header />}
      <Box
        asChild
        position="relative"
        minHeight="100dvh"
        style={
          {
            paddingTop: 0,
            "--app-header-height": `${headerHeight}px`,
          } as CSSProperties
        }
      >
        <main>{children}</main>
      </Box>
    </Box>
  );
}

export default Main;
