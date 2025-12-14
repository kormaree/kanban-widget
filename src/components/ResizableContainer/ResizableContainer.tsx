import { Resizable } from "re-resizable";
import type { ReactNode } from "react";

interface ResizableContainerProps {
  children: ReactNode;
}

export const ResizableContainer = ({ children }: ResizableContainerProps) => {
  return (
    <Resizable
      defaultSize={{ width: 800, height: 500 }}
      minWidth={500}
      minHeight={300}
      style={{ border: "1px solid #ddd", background: "white" }}
    >
      {children}
    </Resizable>
  );
};