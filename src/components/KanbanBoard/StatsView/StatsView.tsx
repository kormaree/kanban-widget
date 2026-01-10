import React from "react";

export const StatsView = () => {
    const wrapperStyle: React.CSSProperties = {
        padding: "55px 24px 55px",
        maxWidth: 1600,
        margin: "0 auto",
        boxSizing: "border-box",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
    };

    const containerStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "358px 773px 404px",
        gridTemplateRows: "178px 265px 265px",
        gap: 15,
        alignItems: "stretch",
        justifyContent: "center",
    };

    const blockBaseStyle: React.CSSProperties = {
        background: "#fff",
        borderRadius: 10,
        padding: 24,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    };

    const titleStyle: React.CSSProperties = {
        fontSize: 20,
        fontWeight: 500,
        color: "#000",
        marginBottom: 12,
    };

    return (
        <div style={wrapperStyle}>
            <div style={containerStyle}>
                <div style={{ ...blockBaseStyle, gridColumn: 1, gridRow: 1 }}>
                    <div style={titleStyle}>Summary</div>
                </div>
                <div style={{ ...blockBaseStyle, gridColumn: 1, gridRow: 2 }}>
                    <div style={titleStyle}>Время выполнения задач</div>
                </div>
                <div style={{ ...blockBaseStyle, gridColumn: 1, gridRow: 3 }}>
                    <div style={titleStyle}>Выполненные задачи</div>
                </div>
                <div style={{ ...blockBaseStyle, gridColumn: 2, gridRow: "1 / 4" }}>
                    <div style={titleStyle}>График производительности</div>
                </div>
                <div
                    style={{
                        gridColumn: 3,
                        gridRow: "1 / 4",
                        display: "flex",
                        flexDirection: "column",
                        gap: 15,
                    }}
                >
                    <div style={{ ...blockBaseStyle, flex: 1 }}>
                        <div style={titleStyle}>Разделение по приоритетам</div>
                    </div>

                    <div style={{ ...blockBaseStyle, flex: 1 }}>
                        <div style={titleStyle}>Нагрузка по исполнителям</div>
                    </div>
                </div>
            </div>
        </div>
    );
};