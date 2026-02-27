import { useSelector } from 'react-redux';
import {
    Building2,
    Briefcase,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from 'lucide-react';
import Chart from 'react-apexcharts';

const Dashboard = () => {
    const { stats, recentActivity } = useSelector((state) => state.dashboard);

    const statCards = [
        { label: 'Total Companies', value: stats.totalCompanies, icon: Building2, color: 'text-blue-500', trend: '+12.5%', isUp: true },
        { label: 'Total Interns', value: stats.totalInterns, icon: Users, color: 'text-purple-500', trend: '+18.2%', isUp: true },
        { label: 'Job Postings', value: stats.totalJobs, icon: Briefcase, color: 'text-teal-500', trend: '+5.4%', isUp: true },
        { label: 'Total Revenue', value: stats.totalRevenue, icon: TrendingUp, color: 'text-amber-500', trend: '-2.1%', isUp: false },
    ];

    const chartOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            sparkline: { enabled: false },
        },
        colors: ['#0A3031', '#FFD466'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#64748b', fontSize: '12px' } }
        },
        yaxis: { show: false },
        grid: { borderColor: '#f1f5f9' },
        tooltip: { theme: 'light' }
    };

    const chartSeries = [
        { name: 'Companies', data: [31, 40, 28, 51, 42, 109, 100] },
        { name: 'Interns', data: [11, 32, 45, 32, 34, 52, 41] },
    ];

    return (
        <div className="space-y-8 p-1">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight">
                        Dashboard <span className="text-brand-primary/20 bg-brand-primary/5 px-3 py-1 rounded-full text-sm align-middle ml-2">OVERVIEW</span>
                    </h1>
                    <p className="text-brand-primary/50 text-sm font-medium mt-1">Here's what's happening with Oppvia today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white border border-brand-primary/5 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-soft">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-brand-primary/70 uppercase tracking-wider">Live System Status</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-brand-primary/5 shadow-soft hover:shadow-premium transition-all duration-500 group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-brand-primary/[0.03] group-hover:scale-110 transition-transform duration-500`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${card.isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {card.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {card.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-brand-primary/40 uppercase tracking-[0.1em] mb-1">{card.label}</p>
                            <h3 className="text-2xl font-black text-brand-primary tracking-tighter">{card.value.toLocaleString()}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-brand-primary tracking-tight">Platform Growth</h3>
                        <select className="bg-brand-primary/[0.03] border-none text-xs font-bold rounded-xl pr-8 py-2 text-brand-primary/60 focus:ring-brand-primary/10">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div id="chart" className="h-80">
                        <Chart options={chartOptions} series={chartSeries} type="area" height="100%" />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-brand-primary p-8 rounded-[40px] shadow-soft relative overflow-hidden group">
                    {/* Subtle Decorative Circle */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-accent/10 blur-[100px] rounded-full group-hover:bg-brand-accent/20 transition-all duration-700" />

                    <h3 className="text-lg font-bold text-white mb-8 relative z-10 flex items-center justify-between">
                        Recent Activity
                        <Clock className="w-5 h-5 text-white/30" />
                    </h3>
                    <div className="space-y-6 relative z-10">
                        {recentActivity.map((activity, idx) => (
                            <div key={idx} className="flex gap-4 group/item cursor-pointer">
                                <div className="w-px bg-white/10 relative h-12 mt-2">
                                    <div className="absolute top-0 -left-1 w-2 h-2 bg-brand-accent rounded-full ring-4 ring-brand-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-white/40 mb-1 uppercase tracking-wider">{activity.time}</p>
                                    <p className="text-sm font-bold text-white group-hover/item:text-brand-accent transition-colors leading-tight">
                                        {activity.entity}
                                    </p>
                                    <p className="text-[10px] font-bold text-white/30 mt-1">
                                        {activity.type.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white/80 hover:bg-white/10 transition-all tracking-widest uppercase">
                        View All Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
