import type { Column as ColumnType } from "../../../types/column";

export const Column = ({ column }: { column: ColumnType }) => {
  return (
    <div className="column">
      <h3>{column.title}</h3>
    </div>
  );
};