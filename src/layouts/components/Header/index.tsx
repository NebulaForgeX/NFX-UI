import type { HeaderProps } from "../../types";

import { memo } from "react";

import styles from "./styles.module.css";

/** 通用 Header：只负责布局左右两栏，内容全部由外部传入，内部不获取数据。Generic header: layout only; all content from props. */
const Header = memo(({ leftContent, rightContent }: HeaderProps) => {
  return (
    <div className={styles.header}>
      <div>{leftContent}</div>
      <div>{rightContent}</div>
    </div>
  );
});

Header.displayName = "Header";
export default Header;
