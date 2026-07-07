import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {

    return (
        <div className="flex justify-center bg-gray-100 font-sans min-h-screen">
            <div className="main-container bg-gray-100 flex flex-col w-full max-w-sm min-h-screen relative overflow-hidden shadow-2xl">
                {/* Main Content Area */}
                <div className="pt-16 pb-20 flex-grow overflow-y-auto scrollbar-hide p-2">

                    {/* Enhanced Progress Card (Primary Focus) */}
                    <div className="p-5 rounded-2xl shadow-xl bg-[#ef8114] text-white mb-2 transform transition-transform hover:scale-[1.02] duration-300 cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                            <h2 className="text-2xl font-extrabold">
                                Muscle Gain Phase
                            </h2>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                Week 3
                            </span>
                        </div>
                        <p className="text-sm text-indigo-100 mb-4">
                            You're performing great! Keep hitting that protein surplus.
                        </p>

                        {/* Progress Bar */}
                        <div className="relative w-full bg-white rounded-full h-2.5 overflow-hidden mb-3">
                            <div className="bg-[#055c2c] rounded-full h-full w-[75%] duration-700" />
                        </div>

                        <div className="flex justify-between text-xs font-semibold text-indigo-100">
                            <span>Progress: <span className="font-extrabold text-white">75% Complete</span></span>
                            <span>Target: 8 Weeks</span>
                        </div>
                    </div>
                    {/* --- End Progress Card --- */}

                    <h3 className="text-xl font-bold text-gray-800 mb-2 mt-2">Daily Summary</h3>

                    {/* Enhanced Daily Averages Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">

                        <div className="p-4 rounded-xl bg-white text-center shadow-lg border border-green-100/70 transition hover:shadow-xl">
                            <span className="text-2xl block mb-1">🥩</span>
                            <p className="text-xl font-extrabold text-gray-800">120g</p>
                            <p className="text-xs font-semibold text-green-600 mt-0.5">Protein</p>
                        </div>

                        <div className="p-4 rounded-xl bg-white text-center shadow-lg border border-red-100/70 transition hover:shadow-xl">
                            <span className="text-2xl block mb-1">🔥</span>
                            <p className="text-xl font-extrabold text-gray-800">1850</p>
                            <p className="text-xs font-semibold text-red-600 mt-0.5">Kcal</p>
                        </div>

                        <div className="p-4 rounded-xl bg-white text-center shadow-lg border border-blue-100/70 transition hover:shadow-xl">
                            <span className="text-2xl block mb-1">🍚</span>
                            <p className="text-xl font-extrabold text-gray-800">200g</p>
                            <p className="text-xs font-semibold text-blue-600 mt-0.5">Carbs</p>
                        </div>
                    </div>
                    {/* --- End Daily Averages --- */}

                    {/* Enhanced Weight Trend */}
                    <div className="p-5 rounded-2xl shadow-lg bg-white border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Weight Trend</h3>
                            <Link to="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                View Detail &rarr;
                            </Link>
                        </div>

                        {/* Placeholder for Chart - Increased size and added subtle gradient */}
                        <div className="w-full h-48 bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-dashed border-gray-300 p-2 shadow-inner">
                            <p className="text-sm text-gray-400">
                                <span className="font-extrabold text-lg block mb-1 text-gray-700">7-Day Analysis</span>
                                📈 Placeholder Chart Area
                            </p>
                        </div>

                        <div className="mt-4 text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                Last 7 Days Change:{" "}
                                <span className="font-bold text-lg text-green-600 block sm:inline">
                                    <span className="inline-block align-middle mr-1">&uarr;</span>1.2 kg Gain
                                </span>
                            </p>
                        </div>
                    </div>
                    {/* --- End Weight Trend --- */}

                    <div className="h-4"></div> {/* Extra space at the bottom */}
                </div>
            </div>
        </div>
    );
}