import type { FooterProps } from "../../types";

import { memo } from "react";

import styles from "./styles.module.css";

export const DefaultFooterContent = memo(() => {
  const currentYear = new Date().getFullYear();
  return (
    <div className={styles.footerContent}>
      <span className={styles.copyright}>© {currentYear}</span>
      <div className={styles.links}>
        <a href="#" className={styles.link}>
          About Us
        </a>
        <a href="#" className={styles.link}>
          Privacy Policy
        </a>
        <a href="#" className={styles.link}>
          Terms of Service
        </a>
      </div>
    </div>
  );
});
DefaultFooterContent.displayName = "DefaultFooterContent";

/** 通用 Footer：只负责布局与样式，内容由外部传入。 */
const Footer = memo(({ children, className }: FooterProps) => {
  return <div className={`${styles.footer} ${className || ""}`}>{children ?? <DefaultFooterContent />}</div>;
});

Footer.displayName = "Footer";

export default Footer;
