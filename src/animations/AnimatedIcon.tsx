import type { ForwardRefExoticComponent, RefAttributes } from "react";

import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { useAnimatedIconTrigger } from "./useAnimatedIconTrigger";

export type AnimatedIconComponent = ForwardRefExoticComponent<AnimatedIconProps & RefAttributes<AnimatedIconHandle>>;

export type AnimatedIconViewProps = {
  icon: AnimatedIconComponent;
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  color?: string;
};

export function AnimatedIcon({ icon: Icon, size = 18, strokeWidth = 1.75, className, color = "currentColor" }: AnimatedIconViewProps) {
  const { iconRef, start, stop } = useAnimatedIconTrigger();
  return (
    <span className={className} style={{ display: "inline-flex", lineHeight: 0 }} onPointerEnter={start} onPointerLeave={stop}>
      <Icon ref={iconRef} size={size} strokeWidth={strokeWidth} color={color} />
    </span>
  );
}

export default AnimatedIcon;
