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
  ChevronRight,
  Crown,
  Users,
  PlusCircle,
  Image as ImageIcon,
  AlertCircle,
  TrendingUp,
  Package,
  Clock,
  Truck,
  Globe2,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// SECURE CONNECTION: Pulling from your .env vault
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// SECURE TELEGRAM CREDENTIALS: Pulling from your .env vault
const ORDERS_BOT_TOKEN = process.env.REACT_APP_ORDERS_BOT_TOKEN;
const APP_BOT_TOKEN = process.env.REACT_APP_APP_BOT_TOKEN;
const CHAT_ID = process.env.REACT_APP_CHAT_ID;

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
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.vipUntil && new Date(parsedUser.vipUntil) < new Date()) {
        parsedUser.isVIP = false;
      }
      return parsedUser;
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState("ዜና");
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isCEO, setIsCEO] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [expandedProducts, setExpandedProducts] = useState({});

  const [newsCategory, setNewsCategory] = useState("ዋና");
  const [newsLimit, setNewsLimit] = useState(10);
  const newsCategories = ["ዋና", "አስተያየት", "ማህበራዊ", "ያግኙን"];

  const [sportCategory, setSportCategory] = useState("የዝውውር ዜና");
  const sportCategories = ["የዝውውር ዜና"];

  // PRIMARY & SECONDARY NESTED NAVIGATION STATES
  const [shopCategory, setShopCategory] = useState("ሁሉም");
  const [shopSubCategory, setShopSubCategory] = useState("ሁሉም");

  const shopCategories = ["ሁሉም", "ወንዶች", "ሴቶች", "ልጆች", "መድሃኒት", "ሌላ"];
  const shopSubCategories = ["ሁሉም", "ልብሶች", "ጫማዎች", "ሌላ"];

  // CUSTOM SOURCING STATES
  const [showSourcingModal, setShowSourcingModal] = useState(false);
  const [sourcingLink, setSourcingLink] = useState("");

  // GLOBAL CHECKOUT STATES
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeProductImageIndex, setActiveProductImageIndex] = useState(0);
  const [orderDestination, setOrderDestination] = useState("local");
  const [orderName, setOrderName] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [orderPhone, setOrderPhone] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [orderShipping, setOrderShipping] = useState("local_delivery");
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // VIP ORDER STATE
  const [vipPhone, setVipPhone] = useState("");
  const [vipReceipt, setVipReceipt] = useState(null);
  const [isSubmittingVip, setIsSubmittingVip] = useState(false);

  // PREDICTION STATES
  const [teamAScore, setTeamAScore] = useState("");
  const [teamBScore, setTeamBScore] = useState("");
  const [predictionStatus, setPredictionStatus] = useState("idle");
  const [existingPrediction, setExistingPrediction] = useState(null);

  const [leaderboard, setLeaderboard] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  // DASHBOARD STATES
  const [myOrders, setMyOrders] = useState([]);
  const [userJoinedDate, setUserJoinedDate] = useState(null);

  const [news, setNews] = useState([]);
  const [gossip, setGossip] = useState([]);
  const [products, setProducts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // ADMIN FILE UPLOAD STATES
  const [adminTab, setAdminTab] = useState("news");
  const [formData, setFormData] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [teamAImageFile, setTeamAImageFile] = useState(null);
  const [teamBImageFile, setTeamBImageFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const resetShopFilters = (primaryCat) => {
    setShopCategory(primaryCat);
    setShopSubCategory("ሁሉም");
  };

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
    const { data: prData = [] } = await supabase
      .from("predictions")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    const { data: oData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (nData) setNews(nData);
    if (gData) setGossip(gData);
    if (pData) setProducts(pData);
    if (prData) setPredictions(prData);
    if (oData) setOrders(oData);
  };

  const handleLogoTap = () => {
    navigateHome();
    const newCount = tapCount + 1;
    setTapCount(newCount);
    setTimeout(() => setTapCount(0), 3000);
    if (newCount >= 5) {
      const password = window.prompt("CEO Password:");
      if (password === "admin123") {
        setIsCEO(true);
        alert("CEO Mode Activated");
      }
      setTapCount(0);
    }
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "ዜና") {
      setNewsCategory("ዋና");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRealLogin = async (telegramUser) => {
    const userIdString = telegramUser.id.toString();
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userIdString)
      .single();
    let currentUser;
    if (data) {
      let currentlyValidVIP = false;
      if (data.is_vip && data.vip_until) {
        currentlyValidVIP = new Date(data.vip_until) > new Date();
        if (!currentlyValidVIP)
          await supabase
            .from("users")
            .update({ is_vip: false })
            .eq("id", userIdString);
      }
      currentUser = {
        id: data.id,
        name: data.name,
        isVIP: currentlyValidVIP,
        vipUntil: data.vip_until,
      };
    } else {
      const newUser = {
        id: userIdString,
        name: telegramUser.first_name,
        is_vip: false,
        total_points: 0,
      };
      await supabase.from("users").insert([newUser]);
      currentUser = {
        id: newUser.id,
        name: newUser.name,
        isVIP: false,
        vipUntil: null,
      };
    }
    setUser(currentUser);
    localStorage.setItem("goleth_user", JSON.stringify(currentUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("goleth_user");
    setShowProfile(false);
    setIsCEO(false);
    navigateHome();
  };

  const handleDelete = async (table, id) => {
    if (window.confirm("Are you sure?")) {
      await supabase.from(table).delete().eq("id", id);
      fetchData();
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let finalImageUrl = formData.image_url || null;

    if (imageFiles && imageFiles.length > 0) {
      const uploadedUrls = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileName = `${Date.now()}_${i}.${file.name.split(".").pop()}`;
        const { error } = await supabase.storage
          .from("images")
          .upload(fileName, file);
        if (!error)
          uploadedUrls.push(
            supabase.storage.from("images").getPublicUrl(fileName).data
              .publicUrl
          );
      }
      finalImageUrl = uploadedUrls.join(",");
    }

    const payload = {
      name: formData.title,
      body: formData.body,
      price: Number(formData.price),
      category: formData.category, // e.g. "ወንዶች", "ሴቶች"
      image_url: finalImageUrl,
      is_vip_only: formData.is_vip_only || false,
      brand: formData.brand || null,
      sizes: formData.sizes || null,
      stock_status: formData.stock_status || "In Stock",
      highlight_tag: formData.highlight_tag || null,
    };

    try {
      let error;
      if (editingId) {
        const res = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingId);
        error = res.error;
      } else {
        const res = await supabase.from("products").insert([payload]);
        error = res.error;
      }

      if (error) alert(error.message);
      else {
        closeAdmin();
        fetchData();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const renderShop = () => {
    // 1. First layer filter: Filter by Primary Category (ወንዶች, ሴቶች, etc.)
    let initialFiltered =
      shopCategory === "ሁሉም"
        ? products
        : products.filter((p) => p.category === shopCategory);

    // 2. Second layer filter: Filter by Sub-category tags (ልብሶች, ጫማዎች) inside product body/attributes
    const finalFiltered =
      shopSubCategory === "ሁሉም"
        ? initialFiltered
        : initialFiltered.filter((p) => {
            const bodyText = (p.body || "").toLowerCase();
            const nameText = (p.name || "").toLowerCase();

            if (shopSubCategory === "ልብሶች") {
              return (
                bodyText.includes("cloth") ||
                bodyText.includes("jersey") ||
                bodyText.includes("t-shirt") ||
                bodyText.includes("ልብስ") ||
                nameText.includes("shirt")
              );
            }
            if (shopSubCategory === "ጫማዎች") {
              return (
                bodyText.includes("shoe") ||
                bodyText.includes("sneaker") ||
                bodyText.includes("ጫማ") ||
                nameText.includes("shoe")
              );
            }
            return true;
          });

    return (
      <div className="pb-24 pt-2">
        {/* Layer 1 Navigation (Primary Tabs) */}
        <div className="flex overflow-x-auto space-x-2 mb-3 pb-2 scrollbar-hide">
          {shopCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => resetShopFilters(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                shopCategory === cat
                  ? "bg-amber-500 text-black shadow-lg"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Layer 2 Nested Sub-Navigation (Only displays when browsing Men/Women/Kids sections) */}
        {(shopCategory === "ወንዶች" ||
          shopCategory === "ሴቶች" ||
          shopCategory === "ልጆች") && (
          <div className="flex overflow-x-auto space-x-2 mb-4 pb-2 scrollbar-hide bg-zinc-950 p-1.5 border border-zinc-900 rounded-xl animate-fadeIn">
            {shopSubCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setShopSubCategory(sub)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  shopSubCategory === sub
                    ? "bg-zinc-800 text-amber-500 border border-amber-500/20"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowSourcingModal(true)}
          className="w-full mb-5 flex items-center justify-center space-x-2 bg-amber-500/5 border border-amber-500/20 text-amber-500 font-black py-2.5 px-4 rounded-xl text-xs tracking-wide transition-colors"
        >
          <PlusCircle size={15} />
          <span>የግል እቃ ይዘዙ (Custom Sourcing Request)</span>
        </button>

        {/* Enterprise Grade 2-Column Product Layout Matrix */}
        <div className="grid grid-cols-2 gap-3">
          {finalFiltered.map((item) => {
            const productImages = item.image_url
              ? item.image_url.split(",")
              : [];
            const mainImg = productImages[0];
            const isVipOnly = item.is_vip_only;
            const canBuy = !isVipOnly || (user && user.isVIP) || isCEO;

            return (
              <div
                key={item.id}
                className={`bg-zinc-900/40 border rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm relative ${
                  isVipOnly ? "border-amber-500/20" : "border-zinc-800/50"
                }`}
              >
                {/* Floating Promotional Badges */}
                {item.highlight_tag && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded shadow z-10 uppercase tracking-widest scale-90">
                    {item.highlight_tag}
                  </div>
                )}

                {isCEO && (
                  <div className="absolute top-2 right-2 flex space-x-1 z-10 bg-black/70 p-1 rounded-md">
                    <button
                      onClick={() => handleEdit(item, "products")}
                      className="p-0.5"
                    >
                      <Edit size={12} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete("products", item.id)}
                      className="p-0.5"
                    >
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </div>
                )}

                {/* Card Top Block: Pure Clean Image Canvas without layout collision */}
                <div className="bg-black/10 aspect-square w-full flex items-center justify-center p-3 relative mt-1">
                  {mainImg ? (
                    <img
                      src={mainImg}
                      className="max-w-full max-h-full object-contain mix-blend-lighten rounded-md"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-950 rounded-lg"></div>
                  )}
                </div>

                {/* Card Details Block: Nested completely beneath the image layer */}
                <div className="p-3 pt-2 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex justify-between items-center gap-1 mb-0.5">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider truncate max-w-[80px]">
                        {item.brand || "Goleth"}
                      </span>
                      {isVipOnly && (
                        <span className="text-[8px] text-amber-400 font-extrabold">
                          VIP
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-black text-xs leading-tight line-clamp-2 h-8">
                      {item.name}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {/* Size metadata chips */}
                    {item.sizes && (
                      <div className="flex gap-1 overflow-x-auto scrollbar-hide py-0.5">
                        {item.sizes
                          .split(",")
                          .slice(0, 3)
                          .map((s, idx) => (
                            <span
                              key={idx}
                              className="bg-zinc-950 text-zinc-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-zinc-800/80 shrink-0"
                            >
                              {s.trim()}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Pricing Grid Node */}
                    <div className="flex items-baseline gap-1">
                      {user && user.isVIP ? (
                        <>
                          <span className="text-amber-500 font-black text-sm">
                            {Math.round(item.price * 0.9)} ብር
                          </span>
                          <span className="text-zinc-600 line-through text-[9px] font-bold">
                            {item.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-amber-500 font-black text-sm">
                          {item.price} ብር
                        </span>
                      )}
                    </div>

                    {/* Action Conversion Trigger */}
                    {canBuy ? (
                      <button
                        onClick={() => setSelectedProduct(item)}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-1.5 rounded-xl text-[10px] tracking-wide transition-all duration-150 transform active:scale-95"
                      >
                        እዘዝ
                      </button>
                    ) : (
                      <button
                        onClick={() => handleNavClick("ቪአይፒ")}
                        className="w-full bg-zinc-900 text-amber-500/70 border border-amber-500/10 font-bold py-1.5 rounded-xl text-[9px] tracking-wide flex items-center justify-center gap-1"
                      >
                        <Lock size={9} /> VIP ብቻ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black font-sans text-white">
      <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 p-4 flex justify-between items-center">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={handleLogoTap}
        >
          <h1 className="text-white font-black text-2xl tracking-widest">
            GOL<span className="text-amber-500">ETH</span>
          </h1>
        </div>
        <div>
          {user ? (
            <div
              onClick={() => setShowProfile(true)}
              className="bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800 cursor-pointer text-xs font-bold flex items-center gap-2"
            >
              <div className="w-5 h-5 bg-amber-500 rounded-full text-black flex items-center justify-center font-black uppercase">
                {user.name.charAt(0)}
              </div>
              {user.name}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick("ቪአይፒ")}
              className="text-xs font-bold bg-[#229ED9] px-4 py-2 rounded-full text-white"
            >
              ይግቡ / ይመዝገቡ
            </button>
          )}
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto pb-32 relative">
        {activeTab === "ዜና" && renderShop()}{" "}
        {/* Defaulting feed view directly into catalog nodes */}
        {activeTab === "ሱቅ" && renderShop()}
      </main>

      <nav className="fixed bottom-0 w-full bg-zinc-950/95 border-t border-zinc-800 flex justify-around pb-6 pt-3 px-2 z-40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.id || (tab.id === "ዜና" && activeTab === "ዜና");
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`flex flex-col items-center p-2 ${
                isActive ? "text-amber-500" : "text-white/90"
              }`}
            >
              <Icon size={24} className="mb-1.5" />
              <span className="text-[11px] font-bold">{tab.id}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
