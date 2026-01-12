import React, { useEffect, useState, useMemo, useRef } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import {
    getBoardStatsSummary,
    getBoardTimeByUser,
    getBoardCompletedByUser,
    getBoardPriorities,
    getBoardWorkload,
    getBoardProductivityTimeline
} from "../../../api/stats";
import {
    type BoardStatsSummary,
    type BoardTimeByUser,
    type BoardCompletedByUser,
    type BoardPriorities,
    type BoardWorkload
} from "../../../types/stats";
import { getInitials } from "../ColumnsArea/TaskCard";
import { Doughnut, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
    TimeScale,
} from "chart.js";

import "chartjs-adapter-date-fns";
import calendarIcon from "./Icon/calendar.svg?url";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
    TimeScale
);


interface StatsViewProps {
    boardId: string;
}

export const StatsView: React.FC<StatsViewProps> = ({ boardId }) => {
    const [calendarOpen, setCalendarOpen] = useState(false);
    const calendarRef = useRef<HTMLDivElement | null>(null);
    const calendarToggleRef = useRef<HTMLButtonElement | null>(null);

    const [range, setRange] = useState<DateRange>({
      from: subDays(new Date(), 14),
      to: new Date(),
    });
    const [activePreset, setActivePreset] = useState<
      "30d" | "week" | "90d" | "all" | null
    >(null);
    const [month, setMonth] = useState<Date>(range.from ?? new Date());

    const handleRangeSelect = (next: DateRange | undefined) => {
      if (!next) return;

      if (next.from && !next.to) {
        setRange({ from: next.from, to: undefined });
        setMonth(next.from);
        return;
      }

      if (next.from && next.to) {
        setRange(next);
        setMonth(next.to);
      }
    };

    const productivityParams = useMemo(() => ({
      date_from: range.from.toISOString().slice(0, 10),
      date_to: range.to.toISOString().slice(0, 10),
      step: "day" as const,
    }), [range]);
    const [summary, setSummary] = useState<BoardStatsSummary | null>(null);
    const [timeByUser, setTimeByUser] = useState<BoardTimeByUser[] | null>(null);
    const [completedByUser, setCompletedByUser] =
        useState<BoardCompletedByUser[] | null>(null);
    const [priorities, setPriorities] =
        useState<BoardPriorities | null>(null);
    const [workload, setWorkload] = useState<
      BoardWorkload[] | null
    >(null);
    const [productivity, setProductivity] = useState<
      {
        date: string;
        completed_ratio: number;
        active_ratio: number;
      }[] | null
    >(null);
    const workloadPrepared = useMemo(() => {
      if (!workload) return [];
      return workload
        .map((u) => ({
          ...u,
          percent: Math.round(u.workload_ratio * 100),
        }))
        .sort((a, b) => b.percent - a.percent);
    }, [workload]);

    const USE_PRODUCTIVITY_MOCK = false;

    const MOCK_PRODUCTIVITY = [
        { date: "2025-10-28", completed_ratio: 0.19, active_ratio: 0.49 },
        { date: "2025-10-31", completed_ratio: 0.27, active_ratio: 0.55 },
        { date: "2025-11-03", completed_ratio: 0.22, active_ratio: 0.64 },
        { date: "2025-11-06", completed_ratio: 0.33, active_ratio: 0.58 },
        { date: "2025-11-09", completed_ratio: 0.27, active_ratio: 0.46 },
        { date: "2025-11-12", completed_ratio: 0.35, active_ratio: 0.52 },
        { date: "2025-11-15", completed_ratio: 0.45, active_ratio: 0.44 },
        { date: "2025-11-18", completed_ratio: 0.58, active_ratio: 0.41 },
        { date: "2025-11-21", completed_ratio: 0.49, active_ratio: 0.42 },
        { date: "2025-11-24", completed_ratio: 0.46, active_ratio: 0.39 },
        { date: "2025-11-27", completed_ratio: 0.32, active_ratio: 0.35 },
    ];

    const applyPreset = (preset: "30d" | "week" | "90d" | "all") => {
      if (activePreset === preset) {
        setActivePreset(null);
        return;
      }

      const to = new Date();
      const from = new Date();

      switch (preset) {
        case "30d":
          from.setDate(to.getDate() - 30);
          break;
        case "90d":
          from.setDate(to.getDate() - 90);
          break;
        case "week": {
          const day = to.getDay() || 7;
          from.setDate(to.getDate() - day + 1);
          break;
        }
        case "all":
          from.setFullYear(2025);
          break;
      }

      setRange({ from, to });
      setActivePreset(preset);
    };

    useEffect(() => {
      if (!calendarOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        const targetNode = e.target as Node;

        if (calendarToggleRef.current?.contains(targetNode)) {
          return;
        }

        if (
          calendarRef.current &&
          !calendarRef.current.contains(targetNode)
        ) {
          setCalendarOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [calendarOpen]);

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
        getBoardWorkload(boardId).then((response) => {
            setWorkload(response.data);
        });
        if (USE_PRODUCTIVITY_MOCK) {
            setProductivity(MOCK_PRODUCTIVITY);
        } else {
            getBoardProductivityTimeline(boardId, productivityParams).then((response) => {
                setProductivity(response.data);
            });
        }
    }, [boardId, productivityParams]);

    const filteredPriorities = priorities
        ? priorities.filter((p) => p.priority && p.priority !== "undefined")
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
                        <div
                          style={{
                            width: "100%",
                            height: 24,
                            background: "#EEF1F6",
                            borderRadius: 6,
                          }}
                        />
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
                            <div
                              style={{
                                width: "100%",
                                height: 24,
                                background: "#EEF1F6",
                                borderRadius: 6,
                              }}
                            />
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
                            <div
                              style={{
                                width: "100%",
                                height: 24,
                                background: "#EEF1F6",
                                borderRadius: 6,
                              }}
                            />
                        )}
                    </div>
                </div>
                <div style={{ ...blockBaseStyle, gridColumn: 2, gridRow: "1 / 4", padding: '28px 58px' }}>
                    <div style={{ ...titleStyle, marginBottom: 23 }}>График производительности</div>
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "rgba(0, 0, 0, 0.5)",
                            maxWidth: 520,
                            lineHeight: "20px",
                            marginBottom: 4
                        }}
                    >
                        Графики показывают, какая часть от общего числа задач уже выполнена, а какая — находится в работе
                    </div>
                    {productivity ? (
                      <div style={{ height: 520, minHeight: 360, marginTop: 4, paddingBottom: 12 }}>
                        <Line
                          data={{
                            datasets: [
                              {
                                label: "выполненные",
                                data: productivity.map(p => ({
                                  x: p.date,
                                  y: p.completed_ratio,
                                })),
                                borderColor: "#314CFF",
                                borderWidth: 4,
                                backgroundColor: (context) => {
                                  const { ctx, chartArea } = context.chart;
                                  if (!chartArea) return "rgba(43, 77, 236, 0.3)";
                                  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                  gradient.addColorStop(0, "#3549F8");
                                  gradient.addColorStop(1, "rgba(43, 77, 236, 0)");
                                  return gradient;
                                },
                                fill: true,
                                tension: 0.3,
                                pointRadius: 0,
                              },
                              {
                                label: "в процессе",
                                data: productivity.map(p => ({
                                  x: p.date,
                                  y: p.active_ratio,
                                })),
                                borderColor: "#FF7E5C",
                                borderWidth: 4,
                                backgroundColor: (context) => {
                                  const { ctx, chartArea } = context.chart;
                                  if (!chartArea) return "rgba(247, 150, 97, 0.3)";
                                  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                  gradient.addColorStop(0, "#FF7E5C");
                                  gradient.addColorStop(1, "rgba(217, 217, 217, 0)");
                                  return gradient;
                                },
                                fill: true,
                                tension: 0.3,
                                pointRadius: 0,
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            layout: {
                              padding: {
                                top: 12,
                              },
                            },
                            interaction: {
                              intersect: false,
                              mode: "index",
                            },
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                callbacks: {
                                  label: (ctx) =>
                                    `${ctx.dataset.label}: ${Math.round(
                                      Number(ctx.parsed.y) * 100
                                    )}%`,
                                },
                              },
                            },
                            scales: {
                              x: {
                                type: "time",
                                time: {
                                  unit: "day",
                                  displayFormats: {
                                    day: "dd.MM.yy",
                                  },
                                  tooltipFormat: "dd.MM.yy",
                                },
                                grid: {
                                  display: false,
                                },
                                ticks: {
                                    autoSkip: true,
                                    maxTicksLimit: 7,
                                    maxRotation: 0,
                                    minRotation: 0,
                                    padding: 8,
                                    color: '#000',
                                    font: {
                                        size: 11
                                    }
                                }
                              },
                              y: {
                                min: 0,
                                max: 1.05,
                                grace: "10%",
                                ticks: {
                                  stepSize: 0.1,
                                  padding: 8,
                                  callback: (v) => Number(v).toFixed(1),
                                  color: '#000',
                                    font: {
                                        size: 11
                                    }
                                },
                              },
                            },
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 15,
                            padding: '0px 40px'
                          }}
                        >
                          <div style={{ display: "flex", gap: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                              <div
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  backgroundColor: "#3549F8",
                                }}
                              />
                              <span style={{ fontSize: 12, color: "rgba(0,0,0,0.5)" }}>
                                выполненные
                              </span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                              <div
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  backgroundColor: "#FF7E5C",
                                }}
                              />
                              <span style={{ fontSize: 12, color: "rgba(0,0,0,0.5)" }}>
                                в процессе
                              </span>
                            </div>
                          </div>

                          <div style={{ position: "relative" }}>
                            <button
                              ref={calendarToggleRef}
                              onClick={() => setCalendarOpen(v => !v)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#3789D5",
                                fontSize: 16,
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: 0,
                                marginTop: 7
                              }}
                            >
                              редактировать даты
                              <span style={{ fontSize: 18 }}>
                                <img
                                  src={calendarIcon}
                                  alt="calendar"
                                  style={{ display: "block" }}
                                />
                              </span>
                            </button>
                            {calendarOpen && (
                              <div
                                ref={calendarRef}
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  bottom: "100%",
                                  marginBottom: 12,
                                  background: "#fff",
                                  borderRadius: 20,
                                  padding: 24,
                                  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                                  zIndex: 20,
                                  boxSizing: "border-box",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 36,
                                    paddingBottom: 12,
                                    borderBottom: "1px solid #E3E5EF",
                                    marginLeft: -24,
                                    marginRight: -24,
                                    paddingLeft: 24,
                                    paddingRight: 24,
                                    fontWeight: 600
                                  }}
                                >
                                  Календарь
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: 16,
                                      fontWeight: 700,
                                      color: "#3789D5",
                                      marginLeft: 16
                                    }}
                                  >
                                    {(() => {
                                      const label = format(range.from ?? new Date(), "LLLL yyyy", { locale: ru });
                                      return label.charAt(0).toUpperCase() + label.slice(1);
                                    })()}
                                  </div>

                                  <div style={{ display: "flex", gap: 12 }}>
                                    <button
                                      onClick={() =>
                                        setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))
                                      }
                                      style={{
                                        background: "none",
                                        border: "none",
                                        fontSize: 22,
                                        cursor: "pointer",
                                        lineHeight: 1,
                                      }}
                                    >
                                      ‹
                                    </button>

                                    <button
                                      onClick={() =>
                                        setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))
                                      }
                                      style={{
                                        background: "none",
                                        border: "none",
                                        fontSize: 22,
                                        cursor: "pointer",
                                        lineHeight: 1,
                                      }}
                                    >
                                      ›
                                    </button>
                                  </div>
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                  <DayPicker
                                    mode="range"
                                    selected={range}
                                    month={month}
                                    onMonthChange={setMonth}
                                    onSelect={handleRangeSelect}
                                    locale={ru}
                                    style={{ width: "100%", height: "100%", flex: 1 }}
                                    styles={{
                                      month: { width: "100%" },
                                      table: { width: "100%" },
                                      tbody: { width: "100%" },
                                      day: { background: "transparent" },
                                      nav_button: {
                                        color: "#000",
                                      },
                                    }}
                                    modifiersStyles={{
                                      selected: {
                                        backgroundColor: "transparent",
                                        color: "#3789D5",
                                        fontWeight: 600,
                                      },
                                      range_start: {
                                        backgroundColor: "transparent",
                                        color: "#3789D5",
                                        fontWeight: 600,
                                      },
                                      range_end: {
                                        backgroundColor: "transparent",
                                        color: "#3789D5",
                                        fontWeight: 600,
                                      },
                                      range_middle: {
                                        backgroundColor: "transparent",
                                        color: "#3789D5",
                                        fontWeight: 600,
                                      },
                                    }}
                                    classNames={{
                                      day: "rdp-day-custom",
                                      day_selected: "rdp-day-custom-selected",
                                      day_range_start: "rdp-day-custom-start",
                                      day_range_end: "rdp-day-custom-end",
                                      day_range_middle: "rdp-day-custom-middle",
                                    }}
                                    components={{
                                      CaptionLabel: () => null,
                                    }}
                                    hideNavigation
                                  />
                                </div>
                                <style>{`
                                  .rdp-weekday {
                                    font-size: 16px;
                                    font-weight: 500;
                                    color: #333333;
                                    text-transform: lowercase;
                                    padding-bottom: 6px;
                                  }

                                  .rdp-day_button {
                                    background: none !important;
                                    border: none !important;
                                    box-shadow: none !important;
                                    outline: none !important;
                                    padding: 0 !important;
                                    margin: 0 !important;
                                    width: 32px;
                                    height: 32px;
                                    font-size: 16px;
                                    font-weight: 500;
                                    cursor: pointer;
                                    color: inherit;
                                  }

                                  .rdp-button_next,
                                  .rdp-button_previous {
                                    background: none !important;
                                    border: none !important;
                                    box-shadow: none !important;
                                    padding: 4px;
                                    cursor: pointer;
                                  }

                                  .rdp-day,
                                  .rdp-day_selected,
                                  .rdp-day_range_start,
                                  .rdp-day_range_end,
                                  .rdp-day_range_middle {
                                    background: transparent !important;
                                    box-shadow: none !important;
                                    outline: none !important;
                                  }

                                  .rdp-day_selected .rdp-day_button,
                                  .rdp-day_range_start .rdp-day_button,
                                  .rdp-day_range_end .rdp-day_button,
                                  .rdp-day_range_middle .rdp-day_button {
                                    color: #45A6FF !important;
                                    font-weight: 500;
                                  }
                                  .rdp {
                                    height: 100%;
                                  }
                                  .rdp-months {
                                    height: 100%;
                                  }
                                  .rdp-month {
                                    height: 100%;
                                  }
                                  .rdp-caption {
                                    display: none !important;
                                  }
                                `}</style>
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "auto auto",
                                    rowGap: 12,
                                    columnGap: 12,
                                    marginTop: 16,
                                    fontSize: 16,
                                    color: "#333",
                                    justifyContent: "start",
                                  }}
                                >
                                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                                    <input
                                      type="checkbox"
                                      checked={activePreset === "30d"}
                                      onChange={() => applyPreset("30d")}
                                    />
                                    30 дней
                                  </label>

                                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                                    <input
                                      type="checkbox"
                                      checked={activePreset === "week"}
                                      onChange={() => applyPreset("week")}
                                    />
                                    эта неделя
                                  </label>

                                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                                    <input
                                      type="checkbox"
                                      checked={activePreset === "90d"}
                                      onChange={() => applyPreset("90d")}
                                    />
                                    90 дней
                                  </label>

                                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                                    <input
                                      type="checkbox"
                                      checked={activePreset === "all"}
                                      onChange={() => applyPreset("all")}
                                    />
                                    все время
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: 520,
                          background: "#EEF1F6",
                          borderRadius: 12,
                        }}
                      />
                    )}
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
                            <div
                              style={{
                                width: 210,
                                height: 210,
                                borderRadius: "50%",
                                background: "#EEF1F6",
                                margin: "0 auto",
                              }}
                            />
                        )}
                    </div>

                    <div style={{ ...blockBaseStyle, flex: 1 }}>
                        <div style={{ ...titleStyle, marginBottom: 39}}>Нагрузка по исполнителям</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 16, marginTop: 18 }}>
                            {(() => {
                                if (!workload) return (
                                  <div
                                    style={{
                                      width: "100%",
                                      height: 24,
                                      background: "#EEF1F6",
                                      borderRadius: 6,
                                    }}
                                  />
                                );
                                if (!workloadPrepared.length) return <div>Нет данных</div>;
                                return workloadPrepared.map((item) => (
                                    <div
                                        key={item.name}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
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
                                                marginRight: 18
                                            }}
                                        >
                                            {getInitials(item.name)}
                                        </div>
                                        <div style={{
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            minWidth: 0,
                                        }}>
                                            <div
                                                style={{
                                                    width: 262,
                                                    height: 55,
                                                    background: "#E9ECF3",
                                                    borderRadius: 8,
                                                    overflow: "hidden",
                                                    position: "relative",
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        background: "#2B4DEC",
                                                        width: `${item.percent}%`,
                                                        height: "100%",
                                                        borderRadius: 12,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        transition: "width 0.4s",
                                                        position: "relative",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "#fff",
                                                            fontWeight: 600,
                                                            fontSize: 14,
                                                            padding: "0 18px",
                                                            whiteSpace: "nowrap",
                                                            position: "absolute",
                                                            zIndex: 2,
                                                            transition: "color 0.2s",
                                                        }}
                                                    >
                                                        {item.percent}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};