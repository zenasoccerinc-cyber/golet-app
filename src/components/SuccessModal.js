// src/components/SuccessModal.js
import React from "react";
import { X } from "lucide-react";

export default function SuccessModal({ setShowSuccessModal }) {
  return (
    
      
         setShowSuccessModal(false)} className="absolute top-4 right-4 bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors">
          
        
        ✓
        መረጃዎ ደርሶናል!
        ማረጋገጫዎ በጥሩ ሁኔታ ተልኳል። ሂደቱ በጥቂት ሰዓታት ውስጥ ይጀምራል።
         setShowSuccessModal(false)} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl transition-colors text-lg shadow-lg">እሺ (OK)
      
    
  );
}
