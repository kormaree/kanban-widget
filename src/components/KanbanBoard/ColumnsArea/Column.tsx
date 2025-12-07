import { Column as ColumnType } from "../../../types";

export const Column = ({ column }: { column: ColumnType }) => {
  return (
    <div className="column">
      <h3>{column.title}</h3>
    </div>
  );
};