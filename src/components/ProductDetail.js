import React from "react";
import { ChevronLeft, ShoppingCart, DollarSign, Edit2, Trash2, Plus, Minus } from "lucide-react";

export default function ProductDetail({
  selectedProduct,
  isVIP,
  isCEO,
  cart,
  setShowCart,
  handleOpenOfflineSale,
  handleEdit,
  handleDelete,
  selectedOption,
  setSelectedOption,
  quantity,
  setQuantity,
  addToCart,
  formatOptionDisplay
}) {
  if (!selectedProduct) return null;
  const hasImages = selectedProduct.image_urls && selectedProduct.image_urls.length > 0;
  const hasVipAccess = isVIP || isCEO;

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto animate-in slide-in-from-bottom-full duration-300 pb-24">
      <div className="relative">
        <button onClick={() => window.history.back()} className="absolute top-4 left-4 bg-black/50 backdrop-blur p-2.5 rounded-full border border-zinc-800 hover:bg-zinc-800 transition-colors z-20">
          <ChevronLeft className="text-white w-6 h-6" />
        </button>
        
        <div className="absolute top-4 right-4 z-20 flex space-x-2">
           <button onClick={() => setShowCart(true)} className="bg-black/50 backdrop-blur p-2.5 rounded-full border border-zinc-800 hover:bg-zinc-800 transition-colors relative">
              <ShoppingCart className="text-white w-6 h-6" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
           </button>
        </div>

        {isCEO && (
           <div className="absolute top-4 left-16 flex space-x-2 z-20">
              <button onClick={(e) => { e.stopPropagation(); handleOpenOfflineSale(selectedProduct); }} className="bg-amber-500 text-black backdrop-blur p-2.5 rounded-full font-black text-xs shadow-lg flex items-center"><DollarSign size={16} className="mr-1"/> Log Sale</button>
              <button onClick={() => handleEdit("products", selectedProduct)} className="bg-black/50 backdrop-blur p-2.5 rounded-full border border-zinc-800 text-white"><Edit2 size={20}/></button>
              <button onClick={() => handleDelete("products", selectedProduct.id)} className="bg-black/50 backdrop-blur p-2.5 rounded-full border border-zinc-800 text-red-500"><Trash2 size={20}/></button>
           </div>
        )}

        {hasImages ? (
          <div className="relative w-full bg-white mb-4 border-b border-zinc-800 overflow-hidden">
             {selectedProduct.image_urls.length > 1 && <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white z-20 flex items-center">← Swipe →</div>}
             {selectedProduct.is_sale && <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 z-20 rounded-br-xl shadow-lg mt-14">ቅናሽ</div>}
             <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-64 w-full relative z-10">
                {selectedProduct.image_urls.map((url, idx) => (
                  <img key={idx} src={url} alt={selectedProduct.name} className="w-full h-full object-contain shrink-0 snap-center mix-blend-multiply" />
                ))}
             </div>
          </div>
        ) : (
          <div className="w-full h-64 bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800 relative">
            {selectedProduct.is_sale && <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 z-20 rounded-br-xl shadow-lg mt-14">ቅናሽ</div>}
            <span className="text-zinc-500 font-bold text-sm">ምስል የለም</span>
          </div>
        )}
      </div>

      <div className="p-4 pt-0">
        <div className="flex justify-between items-start mb-1">
          <h1 className="text-lg font-black text-white leading-tight">{selectedProduct.name}</h1>
        </div>

        <div className="mt-3 border-b border-zinc-800 pb-4">
          {hasVipAccess ? (
             <div className="flex flex-col space-y-1">
               <p className="text-zinc-400 font-black text-lg line-through decoration-red-500">መደበኛ: {selectedProduct.price} <span className="text-sm">ብር</span></p>
               <p className="text-amber-500 font-black text-lg">VIP: {selectedProduct.vip_price || selectedProduct.price} <span className="text-sm">ብር</span></p>
             </div>
          ) : (
             <div className="flex flex-col space-y-1">
               <p className="text-white font-black text-lg">{selectedProduct.price} <span className="text-sm text-zinc-400">ብር</span></p>
               {selectedProduct.vip_price && <p className="text-amber-500 font-black text-lg mt-1">VIP: {selectedProduct.vip_price} <span className="text-sm">ብር</span></p>}
             </div>
          )}
        </div>

        {selectedProduct.description && (
           <div className="mt-4 border-b border-zinc-800 pb-4">
             <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-2">ስለ እቃው (Description)</h3>
             <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedProduct.description}</p>
           </div>
        )}

        <div className="mt-4 border-b border-zinc-800 pb-4">
          {selectedProduct.options && selectedProduct.options.length > 0 && (
            <>
              <h3 className="text-white font-black text-sm mb-3">ምርጫዎትን ይጫኑ</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProduct.options.map((opt) => (
                  <button key={opt} onClick={() => setSelectedOption(opt)} className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${selectedOption === opt ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-black text-zinc-300 border-zinc-700 hover:border-amber-500/50'}`}>
                    {formatOptionDisplay(opt)}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="bg-black border border-zinc-800 rounded-xl p-3 flex justify-between items-center mb-4 mt-2">
            <span className="text-sm font-bold text-zinc-300">ብዛት (Quantity):</span>
            <div className="flex items-center space-x-4 bg-zinc-900 rounded-lg p-1 border border-zinc-700">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 text-white hover:text-amber-500"><Minus size={16} /></button>
              <span className="font-bold text-lg w-6 text-center text-amber-500">{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)} className="p-1 text-white hover:text-amber-500"><Plus size={16} /></button>
            </div>
          </div>

          <button onClick={addToCart} disabled={selectedProduct.options && selectedProduct.options.length > 0 && !selectedOption} className="w-full bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black py-4 rounded-xl text-base shadow-lg transition-colors flex items-center justify-center">
            <ShoppingCart className="mr-2" size={20} /> ወደ ጋሪ አስገባ (Add to Cart)
          </button>
        </div>
      </div>
    </div>
  );
}
