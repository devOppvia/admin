import { useSelector } from "react-redux";
import {
  Building2,
  Briefcase,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  IndianRupee,
  List,
  PieChart,
} from "lucide-react";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import {
  getDashboardDetailsAdminApi,
  getDashboardDetailsApi,
} from "../helper/api_helper";

const Dashboard = () => {
  const { stats, recentActivity } = useSelector((state) => state.dashboard);
  const [data, setData] = useState(null);

  const statCards = [
    {
      label: "Total Revenue",
      value: data?.unitCount?.[0] || 0,
      icon: IndianRupee,
      color: "text-blue-500",
      trend: "+12.5%",
      isUp: true,
    },
    {
      label: "Total Companies",
      value: data?.unitCount?.[1] || 0,
      icon: Building2,
      color: "text-purple-500",
      trend: "+18.2%",
      isUp: true,
    },
    {
      label: "Total Jobs",
      value: data?.unitCount?.[2] || 0,
      icon: Briefcase,
      color: "text-teal-500",
      trend: "+5.4%",
      isUp: true,
    },
    {
      label: "Total Job Categories",
      value: data?.unitCount?.[3] || 0,
      icon: List,
      color: "text-amber-500",
      trend: "-2.1%",
      isUp: false,
    },
  ];

  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: ["#0A3031", "#FFD466"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#64748b", fontSize: "12px" } },
    },
    yaxis: { show: true },
    grid: { borderColor: "#f1f5f9" },
    tooltip: { theme: "light" },
  };

  const chartSeries = [
    { name: "Companies", data: data?.revenueInsigts?.[0].data } ||
      Array(12).fill(0),
  ];

  const jobStatusColors = {
    REVIEW: "#E5E7EB",
    APPROVED: "#F3F4F6",
    PAUSED: "#D1D5DB",
    COMPLETED: "#9CA3AF",
    REJECTED: "#6B7280",
  };

  const pieChartOptions = {
    chart: {
      type: "pie",
      toolbar: { show: false },
    },
    colors: data?.jobStatus?.map((item) => jobStatusColors[item.label] || "#6B7280"),
    labels: data?.jobStatus?.map((item) => item.label),
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      },
      style: {
        fontSize: "12px",
        fontWeight: 700,
        colors: ["#FFFFFF"],
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
              color: "#FFFFFF",
            },
            value: {
              show: true,
              fontSize: "18px",
              fontWeight: 700,
              color: "#FFFFFF",
              formatter: function (val) {
                return val;
              },
            },
            total: {
              show: true,
              label: "Total Jobs",
              fontSize: "14px",
              fontWeight: 600,
              color: "#FFFFFF",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
      fontWeight: 600,
      labels: {
        colors: "#FFFFFF",
      },
      markers: {
        radius: 6,
      },
    },
    stroke: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const pieChartSeries = data?.jobStatus?.map((item) => item.count);

  const getData = async () => {
    try {
      const [dashboardRes, jobStatusRes] = await Promise.all([
        getDashboardDetailsAdminApi(),
      ]);
      if (dashboardRes.status) {
        setData(dashboardRes.data);
      }
      if (jobStatusRes.status) {
        setJobStatus(jobStatusRes.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  console.log("data : ", data);

  return (
    <div className="space-y-8 p-1">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tight">
            Dashboard{" "}
            <span className="text-brand-primary/20 bg-brand-primary/5 px-3 py-1 rounded-full text-sm align-middle ml-2">
              OVERVIEW
            </span>
          </h1>
          <p className="text-brand-primary/50 text-sm font-medium mt-1">
            Here's what's happening with Oppvia today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-brand-primary/5 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-soft">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-brand-primary/70 uppercase tracking-wider">
              Live System Status
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-3xl border border-brand-primary/5 shadow-soft hover:shadow-premium transition-all duration-500 group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-2xl bg-brand-primary/[0.03] group-hover:scale-110 transition-transform duration-500`}
              >
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              {/* <div
                    className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${card.isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                    {card.isUp ? (
                    <ArrowUpRight className="w-3 h-3" />
                    ) : (
                    <ArrowDownRight className="w-3 h-3" />
                    )}
                    {card.trend}
                </div> */}
            </div>
            <div>
              <p className="text-xs font-bold text-brand-primary/40 uppercase tracking-[0.1em] mb-1">
                {card.label}
              </p>
              <h3 className="text-2xl font-black text-brand-primary tracking-tighter">
                {card.value.toLocaleString()}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-brand-primary tracking-tight">
              Revenue Insigts
            </h3>
            {/* <select className="bg-brand-primary/[0.03] border-none text-xs font-bold rounded-xl pr-8 py-2 text-brand-primary/60 focus:ring-brand-primary/10">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select> */}
          </div>
          <div id="chart" className="h-80">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height="100%"
            />
          </div>
        </div>

        {/* Job Status */}
        <div className="bg-brand-primary p-8 rounded-[40px] shadow-soft relative overflow-hidden group">
          {/* Subtle Decorative Circle */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-accent/10 blur-[100px] rounded-full group-hover:bg-brand-accent/20 transition-all duration-700" />

          <h3 className="text-lg font-bold text-white mb-8 relative z-10 flex items-center justify-between">
            Job Status
            <PieChart className="w-5 h-5 text-white/30" />
          </h3>
          <div className="relative z-10">
            {data?.jobStatus.length > 0 ? (
              <Chart
                options={pieChartOptions}
                series={pieChartSeries}
                type="donut"
                height={320}
              />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-white/50 text-sm font-medium">
                  Loading job status...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
