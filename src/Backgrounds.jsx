import React from 'react';

export const VillageRoadBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900/20" />
    <div className="absolute top-10 left-20 w-1 h-1 bg-white opacity-40 rounded-full" />
    <div className="absolute top-20 left-1/4 w-0.5 h-0.5 bg-white opacity-60 rounded-full" />
    <div className="absolute top-5 right-1/3 w-1 h-1 bg-white opacity-30 rounded-full" />
    <div className="absolute top-10 right-10 w-12 h-12 rounded-full bg-indigo-100/20 blur-xl" />
    <div className="absolute top-12 right-12 w-8 h-8 rounded-full bg-indigo-50/80 shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
    <div className="absolute bottom-[35%] left-0 right-0 h-24 bg-slate-900 opacity-40 [clip-path:polygon(0%_100%,0%_20%,20%_0%,50%_30%,80%_10%,100%_40%,100%_100%)]" />
    <div className="absolute bottom-[35%] left-0 right-0 h-32 flex items-end justify-center gap-1 opacity-60">
        <div className="w-16 h-12 bg-slate-900 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
        <div className="w-10 h-24 bg-slate-900 [clip-path:polygon(10%_100%,10%_10%,0%_10%,10%_0%,90%_0%,100%_10%,90%_10%,90%_100%)]" />
        <div className="w-20 h-16 bg-slate-900 [clip-path:polygon(0%_100%,0%_30%,20%_30%,50%_0%,80%_30%,100%_30%,100%_100%)]" />
        <div className="w-24" />
        <div className="w-14 h-14 bg-slate-900 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
    </div>
    <div className="absolute bottom-[35%] -left-10 w-32 h-24 bg-slate-950 opacity-80 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
    <div className="absolute bottom-[35%] -right-10 w-40 h-28 bg-slate-950 opacity-80 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
    <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-[#3f2e18]" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 md:w-96 h-[35%] bg-[#5c4026] [clip-path:polygon(20%_0,80%_0,100%_100%,0%_100%)] opacity-80" />
    <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,#0f172a_100%) opacity-60" />
  </div>
);

export const InnRoomBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-[#1a120b]">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3f2e18_1px,transparent_1px)] [background-size:20px_20px]" />
    <div className="absolute top-10 left-10 w-24 h-32 bg-[#0f172a] border-4 border-[#3f2e18] rounded-t-full overflow-hidden">
       <div className="absolute top-2 right-4 w-4 h-4 bg-white rounded-full opacity-80 shadow-[0_0_10px_white]" />
       <div className="absolute bottom-0 w-full h-1 bg-black/50" />
       <div className="absolute w-1 h-full left-1/2 bg-[#3f2e18]" />
       <div className="absolute h-1 w-full top-1/2 bg-[#3f2e18]" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-[#2a1d10] border-t border-[#3f2e18]" />
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-red-900/40 rounded-[50%]" />
  </div>
);

const BACKGROUND_MAP = {
  village_road: VillageRoadBackground,
  inn_room: InnRoomBackground,
};

export const getBackground = (locationId) => {
  return BACKGROUND_MAP[locationId] || (() => <div className="bg-slate-900 w-full h-full" />);
};
