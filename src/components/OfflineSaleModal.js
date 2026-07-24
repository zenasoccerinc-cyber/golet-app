// src/components/OfflineSaleModal.js
import React from "react";
import { X } from "lucide-react";

export default function OfflineSaleModal({
  showOfflineSaleModal,
  setShowOfflineSaleModal,
  offlineSaleProduct,
  offlineSaleMode,
  setOfflineSaleMode,
  offlineSaleQty,
  setOfflineSaleQty,
  offlineSaleCustomPrice,
  setOfflineSaleCustomPrice,
  submitOfflineSale,
  uploading
}) {
  if (!showOfflineSaleModal || !offlineSaleProduct) return null;
  
  return (
    <div className="fixed inset-0 bg-black/95 z-[90] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
      <div className="bg-zinc-900 border border-amber-500/50 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
        <button onClick={() => setShowOfflineSaleModal(false)} className="absolute top-4 right-4 bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors"><X className="text-white w-5 h-5" /></button>
        <h2 className="text-xl font-black text-amber-500 mb-2">Log Store Sale</h2>
        <p className="text-white text-sm font-bold mb-4">{offlineSaleProduct.name}</p>
        
        <div className="flex space-x-2 mb-6">
          <button onClick={() => { setOfflineSaleMode("single"); setOfflineSaleCustomPrice(offlineSaleProduct.price); }} className={`flex-1 py-2 rounded-lg font-bold text-sm border ${offlineSaleMode === "single" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-700"}`}>Retail Sale</button>
          <button onClick={() => { setOfflineSaleMode("bulk"); setOfflineSaleCustomPrice(""); }} className={`flex-1 py-2 rounded-lg font-bold text-sm border ${offlineSaleMode === "bulk" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-700"}`}>Bulk/Custom Sale</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 font-bold block mb-1">Quantity Sold (Units)</label>
            <input type="number" min="1" max={offlineSaleProduct.stock_quantity} value={offlineSaleQty} onChange={(e) => setOfflineSaleQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none" />
            <p className="text-[10px] text-zinc-500 mt-1">Available stock: {Math.max(0, offlineSaleProduct.stock_quantity)}</p>
          </div>
          
          {offlineSaleMode === 'bulk' && (
            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">Total Revenue Collected (Birr)</label>
              <input type="number" value={offlineSaleCustomPrice} onChange={(e) => setOfflineSaleCustomPrice(e.target.value)} placeholder="e.g. 4500" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none font-mono" />
            </div>
          )}
          
          {offlineSaleMode === 'single' && (
            <div className="bg-black p-3 rounded-xl border border-zinc-800">
              <p className="text-xs text-zinc-400 font-bold">Auto-calculated Revenue</p>
              <p className="text-lg font-black text-white">{offlineSaleProduct.price * offlineSaleQty} Birr</p>
            </div>
          )}
          
          <button onClick={submitOfflineSale} disabled={uploading || (offlineSaleMode === 'bulk' && !offlineSaleCustomPrice)} className="w-full bg-amber-500 disabled:bg-zinc-800 text-black font-black py-4 rounded-xl shadow-lg mt-2 transition-colors">
            {uploading ? "Logging..." : "Confirm Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
