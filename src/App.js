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

const YOUR_TELEGRAM_USERNAME = "contactgoleth";
const BOT_TOKEN = "8719677143:AAFUxNqRg8PzU1XrsPritRHR0L6ziuD5Vqc";
const CHAT_ID = "813725953";

const TelegramLoginWidget = ({ onAuth }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    window.onTelegramAuth = (user) => onAuth(user);
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "goleth_app_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;
    if (containerRef.current) containerRef.current.appendChild(script);
    return () => {
      delete window.onTelegramAuth;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [onAuth]);
  return (
    <div ref={containerRef} className="flex justify-center mt-4 w-full"></div>
  );
};

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("goleth_user");
    if (savedUser) return JSON.parse(savedUser);
    return null;
  });

  const [activeTab, setActiveTab] = useState("ዜና");
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isCEO, setIsCEO] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [newsCategory, setNewsCategory] = useState("ዋና");
  const [newsLimit, setNewsLimit] = useState(10);
  const newsCategories = ["ዋና", "አስተያየት", "ማህበራዊ", "ያግኙን"];
  const [sportCategory, setSportCategory] = useState("የዝውውር ዜና");
  const sportCategories = ["የዝውውር ዜና"];
  const [shopCategory, setShopCategory] = useState("ሁሉም");
  const shopCategories = ["ሁሉም", "Men", "Women", "Kids", "Medicine", "Other"];
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderShipping, setOrderShipping] = useState("local");
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [news, setNews] = useState([]);
  const [gossip, setGossip] = useState([]);
  const [products, setProducts] = useState([]);
  const [adminTab, setAdminTab] = useState("news");
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: nData } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    const { data: gData } = await supabase
      .from("gossip")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    const { data: pData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (nData) setNews(nData);
    if (gData) setGossip(gData);
    if (pData) setProducts(pData);
  };

  const handleEdit = (item = null, table) => {
    setAdminTab(table);
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title || item.name || "",
        subtitle: item.subtitle || "",
        body: item.body || "",
        price: item.price || "",
        category: item.category || "ዋና",
        image_url: item.image_url || null,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        subtitle: "",
        body: "",
        price: "",
        category: "ዋና",
        image_url: null,
      });
    }
    setShowAdmin(true);
  };

  const closeAdmin = () => {
    setShowAdmin(false);
    setEditingId(null);
    setFormData({});
    setImageFile(null);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let finalImageUrl = formData.image_url;
    if (imageFile) {
      const fileName = `${Date.now()}.${imageFile.name.split(".").pop()}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, imageFile);
      if (!error)
        finalImageUrl = supabase.storage.from("images").getPublicUrl(fileName)
          .data.publicUrl;
    }
    const payload = {};
    if (["news", "gossip"].includes(adminTab))
      Object.assign(payload, {
        title: formData.title,
        subtitle: formData.subtitle,
        body: formData.body,
        category: formData.category,
        image_url: finalImageUrl,
      });
    else if (adminTab === "products")
      Object.assign(payload, {
        name: formData.title,
        body: formData.body,
        price: Number(formData.price),
        category: formData.category,
        image_url: finalImageUrl,
      });

    if (editingId)
      await supabase.from(adminTab).update(payload).eq("id", editingId);
    else await supabase.from(adminTab).insert([payload]);
    closeAdmin();
    setUploading(false);
    fetchData();
  };

  const handleBotOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderReceipt) {
      alert("እባክዎ ደረሰኝ ይስቀሉ");
      return;
    }
    setIsSubmittingOrder(true);
    const total =
      (user?.isVIP ? selectedProduct.price * 0.9 : selectedProduct.price) +
      (orderShipping === "local" ? 150 : 500);
    const captionText = `🚨 *New Order: ${selectedProduct.name}*\n👤 *${orderName}*\n📞 *${orderPhone}*\n💰 *${total} ETB*`;
    const formPayload = new FormData();
    formPayload.append("chat_id", CHAT_ID);
    formPayload.append("photo", orderReceipt);
    formPayload.append("caption", captionText);
    formPayload.append("parse_mode", "Markdown");
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: formPayload,
      });
      alert("ትዕዛዝ ተልኳል!");
      setSelectedProduct(null);
    } catch (error) {
      alert("ስህተት!");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US");

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black font-sans text-white">
      <style>{` body, html { background-color: black; } `}</style>
      <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 p-4 flex justify-between items-center">
        <h1
          className="text-white font-black text-2xl cursor-pointer"
          onClick={() => setActiveTab("ዜና")}
        >
          GOL<span className="text-amber-500">ETH</span>
        </h1>
        {isCEO ? (
          <button
            onClick={() => handleEdit(null, "news")}
            className="text-amber-500"
          >
            <PlusCircle size={24} />
          </button>
        ) : (
          <button
            onClick={() => setActiveTab("ቪአይፒ")}
            className="text-xs font-bold bg-[#229ED9] px-4 py-2 rounded-full text-white"
          >
            ይግቡ
          </button>
        )}
      </header>

      <main className="p-4 max-w-lg mx-auto pb-32">
        {activeTab === "ዜና" && (
          <div className="pb-24">
            <div className="flex overflow-x-auto space-x-2 mb-4 pb-2 scrollbar-hide">
              {newsCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewsCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    newsCategory === cat
                      ? "bg-amber-500 text-black"
                      : "bg-zinc-800 text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {news
              .filter(
                (n) => newsCategory === "ዋና" || n.category === newsCategory
              )
              .map((item, i) => (
                <div
                  key={item.id}
                  className="bg-zinc-900 rounded-xl p-4 mb-3 border border-zinc-800"
                >
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <span className="text-zinc-500 text-[10px]">
                    {formatDate(item.created_at)}
                  </span>
                </div>
              ))}
          </div>
        )}
        {activeTab === "ሱቅ" && (
          <div className="space-y-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"
              >
                <h3 className="text-white font-black text-lg">{p.name}</h3>
                <button
                  onClick={() => setSelectedProduct(p)}
                  className="bg-amber-500 text-black px-4 py-2 rounded mt-2"
                >
                  እዘዝ
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-zinc-950 border-t border-zinc-800 flex justify-around pb-6 pt-3 z-40">
        {[
          { id: "ዜና", icon: Home },
          { id: "ስፖርት", icon: Trophy },
          { id: "ቪአይፒ", icon: Crown },
          { id: "ሱቅ", icon: ShoppingBag },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center ${
              activeTab === tab.id ? "text-amber-500" : "text-white/90"
            }`}
          >
            <tab.icon size={24} />
            <span className="text-[10px] font-bold">{tab.id}</span>
          </button>
        ))}
      </nav>
      {showAdmin && renderCEOStudio()}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90">
          <form
            onSubmit={handleBotOrderSubmit}
            className="bg-zinc-900 p-6 rounded-xl w-full max-w-sm"
          >
            <h2 className="text-white font-black mb-4">ማዘዣ ቅጽ</h2>
            <input
              required
              placeholder="ስም"
              onChange={(e) => setOrderName(e.target.value)}
              className="w-full bg-black p-3 mb-2 text-white border border-zinc-700"
            />
            <input
              required
              placeholder="ስልክ"
              onChange={(e) => setOrderPhone(e.target.value)}
              className="w-full bg-black p-3 mb-4 text-white border border-zinc-700"
            />
            <input
              type="file"
              onChange={(e) => setOrderReceipt(e.target.files[0])}
              className="text-white mb-4"
            />
            <button className="w-full bg-amber-500 text-black font-black py-3 rounded">
              ላክ
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
