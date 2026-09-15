import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

/**
 * Structural Lucide icon. Host consoles may resolve a different lucide-react copy
 * than nfx-ui; do not require type-identity with lucide-react's LucideIcon.
 */
export type LucideIconComponent = ComponentType<{
  size?: string | number;
  color?: string;
  className?: string;
  strokeWidth?: string | number;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export type LucideIconProps = LucideProps & {
  icon: LucideIconComponent;
};

/** Lucide wrapper: inherits parent `color` via currentColor. Use for hero, cards, sidebar nav (18px+). */
function LucideIcon({ icon: Icon, color = "currentColor", strokeWidth = 2, "aria-hidden": ariaHidden = true, ...props }: LucideIconProps) {
  const Render = Icon as ComponentType<LucideProps>;
  return <Render color={color} strokeWidth={strokeWidth} aria-hidden={ariaHidden} {...props} />;
}

LucideIcon.displayName = "LucideIcon";
export default LucideIcon;
