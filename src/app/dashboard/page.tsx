/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Loader,
  Package,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { getAllOrdersForAdmin } from "@/api/orderAPI";
import { useTranslation } from "react-i18next";
import "../../i18n";

const PAYMENT_BAR_COLORS = ["#A3E4FF", "#0AACF0", "#37438F"];
const PIE_COLORS = ["#A3E4FF", "#0AACF0", "#37438F", "#0578AB", "#7EE7FF"];
const CHART_OPTIONS = ["Material", "Assembly", "Painting"] as const;
const DASHBOARD_TOOLTIP_STYLE = {
  background: "rgba(6, 14, 30, 0.96)",
  border: "1px solid rgba(118, 227, 255, 0.3)",
  borderRadius: "16px",
  color: "#F8FBFF",
  boxShadow: "0 18px 42px rgba(0, 0, 0, 0.35)",
};
const DASHBOARD_TOOLTIP_LABEL_STYLE = {
  color: "#F8FBFF",
  fontWeight: 600,
};
const DASHBOARD_TOOLTIP_ITEM_STYLE = {
  color: "#DDEBFF",
};

type ChartOption = (typeof CHART_OPTIONS)[number];

export default function Dashboard() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedChart, setSelectedChart] = useState<ChartOption>("Material");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchAdminOrders = async () => {
      if (!token) return;
      try {
        const data = await getAllOrdersForAdmin(token);
        setOrders(data.data || []);
      } catch (error) {
        console.error("Error fetching admin orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchAdminOrders();
    }
  }, [token]);

  const paidOrders = useMemo(
    () => orders.filter((order) => order.paymentStatus === "Paid"),
    [orders]
  );
  const refundedOrders = useMemo(
    () => orders.filter((order) => order.paymentStatus === "Refunded"),
    [orders]
  );
  const unpaidOrders = useMemo(
    () => orders.filter((order) => order.paymentStatus === "Unpaid"),
    [orders]
  );

  const totalAmount = paidOrders.reduce(
    (sum: number, order: any) => sum + Number(order.total || 0),
    0
  );
  const totalQuantity = paidOrders.reduce(
    (sum: number, order: any) => sum + Number(order.quantity || 0),
    0
  );
  const avgOrderValue = paidOrders.length ? totalAmount / paidOrders.length : 0;

  const ordersByDate = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      map.set(date, (map.get(date) || 0) + 1);
    });
    return Array.from(map.entries()).map(([date, totalOrders]) => ({
      date,
      totalOrders,
    }));
  }, [orders]);

  const quantityByDate = useMemo(() => {
    const map = new Map<string, number>();
    paidOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      map.set(date, (map.get(date) || 0) + Number(order.quantity || 0));
    });
    return Array.from(map.entries()).map(([date, totalQuantity]) => ({
      date,
      totalQuantity,
    }));
  }, [paidOrders]);

  const paymentChartData = [
    { name: t("dashboard.chartData.paid"), value: paidOrders.length },
    { name: t("dashboard.chartData.unpaid"), value: unpaidOrders.length },
    { name: t("dashboard.chartData.refunded"), value: refundedOrders.length },
  ];

  const chartGroups = {
    Material: orders.reduce((acc: any[], order: any) => {
      if (!order.material) return acc;
      const item = acc.find((entry) => entry.name === order.material);
      if (item) item.value += 1;
      else acc.push({ name: order.material, value: 1 });
      return acc;
    }, []),
    Assembly: orders.reduce((acc: any[], order: any) => {
      if (!order.assembly) return acc;
      const item = acc.find((entry) => entry.name === order.assembly);
      if (item) item.value += 1;
      else acc.push({ name: order.assembly, value: 1 });
      return acc;
    }, []),
    Painting: orders.reduce((acc: any[], order: any) => {
      if (!order.painting) return acc;
      const item = acc.find((entry) => entry.name === order.painting);
      if (item) item.value += 1;
      else acc.push({ name: order.painting, value: 1 });
      return acc;
    }, []),
  };

  const selectedBreakdownData = chartGroups[selectedChart];

  const statCards = [
    {
      label: t("dashboard.totalOrders"),
      value: paidOrders.length.toLocaleString(),
      icon: ShoppingBag,
    },
    {
      label: t("dashboard.totalAmount"),
      value: `${totalAmount.toLocaleString()} ฿`,
      icon: CreditCard,
    },
    {
      label: t("dashboard.avgOrderValue"),
      value: `${avgOrderValue.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} ฿`,
      icon: Sparkles,
    },
    {
      label: t("dashboard.totalQuantity"),
      value: totalQuantity.toLocaleString(),
      icon: Package,
    },
    {
      label: t("dashboard.refunds"),
      value: refundedOrders.length.toLocaleString(),
      icon: RefreshCcw,
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,49,100,0.35),rgba(20,20,20,1)_32%,rgba(12,12,12,1)_100%)] text-white">
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />

      <div
        className={`h-screen overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-[155px]"}`}
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center px-6">
            <Loader className="animate-spin text-[#0CACF3]" size={48} />
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-6 pb-8 pt-8">
            <section className="border-b border-white/10 pb-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-[#88ebff]">
                    <Sparkles size={14} />
                    Admin Workspace
                  </div>
                  <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                    {t("dashboard.title")}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aebddb] sm:text-base">
                    {t("dashboard.description")}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {statCards.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5 backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                      <Icon size={18} className="text-[#76e3ff]" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{value}</p>
                      <p className="text-xs text-white/60">{label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
              <DashboardPanel
                title={t("dashboard.panels.paymentTitle")}
                description={t("dashboard.panels.paymentDescription")}
              >
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentChartData} barCategoryGap={28}>
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.08)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#B8C5E3", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#B8C5E3", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.03)" }}
                        contentStyle={DASHBOARD_TOOLTIP_STYLE}
                        labelStyle={DASHBOARD_TOOLTIP_LABEL_STYLE}
                        itemStyle={DASHBOARD_TOOLTIP_ITEM_STYLE}
                      />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                        {paymentChartData.map((_, index) => (
                          <Cell
                            key={`payment-cell-${index}`}
                            fill={PAYMENT_BAR_COLORS[index % PAYMENT_BAR_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardPanel>

              <DashboardPanel
                title={t("dashboard.panels.ordersTitle")}
                description={t("dashboard.panels.ordersDescription")}
              >
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ordersByDate}>
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.08)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#B8C5E3", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#B8C5E3", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={DASHBOARD_TOOLTIP_STYLE}
                        labelStyle={DASHBOARD_TOOLTIP_LABEL_STYLE}
                        itemStyle={DASHBOARD_TOOLTIP_ITEM_STYLE}
                      />
                      <Legend formatter={() => t("dashboard.legend.totalOrders")} />
                      <Line
                        type="monotone"
                        dataKey="totalOrders"
                        stroke="#67dfff"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "#67dfff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </DashboardPanel>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
              <DashboardPanel
                title={t("dashboard.panels.breakdownTitle")}
                description={t("dashboard.panels.breakdownDescription")}
                toolbar={
                  <select
                    className="dashboard-select"
                    value={selectedChart}
                    onChange={(e) =>
                      setSelectedChart(e.target.value as ChartOption)
                    }
                  >
                    {CHART_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {t(`dashboard.select.${option.toLowerCase()}`)}
                      </option>
                    ))}
                  </select>
                }
              >
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        formatter={(value, name) => [
                          `${value} ${t("dashboard.tooltip.orders")}`,
                          typeof name === "string"
                            ? t(`dashboard.chartData.${name.toLowerCase()}`)
                            : name,
                        ]}
                        contentStyle={DASHBOARD_TOOLTIP_STYLE}
                        labelStyle={DASHBOARD_TOOLTIP_LABEL_STYLE}
                        itemStyle={DASHBOARD_TOOLTIP_ITEM_STYLE}
                      />
                      <Pie
                        data={selectedBreakdownData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={105}
                        innerRadius={52}
                        paddingAngle={3}
                        label
                      >
                        {selectedBreakdownData.map((_, index) => (
                          <Cell
                            key={`breakdown-cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        payload={selectedBreakdownData.map((entry, index) => ({
                          value: t(`dashboard.chartData.${entry.name.toLowerCase()}`),
                          type: "circle",
                          color: PIE_COLORS[index % PIE_COLORS.length],
                        }))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-sm text-white/55">
                  {t(`dashboard.overview.${selectedChart}`)}
                </p>
              </DashboardPanel>

              <DashboardPanel
                title={t("dashboard.panels.quantityTitle")}
                description={t("dashboard.panels.quantityDescription")}
              >
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={quantityByDate}>
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.08)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#B8C5E3", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#B8C5E3", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={DASHBOARD_TOOLTIP_STYLE}
                        labelStyle={DASHBOARD_TOOLTIP_LABEL_STYLE}
                        itemStyle={DASHBOARD_TOOLTIP_ITEM_STYLE}
                      />
                      <Legend formatter={() => t("dashboard.legend.totalQuantity")} />
                      <Line
                        type="monotone"
                        dataKey="totalQuantity"
                        stroke="#0AACF0"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "#0AACF0" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </DashboardPanel>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardPanel({
  title,
  description,
  toolbar,
  children,
}: {
  title: string;
  description: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-white/10 bg-[#091224]/88 p-5 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#aebddb]">{description}</p>
        </div>
        {toolbar ? <div className="sm:ml-4">{toolbar}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
