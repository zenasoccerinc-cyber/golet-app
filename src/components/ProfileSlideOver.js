// src/components/ProfileSlideOver.js
import React from "react";
import { X } from "lucide-react";

export default function ProfileSlideOver({
  setShowProfileSlideOver,
  currentUserProfile,
  saveUserProfile,
  isFullNameValid,
  uploading
}) {
  const isRegionLocked = !!currentUserProfile?.region;

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowProfileSlideOver(false)}></div>
      <div className="relative w-full max-w-sm bg-zinc-950 h-full overflow-y-auto border-l border-zinc-800 animate-in slide-in-from-right duration-300 flex flex-col p-6 shadow-2xl">
        <button onClick={() => setShowProfileSlideOver(false)} className="absolute top-4 right-4 bg-zinc-900 p-2 rounded-full hover:bg-zinc-800 transition-colors"><X className="text-white w-5 h-5" /></button>
        
        <h2 className="text-2xl font-black text-amber-500 mb-2 mt-2">የግል መረጃ</h2>
        <p className="text-zinc-300 text-sm mb-6">ለፈጣን አገልግሎት እባክዎ መረጃዎን ያስተካክሉ።</p>
        
        <form onSubmit={saveUserProfile} className="space-y-4">
          <input required name="fullName" defaultValue={currentUserProfile?.full_name || ""} placeholder="ሙሉ ስም (የመጀመሪያ እና የአባት ስም ክፍተት በማድረግ ይጻፉ)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none" onChange={(e) => { e.target.setCustomValidity(isFullNameValid(e.target.value) ? '' : 'እባክዎ ሙሉ ስም ያስገቡ (የመጀመሪያ እና የአባት ስም)') }} />
          <input required name="phone" type="tel" maxLength="10" pattern="[0-9]{10}" defaultValue={currentUserProfile?.phone_number || ""} placeholder="ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none font-mono" />
          
          <div className="relative">
            <select required name="location" disabled={isRegionLocked} defaultValue={currentUserProfile?.region === 'Diaspora' ? 'USA' : (currentUserProfile?.region === 'Local' ? 'Ethiopia' : '')} className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none font-bold disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="">የት ሀገር ነዎት? (Location)</option>
              <option value="Ethiopia">Ethiopia (ኢትዮጵያ) - Local</option>
              <option value="USA">USA - Diaspora</option>
              <option value="Canada">Canada - Diaspora</option>
              <option value="Europe">Europe - Diaspora</option>
              <option value="Australia">Australia - Diaspora</option>
            </select>
            {isRegionLocked && <p className="text-[10px] text-zinc-500 mt-1">Location is locked for pricing accuracy. Contact support to change.</p>}
          </div>

          <button type="submit" disabled={uploading} className="w-full bg-amber-500 disabled:bg-zinc-800 hover:bg-amber-400 text-black font-black py-4 rounded-xl shadow-lg transition-colors mt-4">
            {uploading ? "በማስቀመጥ ላይ..." : "አስቀምጥ (Save)"}
          </button>
        </form>
      </div>
    </div>
  );
}
