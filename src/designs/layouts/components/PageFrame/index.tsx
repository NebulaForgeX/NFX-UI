import type { ReactNode } from "react";

import { Container, Flex } from "@radix-ui/themes";

import styles from "./s.module.css";

const PAGE_FRAME_DEFAULT_MAX_WIDTH_PX = 1440;

export type PageFrameProps = {
  children: ReactNode;
  className?: string;
  maxWidth?: number | string;
  fullHeight?: boolean;
};

function PageFrame({ children, className, maxWidth = PAGE_FRAME_DEFAULT_MAX_WIDTH_PX, fullHeight }: PageFrameProps) {
  const resolvedMaxWidth = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
  const frameClass = [fullHeight ? styles.fullHeightFrame : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <Container size="4" align="center" py={fullHeight ? "0" : "5"} width="100%" maxWidth={resolvedMaxWidth} className={frameClass || undefined}>
      {fullHeight ? (
        <Flex direction="column" flexGrow="1" minHeight="0" width="100%" height="100%" className={styles.fullHeightBody}>
          {children}
        </Flex>
      ) : (
        children
      )}
    </Container>
  );
}

export default PageFrame;
