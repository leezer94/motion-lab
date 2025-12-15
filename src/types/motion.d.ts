/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "motion/react" {
  import type { ComponentProps, ReactNode } from "react";

  export interface MotionProps extends ComponentProps<"div"> {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
    whileFocus?: any;
    whileInView?: any;
    layout?: boolean | "position" | "size" | "preserve-aspect";
    [key: string]: any;
  }

  export interface AnimatePresenceProps {
    children?: ReactNode;
    initial?: boolean;
    mode?: "sync" | "wait" | "popLayout";
    onExitComplete?: () => void;
    [key: string]: any;
  }

  export const motion: {
    div: React.ComponentType<MotionProps>;
    span: React.ComponentType<MotionProps>;
    button: React.ComponentType<MotionProps>;
    [key: string]: React.ComponentType<MotionProps>;
  };

  export const AnimatePresence: React.ComponentType<AnimatePresenceProps>;
}
