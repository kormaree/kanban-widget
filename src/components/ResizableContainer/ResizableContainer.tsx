import { Resizable } from "re-resizable";

export const ResizableContainer = ({ children }) => {
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