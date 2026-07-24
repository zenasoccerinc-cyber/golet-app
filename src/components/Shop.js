import React from "react";
import { ShoppingCart, DollarSign, Edit2, Trash2 } from "lucide-react";

export default function Shop({
  customCategories,
  hiddenCategories,
  shopCategory,
  customSubCats,
  hiddenSubCategories,
  shopSubCategory,
  products,
  isVIP,
  isCEO,
  setShopCategory,
  setShopSubCategory,
  setShowCart,
  cart,
  renderOrderBanner,
  openProduct,
  handleOpenOfflineSale,
  handleEdit,
  handleDelete
}) {
  const uniquePrimary = ["ሁሉም", ...customCategories.filter(c => !hiddenCategories.includes(c))];
  const activeSubCats = shopCategory === "ሁሉም" ? [] : (customSubCats[shopCategory] || []).filter(c => !hiddenSubCategories.includes(c));
  const uniqueSecondary = ["ሁሉም", ...activeSubCats];

  let filtered = products;
  if (shopCategory !== "ሁሉም") {
    filtered = filtered.filter(p => {
      const catList = Array.isArray(p.category) ? p.category : (p.category ? [p.category] : []);
      return catList.includes(shopCategory);
    });
  }
  if (shopCategory !== "ሁሉም" && shopSubCategory !== "ሁሉም") {
    filtered = filtered.filter(p => {
      const subCatList = Array.isArray(p.subcategory) ? p.subcategory : (p.subcategory ? [p.subcategory] : []);
      return subCatList.includes(shopSubCategory);
    });
  }

  const hasVipAccess = isVIP || isCEO;

  return (
    <div className="pb-24">
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-wrap gap-2 flex-1">
          {uniquePrimary.map(cat => (
            <button key={cat} onClick={() => { setShopCategory(cat); setShopSubCategory("ሁሉም"); }} 
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${shopCategory === cat ? "bg-amber-500 text-black shadow-lg" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"}`}>
              {cat}
            </button>
          ))}
        </div>
        
        <button onClick={() => setShowCart(true)} className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl relative ml-2 shadow-lg">
          <ShoppingCart className="text-amber-500 w-5 h-5" />
          {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {renderOrderBanner && renderOrderBanner()}
      </div>

      {shopCategory !== "ሁሉም" && uniqueSecondary.length > 1 && (
        <div className="flex flex-wrap gap-2 pb-4 mb-2 mt-2">
        {uniqueSecondary.map(cat => (
          <button key={cat} onClick={() => setShopSubCategory(cat)} 
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${shopSubCategory === cat ? "bg-zinc-300 text-black" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>
            {cat}
          </button>
        ))}
      </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-1">
        {filtered.map((item) => (
          <div key={item.id} onClick={() => openProduct(item)} className="cursor-pointer group flex flex-col h-full bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors shadow-lg overflow-hidden">
            <div className="bg-white w-full h-36 flex items-center justify-center relative shadow-sm overflow-hidden">
              {isCEO && (
                <div className="absolute bottom-2 right-2 flex space-x-1 z-20">
                  <button onClick={(e) => { e.stopPropagation(); handleOpenOfflineSale(item); }} className="bg-black/80 backdrop-blur p-1.5 rounded-md text-amber-500 font-black text-[10px] flex items-center"><DollarSign size={12} className="mr-0.5"/> POS</button>
                  <button onClick={(e) => { e.stopPropagation(); handleEdit("products", item); }} className="bg-black/50 backdrop-blur p-1.5 rounded-md text-white"><Edit2 size={12}/></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete("products", item.id); }} className="bg-black/50 backdrop-blur p-1.5 rounded-md text-red-400"><Trash2 size={12}/></button>
                </div>
              )}
              {item.is_sale && <div className="absolute top-0 left-0 bg-red-600 text-white text-[9px] font-black px-2 py-1 z-10 rounded-br-lg shadow-sm">ቅናሽ</div>}
              {item.image_urls && item.image_urls.length > 0 ? (
                <img src={item.image_urls[0]} alt={item.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
              ) : <div className="text-zinc-300 text-xs font-bold">ምስል የለም</div>}
            </div>

            <div className="p-3 flex flex-col flex-grow">
              <h3 className="text-zinc-200 font-bold text-sm line-clamp-2 leading-tight mb-1">{item.name}</h3>
              <div className="mt-auto">
                {hasVipAccess ? (
                  <>
                    <p className="text-zinc-400 font-bold text-sm line-through mt-0.5">መደበኛ: {item.price} <span className="text-[10px]">ብር</span></p>
                    <p className="text-amber-500 font-black text-sm leading-none">VIP: {item.vip_price || item.price} <span className="text-[10px]">ብር</span></p>
                  </>
                ) : (
                  <>
                    <p className="text-white font-black text-sm leading-none">{item.price} <span className="text-[10px] text-zinc-400">ብር</span></p>
                    {item.vip_price && <p className="text-amber-500 font-black text-sm mt-1">VIP: {item.vip_price} <span className="text-[10px]">ብር</span></p>}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
