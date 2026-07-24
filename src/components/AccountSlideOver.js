// src/components/AccountSlideOver.js
import React from "react";
import { User, X, LogOut, Target, Package, PlusCircle } from "lucide-react";

export default function AccountSlideOver({
  setShowAccountMenu,
  handleLogout,
  isCEO,
  currentUserProfile,
  isVIP,
  userOrders,
  userSourcing,
  getStatusBadge
}) {
  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAccountMenu(false)}></div>
       <div className="relative w-full max-w-sm bg-zinc-950 h-full overflow-y-auto border-l border-zinc-800 animate-in slide-in-from-right duration-300 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-black text-white flex items-center"><User className="mr-2 text-amber-500" size={24}/> የእኔ አካውንት</h2>
             <button onClick={() => setShowAccountMenu(false)} className="bg-zinc-900 p-2 rounded-full hover:bg-zinc-800 transition-colors"><X size={20}/></button>
          </div>

          <button onClick={handleLogout} className="mb-6 w-full py-3 bg-red-900/20 text-red-50 border border-red-900/50 rounded-xl font-bold flex items-center justify-center hover:bg-red-900/40 transition-colors">
             <LogOut size={16} className="mr-2"/> ዘግተህ ውጣ (Sign Out)
          </button>

          {isCEO && (
             <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/30 p-5 rounded-2xl mb-8 shadow-lg text-white">
                <h3 className="font-black text-lg uppercase tracking-widest mb-1 text-amber-500">CEO Admin Badge</h3>
                <p className="font-bold text-sm opacity-90">{currentUserProfile?.full_name}</p>
             </div>
          )}

          {isVIP && !isCEO && (
             <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 p-5 rounded-2xl mb-8 shadow-[0_0_30px_rgba(245,158,11,0.2)] text-black relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Target size={80}/></div>
                <h3 className="font-black text-lg uppercase tracking-widest mb-1 relative z-10">Goleth VIP Member</h3>
                <p className="font-bold text-sm opacity-90 mb-6 relative z-10">{currentUserProfile?.full_name}</p>
                <div className="flex justify-between items-end relative z-10">
                   <div>
                      <p className="text-[10px] uppercase font-black opacity-70">Status</p>
                      <p className="font-bold text-sm">Active</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-black opacity-70">Expires</p>
                      <p className="font-bold font-mono text-sm">{currentUserProfile?.vip_until ? new Date(currentUserProfile.vip_until).toLocaleDateString() : 'Lifetime'}</p>
                   </div>
                </div>
             </div>
          )}

          <div className="mb-8">
             <div className="flex justify-between items-center mb-3">
               <h3 className="font-bold text-amber-500 text-sm uppercase tracking-wider">የግል መረጃ (Details)</h3>
             </div>
             <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm text-zinc-300 space-y-2">
                <p><span className="text-zinc-500 mr-2">ስም:</span> {currentUserProfile?.full_name}</p>
                <p><span className="text-zinc-500 mr-2">ስልክ:</span> {currentUserProfile?.phone_number}</p>
                <p><span className="text-zinc-500 mr-2">አድራሻ:</span> {currentUserProfile?.region}</p>
             </div>
          </div>

          <div className="flex-1 space-y-8">
             <div>
               <h3 className="font-bold text-amber-500 text-sm uppercase tracking-wider mb-4 flex items-center"><Package className="mr-2" size={16}/> መደበኛ ትዕዛዞች (Orders)</h3>
               {userOrders.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-4 bg-black rounded-lg border border-zinc-800">ምንም ትዕዛዝ የለም (No orders yet).</p>
               ) : (
                  <div className="space-y-3">
                     {userOrders.map(order => (
                        <div key={order.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                           <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-white text-sm line-clamp-1 flex-1 pr-2">{order.product_name}</h4>
                              {getStatusBadge(order.status)}
                           </div>
                           <p className="text-xs text-zinc-500 mb-2">{new Date(order.created_at).toLocaleDateString()}</p>
                           {order.tracking_number && (
                              <div className="mt-3 bg-black border border-amber-500/20 p-2.5 rounded-lg">
                                 <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">Tracking Number</p>
                                 <p className="font-mono text-white text-xs font-bold">{order.tracking_number}</p>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               )}
             </div>

             <div>
               <h3 className="font-bold text-[#2AABEE] text-sm uppercase tracking-wider mb-4 flex items-center"><PlusCircle className="mr-2" size={16}/> ልዩ ትዕዛዞች (Sourcing)</h3>
               {userSourcing.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-4 bg-black rounded-lg border border-zinc-800">ምንም ልዩ ትዕዛዝ የለም.</p>
               ) : (
                  <div className="space-y-3">
                     {userSourcing.map(order => (
                        <div key={order.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                           <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-white text-sm line-clamp-1 flex-1 pr-2">{order.product_name || order.store_name || "Custom Order"}</h4>
                              {getStatusBadge(order.status)}
                           </div>
                           <p className="text-xs text-zinc-500 mb-2">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                     ))}
                  </div>
               )}
             </div>
          </div>
       </div>
    </div>
  );
}
