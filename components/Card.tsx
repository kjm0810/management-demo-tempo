import type { CSSProperties, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  /** number = 다른 Card들과의 상대적 비율(flex-grow), string = 고정 가로 크기(e.g. "300px") */
  width?: number | string;
  className?: string;
};

export default function Card({ children, width = 1, className = "" }: CardProps) {
  const style: CSSProperties =
    typeof width === "number"
      ? { flexGrow: width, flexBasis: 0, minWidth: 0 }
      : { flexBasis: width, flexGrow: 0, flexShrink: 0 };

  return (
    <div
      style={style}
      className={`flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#141a2b] p-5 ${className}`}
    >
      {children}
    </div>
  );
}
