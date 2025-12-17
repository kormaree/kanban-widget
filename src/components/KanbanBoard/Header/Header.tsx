export const Header = () => {
  return (
    <header style={{
        height: 32,
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        cursor: "grab",
        userSelect: "none",
        background: "#f3f4f6",
      }} className="drag-handle">
      <h2 style={{ fontSize: 14 }}>Kanban Board</h2>
    </header>
  );
};