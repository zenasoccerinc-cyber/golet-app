// src/components/CartSlideOver.js
import React from "react";
import { X, Trash2, ShoppingBag } from "lucide-react";

export default function CartSlideOver({
  showCart,
  setShowCart,
  cart,
  removeFromCart,
  calculateTotal,
  handleCheckout
}) {
  return (
    <div className={`fixed inset-0 bg-black/80 z-50 transition-opacity ${showCart ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-zinc-950 border-l border-zinc-800 shadow-2xl transform transition-transform duration-300 ${showCart ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-black text-amber-500 flex items-center gap-2"><ShoppingBag className="w-6 h-6" /> Your Cart</h2>
          <button onClick={() => setShowCart(false)} className="bg-zinc-900 p-2 rounded-full hover:bg-zinc-800 transition-colors"><X className="text-white w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <p className="text-zinc-500 text-center mt-10 font-bold">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-black p-4 rounded-xl border border-zinc-800">
                  <div>
                    <p className="text-white font-bold">{item.name}</p>
                    <p className="text-amber-500 text-sm">{item.price} Birr x {item.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="text-zinc-500 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-950">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-400 font-bold">Total</span>
            <span className="text-2xl font-black text-white">{calculateTotal()} Birr</span>
          </div>
          <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-amber-500 disabled:bg-zinc-800 text-black font-black py-4 rounded-xl shadow-lg transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
