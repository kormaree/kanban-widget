import React, { useEffect, useState } from "react";
import {
    getBoardStatsSummary,
    getBoardTimeByUser,
    getBoardCompletedByUser,
    getBoardPriorities,
} from "../../../api/stats";
import {
    type BoardStatsSummary,
    type BoardTimeByUser,
    type BoardCompletedByUser,
    type BoardPriorities,
} from "../../../types/stats";
import { getInitials } from "../ColumnsArea/TaskCard";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatsViewProps {
    boardId: string;
}

export const StatsView: React.FC<StatsViewProps> = ({ boardId }) => {
    const [summary, setSummary] = useState<BoardStatsSummary | null>(null);
    const [timeByUser, setTimeByUser] = useState<BoardTimeByUser[] | null>(null);
    const [completedByUser, setCompletedByUser] =
        useState<BoardCompletedByUser[] | null>(null);
    const [priorities, setPriorities] =
        useState<BoardPriorities | null>(null);

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
        getBoardPriorities(boardId).then((response) => {
            setPriorities(response.data);
        });
    }, [boardId]);

    const filteredPriorities = priorities
        ? priorities.filter((p) => p.priority !== "undefined")
        : null;

    const PRIORITY_META: Array<{
        key: "high" | "medium" | "low";
        label: string;
        color: string;
    }> = [
            { key: "high", label: "высокий", color: "#F79661" },
            { key: "medium", label: "средний", color: "#F9CDA3" },
            { key: "low", label: "низкий", color: "#2B4DEC" },
        ];

    const prioritiesByKey = filteredPriorities
        ? Object.fromEntries(filteredPriorities.map((p) => [p.priority, p]))
        : null;

    const prioritiesChartData = filteredPriorities
        ? {
            labels: PRIORITY_META.map((m) => m.key),
            datasets: [
                {
                    data: PRIORITY_META.map((m) => prioritiesByKey?.[m.key]?.total ?? 0),
                    backgroundColor: PRIORITY_META.map((m) => m.color),
                    borderWidth: 0,
                },
            ],
        }
        : null;

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

                        {prioritiesChartData && prioritiesByKey ? (
                            <div
                                style={{
                                    display: "flex",
                                    height: "100%",
                                    paddingTop: 8,
                                    paddingBottom: 20,
                                    alignItems: "flex-end",
                                }}
                            >
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {PRIORITY_META.map((m) => {
                                        const total = prioritiesByKey[m.key]?.total ?? 0;
                                        return (
                                            <div
                                                key={m.key}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: 14,
                                                    fontSize: 14,
                                                    fontWeight: 500
                                                }}
                                            >
                                                <div style={{
                                                    display: "flex"
                                                }}>
                                                    <div
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            borderRadius: "50%",
                                                            backgroundColor: m.color,
                                                            marginRight: 10
                                                        }}
                                                    />
                                                    <div style={{ color: "rgba(0,0,0,0.5)"}}>
                                                        {m.label}
                                                    </div>
                                                </div>
                                                <div style={{ color: "#000"}}>
                                                    {total} з.
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "flex-end",
                                        justifyContent: "center",
                                        height: "100%",
                                    }}
                                >
                                    <div style={{ width: 210, height: 210 }}>
                                        <Doughnut
                                            data={prioritiesChartData}
                                            options={{
                                              responsive: true,
                                              maintainAspectRatio: false,
                                              plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                  callbacks: {
                                                    label: (ctx) => {
                                                      const key = String(ctx.label) as "high" | "medium" | "low";
                                                      const meta = PRIORITY_META.find((x) => x.key === key);

                                                      const value = typeof ctx.parsed === "number" ? ctx.parsed : 0;

                                                      const totalAll = PRIORITY_META.reduce((sum, m) => {
                                                        return sum + (prioritiesByKey?.[m.key]?.total ?? 0);
                                                      }, 0);

                                                      const percent =
                                                        totalAll > 0 ? Math.round((value / totalAll) * 100) : 0;

                                                      return `${meta?.label}: (${percent}%)`;
                                                    },
                                                    title: () => "",
                                                  },
                                                },
                                              },
                                              cutout: "55%",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>Загрузка...</div>
                        )}
                    </div>

                    <div style={{ ...blockBaseStyle, flex: 1 }}>
                        <div style={titleStyle}>Нагрузка по исполнителям</div>
                    </div>
                </div>
            </div>
        </div>
    );
};