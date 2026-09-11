import type { ReactNode } from "react";

import { Box, Flex, Text } from "@radix-ui/themes";

import { useResolvedAppearance } from "@/hooks/preference";

import styles from "./styles.module.css";

export interface LogoProps {
  src?: string;
  srcDark?: string;
  alt?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  variant?: "plain" | "glassSquare" | "glassCircle";
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
}

function Logo({ src, srcDark, alt = "logo", title, subtitle, variant = "plain", size = "medium", className = "", onClick }: LogoProps) {
  const appearance = useResolvedAppearance();
  const logoClasses = [styles.logo, styles[variant], styles[size], className].filter(Boolean).join(" ");
  const imgSrc = appearance === "dark" && srcDark ? srcDark : src;

  return (
    <Flex asChild align="center" gap="3" width="fit-content">
      <button type="button" className={logoClasses} aria-label={typeof title === "string" ? title : alt} onClick={onClick}>
        {imgSrc ? (
          <Box asChild className={styles.mark}>
            <span>
              <img src={imgSrc} alt={alt} />
            </span>
          </Box>
        ) : null}

        {(title || subtitle) && (
          <Flex direction="column" gap="1" minWidth="0" overflow="hidden">
            {title && (
              <Text as="span" size="3" weight="bold" truncate color="gray" highContrast>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text as="span" size="1" weight="medium" truncate color="gray">
                {subtitle}
              </Text>
            )}
          </Flex>
        )}
      </button>
    </Flex>
  );
}

export default Logo;
