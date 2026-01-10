import React, { useEffect, useState } from "react";
import {
    getBoardStatsSummary,
    getBoardTimeByUser,
    getBoardCompletedByUser,
} from "../../../api/stats";
import {
    type BoardStatsSummary,
    type BoardTimeByUser,
    type BoardCompletedByUser,
} from "../../../types/stats";
import { getInitials } from "../ColumnsArea/TaskCard";

interface StatsViewProps {
    boardId: string;
}

export const StatsView: React.FC<StatsViewProps> = ({ boardId }) => {
    const [summary, setSummary] = useState<BoardStatsSummary | null>(null);
    const [timeByUser, setTimeByUser] = useState<BoardTimeByUser[] | null>(null);
    const [completedByUser, setCompletedByUser] =
        useState<BoardCompletedByUser[] | null>(null);

    useEffect(() => {
        getBoardStatsSummary(boardId).then((response) => {
            setSummary(response.data);
        });
        getBoardTimeByUser(boardId).then((response) => {
            setTimeByUser(response.data);
        });
        getBoardCompletedByUser(boardId).then((response) => {
            setCompletedByUser(response.data);
        });
    }, [boardId]);

    const wrapperStyle: React.CSSProperties = {
        padding: "55px 24px 55px",
        maxWidth: 1600,
        margin: "0 auto",
        boxSizing: "border-box",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
    };

    const containerStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "358px 773px 404px",
        gridTemplateRows: "178px 265px 265px",
        gap: 15,
        alignItems: "stretch",
        justifyContent: "center",
    };

    const metricsStyle: React.CSSProperties = {
        color: "#3789D5",
        fontSize: 16,
        fontWeight: 600,
        marginLeft: 14,
    }

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
        fontWeight: 600,
        color: "#000",
        marginBottom: 12,
    };

    return (
        <div style={wrapperStyle}>
            <div style={containerStyle}>
                <div style={{ ...blockBaseStyle, gridColumn: 1, gridRow: 1 }}>
                    {summary ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 13,
                                color: 'rgba(0, 0, 0, 0.5)',
                                fontSize: 18,
                                fontWeight: 600
                            }}>
                            <div>
                                Выполнено:
                                <span style={metricsStyle}>
                                    {summary.completed}/{summary.total}
                                </span>
                            </div>
                            <div>
                                Просрочено:
                                <span style={metricsStyle}>
                                    {summary.overdue}
                                </span>
                            </div>
                            <div>
                                В работе:
                                <span style={metricsStyle}>
                                    {summary.in_progress}
                                </span>
                            </div>
                            <div>
                                Открыто:
                                <span style={metricsStyle}>
                                    {summary.not_started}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div>Загрузка...</div>
                    )}
                </div>
                <div style={{ ...blockBaseStyle, gridColumn: 1, gridRow: 2 }}>
                    <div style={{
                        ...titleStyle,
                        marginBottom: 34,
                    }}>Время выполнения задач</div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 16 }}>
                        {timeByUser ? (
                            timeByUser.map((item) => (
                                <div
                                    key={item.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div
                                            title={item.name}
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: "50%",
                                                backgroundColor: "#ADADAD",
                                                color: "#FFFFFF",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 12,
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {getInitials(item.name)}
                                        </div>

                                        <div style={{ lineHeight: "20px" }}>{item.name}</div>
                                    </div>

                                    <div style={metricsStyle}>{Number(item.hours).toFixed(1)} ч.</div>
                                </div>
                            ))
                        ) : (
                            <div>Загрузка...</div>
                        )}
                    </div>
                </div>
                <div style={{ ...blockBaseStyle, gridColumn: 1, gridRow: 3 }}>
                    <div
                        style={{
                            ...titleStyle,
                            marginBottom: 34,
                        }}
                    >
                        Выполненные задачи
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 16 }}>
                        {completedByUser ? (
                            completedByUser.map((item) => (
                                <div
                                    key={item.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div
                                            title={item.name}
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: "50%",
                                                backgroundColor: "#ADADAD",
                                                color: "#FFFFFF",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 12,
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {getInitials(item.name)}
                                        </div>

                                        <div style={{ lineHeight: "20px" }}>{item.name}</div>
                                    </div>

                                    <div style={metricsStyle}>{item.completed}</div>
                                </div>
                            ))
                        ) : (
                            <div>Загрузка...</div>
                        )}
                    </div>
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