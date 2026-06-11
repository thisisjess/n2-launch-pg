import React from "react";
import { motion } from "motion/react";
import { 
  BarChart3, 
  MessageSquare, 
  MoreHorizontal, 
  Share2, 
  Plus, 
  Filter, 
  Search,
  ChevronRight,
  Home,
  User,
  CheckCircle2,
  Clock
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Import Sarah Chen image from N2Studio assets
import imgSarahChen from "../../imports/N2Studio/d26095b2bde26f9a212ea26cfda7d42f5c13f6aa.png";

export const DashboardMockup = () => {
  return (
    <div className="w-full bg-white rounded-xl shadow-2xl border border-[#e9e9e9] overflow-hidden font-['Work_Sans']">
      {/* Top Header/Breadcrumbs */}
      <div className="px-3 py-3 border-b border-[#f3f3f3] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-[#6f6f6f] text-[9px] lg:text-[10px]">
            <Home size={12} />
            <ChevronRight size={12} />
            <span className="hidden sm:inline">Tensile Strength Project</span>
            <ChevronRight size={12} className="hidden sm:inline" />
            <span className="text-black font-medium">Tensile Test Results - Series A</span>
          </div>
          <h2 className="text-base lg:text-xl font-bold tracking-tight">Tensile Test Results - Series A</h2>
          <p className="text-[#6f6f6f] text-[9px] lg:text-[10px] font-light">Initial tensile strength measurements for carbon fiber composites</p>
        </div>
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none text-[#d70321] font-bold text-[9px] lg:text-[10px] px-2 py-1 hover:bg-[#d70321]/5 rounded transition-colors border border-[#d70321]/20 sm:border-transparent">
            Follow
          </button>
          <button className="flex-1 sm:flex-none bg-[#d70321] text-white font-bold text-[9px] lg:text-[10px] px-2.5 py-1 rounded flex items-center justify-center gap-1 hover:bg-[#b0021b] transition-colors whitespace-nowrap">
            <Share2 size={11} />
            <span className="hidden lg:inline">Share Visualization</span>
            <span className="lg:hidden">Share</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-[#f3f3f3]">
        {[
          { label: "Total Rows", value: "1,850" },
          { label: "Columns", value: "7" },
          { label: "Engineer", value: "Mike Johnson" },
          { label: "Reviewer", value: "Dr. Sarah Chen" },
        ].map((stat, i) => (
          <div key={i} className="p-2 lg:p-3 border-r border-b lg:border-b-0 last:border-r-0 border-[#f3f3f3]">
            <p className="text-[8px] lg:text-[9px] font-['Roboto_Mono'] text-[#6f6f6f] uppercase tracking-widest mb-0.5">{stat.label}</p>
            <p className="text-sm lg:text-lg font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="p-2 lg:p-4 bg-[#fcfcfc] grid lg:grid-cols-3 gap-3 lg:gap-4">
        {/* Left Column: Visual Analysis */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white p-2 lg:p-3 rounded-xl border border-[#e9e9e9] shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <BarChart3 size={14} className="text-[#d70321]" />
                <h3 className="font-bold text-xs lg:text-sm">Visual Analysis</h3>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex bg-[#f3f3f3] p-0.5 rounded">
                  <button className="px-1 lg:px-1.5 py-0.5 bg-white shadow-sm rounded text-[8px] lg:text-[9px] font-bold">Bar Chart</button>
                  <button className="px-1 lg:px-1.5 py-0.5 text-[8px] lg:text-[9px] font-medium text-[#6f6f6f] hidden sm:block">Scatter Plot</button>
                </div>
                <button className="p-0.5 text-[#6f6f6f] hover:text-black transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>

            {/* Chart Mockup */}
            <div className="aspect-video lg:aspect-[16/9] relative flex items-end justify-between gap-0.5 lg:gap-1 px-0.5 lg:px-1 pb-2">
              <div className="absolute inset-0 grid grid-rows-4 pointer-events-none">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="border-t border-[#f3f3f3] w-full h-full"></div>
                ))}
              </div>
              {[60, 85, 45, 90, 75, 65, 80, 55, 95, 70].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                  className="w-full bg-[#d70321]/10 border-t-2 border-[#d70321] rounded-t-sm relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {h * 10} MPa
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-1 text-[7px] lg:text-[8px] font-['Roboto_Mono'] text-[#6f6f6f] uppercase tracking-tighter">
              <span>Lot A-01</span>
              <span className="hidden sm:inline">Lot A-10</span>
              <span>Lot B-05</span>
            </div>
          </div>
        </div>

        {/* Right Column: Status Updates */}
        <div className="space-y-3 hidden lg:block">
          <div className="bg-white p-3 rounded-xl border border-[#e9e9e9] shadow-sm h-full">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <MessageSquare size={14} className="text-[#d70321]" />
                <h3 className="font-bold text-xs">Status Updates</h3>
              </div>
              <button className="text-[#d70321] p-0.5 hover:bg-[#d70321]/5 rounded-full transition-colors">
                <Plus size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  user: "Dr. Sarah Chen",
                  role: "Reviewer",
                  time: "2h ago",
                  content: "Reviewed latest tensile test results. All values are within expected ranges. Proceeding to phase 2.",
                  status: "Approved",
                  avatar: imgSarahChen
                },
                {
                  user: "Mike Johnson",
                  role: "Engineer",
                  time: "5h ago",
                  content: "Completed series A testing for carbon fiber composites. Data ready for review.",
                  status: "Completed",
                  avatar: null
                }
              ].map((update, i) => (
                <div key={i} className="flex gap-2 border-b border-[#f3f3f3] last:border-0 pb-3 last:pb-0">
                  <div className="h-5 w-5 rounded-full bg-gray-100 shrink-0 overflow-hidden border border-[#e9e9e9]">
                    {update.avatar ? (
                      <ImageWithFallback src={update.avatar} alt={update.user} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#d70321]/10 text-[#d70321] font-bold text-[8px]">
                        {update.user.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold text-[10px]">{update.user}</span>
                      <span className="text-[8px] text-[#6f6f6f]">{update.time}</span>
                    </div>
                    <p className="text-[9px] text-[#6f6f6f] leading-snug mb-0.5 line-clamp-2">{update.content}</p>
                    <div className="flex items-center gap-0.5 text-[8px] font-bold text-[#d70321]">
                      <CheckCircle2 size={9} />
                      {update.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-auto pt-3 text-[9px] font-bold text-[#6f6f6f] hover:text-black transition-colors border-t border-[#f3f3f3]">
              View 4 more updates
            </button>
          </div>
        </div>
      </div>

      {/* Mini Table Preview */}
      <div className="px-2 lg:px-4 py-3 border-t border-[#f3f3f3] bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[#6f6f6f]" size={10} />
              <input type="text" placeholder="Search..." className="pl-6 pr-2 py-0.5 bg-[#f3f3f3] rounded text-[9px] focus:outline-none border border-transparent focus:border-[#d70321]/30 transition-all w-full sm:w-40" />
            </div>
            <button className="flex items-center gap-1 text-[9px] font-medium text-[#6f6f6f] hover:text-black">
              <Filter size={10} />
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto border border-[#f3f3f3] rounded">
          <table className="w-full text-left text-[9px] min-w-[400px]">
            <thead className="bg-[#fcfcfc] border-b border-[#f3f3f3] text-[#6f6f6f] font-['Roboto_Mono'] uppercase">
              <tr>
                <th className="px-2 py-1 font-medium">Record Name</th>
                <th className="px-2 py-1 font-medium hidden sm:table-cell">Date Created</th>
                <th className="px-2 py-1 font-medium">Value</th>
                <th className="px-2 py-1 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f3f3]">
              {[
                { name: "dp-Carbon Fiber-500", date: "6/4/2026", value: "781.50 MPa", status: "Pending", color: "text-amber-600 bg-amber-50" },
                { name: "dp-Carbon Fiber-501", date: "6/4/2026", value: "725.80 MPa", status: "Valid", color: "text-green-600 bg-green-50" },
                { name: "dp-Carbon Fiber-502", date: "6/4/2026", value: "785.09 MPa", status: "Valid", color: "text-green-600 bg-green-50" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#fcfcfc] transition-colors">
                  <td className="px-2 py-1 font-bold text-[#d70321]">{row.name}</td>
                  <td className="px-2 py-1 text-[#6f6f6f] hidden sm:table-cell">{row.date}</td>
                  <td className="px-2 py-1 font-medium">{row.value}</td>
                  <td className="px-2 py-1">
                    <span className={`px-1 py-0 rounded text-[8px] font-bold ${row.color}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
