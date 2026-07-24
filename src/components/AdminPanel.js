// src/components/AdminPanel.js
import React from "react";
import { X, Package, List, Edit, Plus } from "lucide-react";

export default function AdminPanel({
  showAdminPanel,
  setShowAdminPanel,
  products,
  orders,
  sourcingRequests,
  isCEO
}) {
  if (!showAdminPanel || !isCEO) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] overflow-y-auto p-4 md:p-8 animate-in fade-in zoom-in duration-200">
      <div className="max-w-6xl mx-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
        <button onClick={() => setShowAdminPanel(false)} className="absolute top-6 right-6 bg-zinc-900 p-2 rounded-full hover:bg-zinc-800 transition-colors">
          <X className="text-white w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black text-amber-500 mb-8 flex items-center gap-3">
          <Package className="w-8 h-8" /> Command Center
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-white font-bold mb-2">Total Products</h3>
            <p className="text-3xl text-amber-500 font-black">{products?.length || 0}</p>
          </div>
          <div className="bg-black p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-white font-bold mb-2">Active Orders</h3>
            <p className="text-3xl text-amber-500 font-black">{orders?.length || 0}</p>
          </div>
          <div className="bg-black p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-white font-bold mb-2">Sourcing Requests</h3>
            <p className="text-3xl text-amber-500 font-black">{sourcingRequests?.length || 0}</p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl text-center">
          <p className="text-amber-500 font-bold">Admin controls successfully isolated. Add/Edit modules standing by.</p>
        </div>
      </div>
    </div>
  );
}
