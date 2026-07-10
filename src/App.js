import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Trophy,
  Flame,
  Target,
  ShoppingBag,
  X,
  Trash2,
  Edit,
  Loader2,
  CheckCircle2,
  LogOut,
  Lock,
  Crown,
  Users,
  PlusCircle,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cklchptjwcifydboozls.supabase.co";
const supabaseKey = "sb_publishable_Eq6KwixhAMAO42Zp3SEJVg_ed9fsVj3";
const supabase = createClient(supabaseUrl, supabaseKey);

const BOT_TOKEN = "8719677143:AAFUxNqRg8PzU1XrsPritRHR0L6ziuD5Vqc";
const CHAT_ID = "813725953";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("goleth_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState("ዜና");
  const [news, setNews] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [adminTab, setAdminTab] = useState("news");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: nData } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: pData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (nData) setNews(nData);
    if (pData) setProducts(pData);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let url = formData.image_url;
    if (imageFile) {
      const { data } = await supabase.storage
        .from("images")
        .upload(`${Date.now()}.png`, imageFile);
      url = supabase.storage.from("images").getPublicUrl(data.path)
        .data.publicUrl;
    }
    const payload =
      adminTab === "products"
        ? {
            name: formData.title,
            body: formData.body,
            price: Number(formData.price),
            category: formData.category,
            image_url: url,
          }
        : {
            title: formData.title,
            body: formData.body,
            category: formData.category,
            image_url: url,
          };
    await supabase.from(adminTab).insert([payload]);
    setShowAdmin(false);
    fetchData();
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      <header className="sticky top-0 bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center z-50">
        <h1 className="text-2xl font-black text-white">
          GOL<span className="text-amber-500">ETH</span>
        </h1>
        <button onClick={() => setShowAdmin(true)} className="text-amber-500">
          <PlusCircle />
        </button>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {activeTab === "ዜና" &&
          news.map((n) => (
            <div
              key={n.id}
              className="bg-zinc-900 rounded-xl overflow-hidden mb-4 border border-zinc-800"
            >
              {n.image_url && (
                <img
                  src={n.image_url}
                  className="w-full h-48 object-cover"
                  alt={n.title}
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg">{n.title}</h3>
                <p className="text-zinc-400 text-sm">{n.body}</p>
              </div>
            </div>
          ))}
        {activeTab === "ሱቅ" &&
          products.map((p) => (
            <div
              key={p.id}
              className="bg-zinc-900 rounded-xl p-4 mb-4 border border-zinc-800"
            >
              {p.image_url && (
                <img
                  src={p.image_url}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                  alt={p.name}
                />
              )}
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-amber-500 font-black">{p.price} ብር</p>
              <button
                onClick={() => setSelectedProduct(p)}
                className="w-full bg-amber-500 text-black font-bold py-2 rounded-lg mt-3"
              >
                እዘዝ (Order)
              </button>
            </div>
          ))}
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6">
          <div className="bg-zinc-900 w-full max-w-sm p-6 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-white mb-4"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">ማዘዣ ቅጽ (Order Form)</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                /* Logic to send to TG */ alert("Sending...");
                setSelectedProduct(null);
              }}
              className="space-y-4"
            >
              <input
                required
                placeholder="ስም (Full Name)"
                className="w-full bg-black p-3 border border-zinc-700"
              />
              <input
                required
                placeholder="ስልክ (Phone)"
                className="w-full bg-black p-3 border border-zinc-700"
              />
              <input type="file" required className="w-full" />
              <button className="w-full bg-amber-500 text-black py-3 rounded-lg font-bold">
                ላክ (Submit)
              </button>
            </form>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 w-full bg-zinc-950 p-4 flex justify-around border-t border-zinc-800">
        {[
          { id: "ዜና", icon: Home },
          { id: "ስፖርት", icon: Trophy },
          { id: "ሱቅ", icon: ShoppingBag },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex flex-col items-center ${
              activeTab === t.id ? "text-amber-500" : "text-white"
            }`}
          >
            <t.icon size={24} />
            <span className="text-[10px] font-bold">{t.id}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
