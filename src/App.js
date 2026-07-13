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

// SECURE TELEGRAM CREDENTIALS
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

  const [activeTab, setActiveTab] = useState("ሱቅ");
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
  const [countryCode, setCountryCode] = useState("+251");
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

  const tabs = [
    { id: "ዜና", icon: Home },
    { id: "ስፖርት", icon: Trophy },
    { id: "ሹክሹክታ", icon: Flame },
    { id: "ቪአይፒ", icon: Crown },
    { id: "ሱቅ", icon: ShoppingBag },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user && predictions.length > 0) {
      checkExistingPrediction(predictions[0].id);
      fetchUserPoints();
    }
  }, [user, predictions]);

  useEffect(() => {
    if (showProfile && user) {
      fetchMyProfileData();
    }
  }, [showProfile, user]);

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

  const fetchMyProfileData = async () => {
    const { data: myOrderData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (myOrderData) setMyOrders(myOrderData);

    const { data: uData } = await supabase
      .from("users")
      .select("created_at")
      .eq("id", user.id)
      .single();
    if (uData) setUserJoinedDate(uData.created_at);
  };

  const fetchUserPoints = async () => {
    const { data } = await supabase
      .from("users")
      .select("total_points")
      .eq("id", user.id)
      .single();
    if (data) setTotalPoints(data.total_points);
  };

  const checkExistingPrediction = async (matchId) => {
    const { data } = await supabase
      .from("user_predictions")
      .select("*")
      .eq("user_id", user.id)
      .eq("match_id", matchId)
      .single();
    if (data) setExistingPrediction(data);
  };

  const navigateHome = () => {
    setActiveTab("ሱቅ");
    setShopCategory("ሁሉም");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      category: formData.category,
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

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    fetchData();
  };

  const handleEdit = (item = null, table) => {
    setAdminTab(table || "news");
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title || item.name || "",
        subtitle: item.subtitle || "",
        author: item.author || "",
        body: item.body || "",
        price: item.price || "",
        category: item.category || "ዋና",
        image_url: item.image_url || null,
        is_vip_only: item.is_vip_only || false,
        brand: item.brand || "",
        sizes: item.sizes || "",
        stock_status: item.stock_status || "In Stock",
        highlight_tag: item.highlight_tag || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        subtitle: "",
        author: "Goleth",
        body: "",
        price: "",
        category: "ዋና",
        image_url: null,
        is_vip_only: false,
        brand: "",
        sizes: "",
        stock_status: "In Stock",
        highlight_tag: "",
      });
    }
    setShowAdmin(true);
  };

  const closeAdmin = () => {
    setShowAdmin(false);
    setEditingId(null);
    setFormData({});
    setImageFiles([]);
  };

  const handleBotOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderReceipt) {
      alert("እባክዎ የክፍያ ደረሰኝዎን ያስገቡ");
      return;
    }
    setIsSubmittingOrder(true);
    let basePrice = selectedProduct.price;
    if (user && user.isVIP) basePrice = selectedProduct.price * 0.9;

    let shippingCost = orderShipping === "local_delivery" ? 150 : 500;
    if (orderDestination === "international") {
      shippingCost = user && user.isVIP ? 0 : 750;
    }
    const total = basePrice + shippingCost;
    const finalPhone =
      orderDestination === "local"
        ? orderPhone
        : `${countryCode} ${orderPhone} (Receiver: ${receiverPhone})`;

    try {
      const orderPayload = {
        user_id: user ? user.id : null,
        customer_name: orderName,
        phone: finalPhone,
        product_name: selectedProduct.name,
        total_price: total,
        shipping_method:
          orderDestination === "local" ? orderShipping : "Diaspora Delivery",
        status: "Pending",
      };
      await supabase.from("orders").insert([orderPayload]);
      alert("ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል!");
      setSelectedProduct(null);
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const toggleProductReadMore = (id) =>
    setExpandedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleReadMore = (id) =>
    setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderProfileDashboard = () => (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/90 p-0 sm:p-4">
      <div className="bg-zinc-950 w-full sm:max-w-2xl h-[90vh] sm:h-[80vh] rounded-t-3xl sm:rounded-2xl border-t sm:border border-zinc-800 flex flex-col relative overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="bg-zinc-900 border-b border-zinc-800 p-6 relative">
          <button
            onClick={() => setShowProfile(false)}
            className="absolute top-6 right-6 text-zinc-500 hover:text-white bg-black p-2 rounded-full border border-zinc-800"
          >
            <X size={20} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-2xl font-black text-black shadow-lg uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{user.name}</h2>
              <span className="bg-amber-500/20 text-amber-500 text-xs font-black px-3 py-1 rounded-full border border-amber-500/30 mt-1 inline-block">
                {user.isVIP ? "VIP Active" : "Free Account"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-black">
          <h3 className="text-white font-black text-lg mb-4">
            My Order Tracking
          </h3>
          {myOrders.length === 0 ? (
            <p className="text-zinc-500 text-sm font-bold">
              You haven't placed any orders yet.
            </p>
          ) : (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center"
                >
                  <div>
                    <span className="text-white font-bold text-sm block">
                      {order.product_name}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      {order.shipping_method}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-wider ${getStatusColor(
                      order.status || "Pending"
                    )}`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-zinc-900 border-t border-zinc-800 p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-900/10 border border-red-900/30 text-red-500 py-4 rounded-xl font-black flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "text-orange-500 bg-orange-500/10 border-orange-500/30";
      case "Out for Delivery":
        return "text-blue-500 bg-blue-500/10 border-blue-500/30";
      case "Completed":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      default:
        return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    }
  };

  const renderCEOStudio = () => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total_price || 0),
      0
    );
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 overflow-y-auto">
        <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 p-6 shadow-2xl relative my-8">
          <button
            onClick={closeAdmin}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-black text-amber-500 mb-6">
            {editingId ? "Edit" : "CEO Studio"}
          </h2>
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                Product Name
              </label>
              <input
                required
                type="text"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                  Brand / Origin
                </label>
                <input
                  type="text"
                  placeholder="Gillette, Nike"
                  value={formData.brand || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                  Highlight Tag
                </label>
                <input
                  type="text"
                  placeholder="Free Delivery"
                  value={formData.highlight_tag || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, highlight_tag: e.target.value })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                  Sizes / Options
                </label>
                <input
                  type="text"
                  placeholder="S, M, L, 108g"
                  value={formData.sizes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, sizes: e.target.value })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                  Category
                </label>
                <select
                  value={formData.category || "ወንዶች"}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm"
                >
                  <option value="ወንዶች">ወንዶች (Men)</option>
                  <option value="ሴቶች">ሴቶች (Women)</option>
                  <option value="ልጆች">ልጆች (Kids)</option>
                  <option value="መድሃኒት">መድሃኒት (Pharmacy)</option>
                  <option value="ሌላ">ሌላ (Other)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                Description
              </label>
              <textarea
                rows="3"
                value={formData.body || ""}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
              ></textarea>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                Price (ETB)
              </label>
              <input
                required
                type="number"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
              />
            </div>
            <div className="mt-4">
              <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                Select Images
              </label>
              <div className="flex items-center space-x-4 bg-black border border-zinc-800 rounded-lg p-3">
                <ImageIcon size={20} className="text-amber-500" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(Array.from(e.target.files))}
                  className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-amber-500 text-black font-black py-4 rounded-xl mt-4"
            >
              {uploading ? "Publishing..." : "Publish"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderShop = () => {
    // BUG FIX 1: Safely catching both Old English database tags and New Amharic ones
    let initialFiltered = products;
    if (shopCategory !== "ሁሉም") {
      initialFiltered = products.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        if (shopCategory === "ወንዶች")
          return cat.includes("ወንድ") || cat === "men" || cat === "men's";
        if (shopCategory === "ሴቶች")
          return cat.includes("ሴት") || cat === "women" || cat === "women's";
        if (shopCategory === "ልጆች")
          return cat.includes("ልጅ") || cat === "kids" || cat === "children";
        if (shopCategory === "መድሃኒት")
          return (
            cat.includes("መድሃኒት") ||
            cat.includes("med") ||
            cat.includes("pharm")
          );
        return p.category === shopCategory;
      });
    }

    // Core Sub-tab filtering logic
    const finalFiltered =
      shopSubCategory === "ሁሉም"
        ? initialFiltered
        : initialFiltered.filter((p) => {
            const bodyText = (p.body || "").toLowerCase();
            const nameText = (p.name || "").toLowerCase();
            if (shopSubCategory === "ልብሶች")
              return (
                bodyText.includes("cloth") ||
                bodyText.includes("jersey") ||
                bodyText.includes("t-shirt") ||
                bodyText.includes("ልብስ") ||
                bodyText.includes("ቀሚስ") ||
                nameText.includes("shirt") ||
                nameText.includes("ልብስ")
              );
            if (shopSubCategory === "ጫማዎች")
              return (
                bodyText.includes("shoe") ||
                bodyText.includes("sneaker") ||
                bodyText.includes("ጫማ") ||
                bodyText.includes("ቦቲ") ||
                nameText.includes("shoe") ||
                nameText.includes("ጫማ")
              );
            return true;
          });

    return (
      <div className="pb-24 pt-2">
        {/* Layer 1 Tabs */}
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

        {/* BUG FIX 2: Better UI for Sub-Tabs so they don't get missed visually */}
        {(shopCategory === "ወንዶች" ||
          shopCategory === "ሴቶች" ||
          shopCategory === "ልጆች") && (
          <div className="flex overflow-x-auto space-x-2 mb-5 pb-2 scrollbar-hide bg-zinc-900/50 p-2 border border-zinc-800/80 rounded-xl shadow-inner">
            <span className="text-[10px] text-zinc-500 font-bold my-auto mr-1 uppercase">
              Filter:
            </span>
            {shopSubCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setShopSubCategory(sub)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                  shopSubCategory === sub
                    ? "bg-amber-500 text-black shadow-md scale-105"
                    : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Custom Sourcing Button */}
        <button
          onClick={() => setShowSourcingModal(true)}
          className="w-full mb-5 flex items-center justify-center space-x-2 bg-amber-500/5 border border-amber-500/20 text-amber-500 font-black py-2.5 px-4 rounded-xl text-xs tracking-wide transition-colors"
        >
          <PlusCircle size={15} />
          <span>የግል እቃ ይዘዙ (Custom Sourcing Request)</span>
        </button>

        {/* Empty State Fallback (If a category has no matching products) */}
        {finalFiltered.length === 0 && (
          <div className="py-10 flex flex-col items-center justify-center text-center bg-zinc-900/20 border border-zinc-800/50 rounded-2xl border-dashed">
            <ShoppingBag size={32} className="text-zinc-600 mb-3" />
            <p className="text-zinc-400 font-bold text-sm">ምንም እቃ አልተገኘም</p>
            <p className="text-zinc-600 text-xs mt-1">
              No products found in this category.
            </p>
          </div>
        )}

        {/* High Converting Typography Grid Matrix */}
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
                className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm relative"
              >
                {/* Floating Tag */}
                {item.highlight_tag && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded shadow z-10 uppercase tracking-widest">
                    {item.highlight_tag}
                  </div>
                )}

                {/* Admin controls */}
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

                {/* TOP BLOCK: Title and Metadata absolutely separated from image */}
                <div className="p-3 pb-2 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider truncate">
                      {item.brand || "Goleth"}
                    </span>
                    {isVipOnly && (
                      <span className="text-[8px] bg-amber-500/20 text-amber-500 px-1 py-0.5 rounded font-black">
                        VIP ONLY
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-black text-sm leading-tight line-clamp-2 min-h-[35px]">
                    {item.name}
                  </h3>
                </div>

                {/* MIDDLE BLOCK: Crisp clean image canvas */}
                <div className="bg-black/20 aspect-square w-full flex items-center justify-center p-3 border-y border-zinc-800/30">
                  {mainImg ? (
                    <img
                      src={mainImg}
                      className="max-w-full max-h-full object-contain"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-950 rounded-lg"></div>
                  )}
                </div>

                {/* BOTTOM BLOCK: Interactions */}
                <div className="p-3 pt-2 flex flex-col gap-2.5">
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

                  {canBuy ? (
                    <button
                      onClick={() => {
                        setSelectedProduct(item);
                        setActiveProductImageIndex(0);
                        setOrderDestination("local");
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-2 rounded-xl text-[10px] tracking-wide transition-all duration-150 transform active:scale-95"
                    >
                      እዘዝ
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick("ቪአይፒ")}
                      className="w-full bg-zinc-900 text-amber-500/70 border border-amber-500/10 font-bold py-2 rounded-xl text-[9px] tracking-wide flex items-center justify-center gap-1"
                    >
                      <Lock size={9} /> VIP ብቻ
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  let vipDaysLeft = 0;
  let showVipWarning = false;
  if (user && user.isVIP && user.vipUntil) {
    vipDaysLeft = Math.ceil(
      (new Date(user.vipUntil) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (vipDaysLeft <= 7 && vipDaysLeft > 0) showVipWarning = true;
  }

  const currentOrderImages =
    selectedProduct && selectedProduct.image_url
      ? selectedProduct.image_url.split(",")
      : [];

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black font-sans text-white">
      {showVipWarning && (
        <div
          className="bg-amber-500 text-black px-4 py-2 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          onClick={() => handleNavClick("ቪአይፒ")}
        >
          <AlertTriangle size={16} /> Your VIP expires in {vipDaysLeft} days!
          Renew now to keep benefits.
        </div>
      )}

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

      {showProfile && renderProfileDashboard()}
      {showAdmin && renderCEOStudio()}

      {/* SOURCING MODAL */}
      {showSourcingModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 px-4">
          <div className="bg-zinc-900 border border-amber-500 p-6 rounded-2xl w-full max-w-md shadow-[0_0_15px_rgba(245,158,11,0.2)] relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-amber-500">የግል እቃ ይዘዙ</h2>
              <button
                onClick={() => setShowSourcingModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-zinc-400 mb-6 text-xs leading-relaxed">
              ከ Amazon፣ BestBuy፣ ወይም ሌላ የዩኤስ ሱቅ እቃ መግዛት ይፈልጋሉ? ሊንኩን ከታች ያስገቡ።
              እቃውን እና መጓጓዣውን አጠቃልለን ዋጋውን እናሳውቅዎታለን።
            </p>
            <form onSubmit={handleSourcingSubmit}>
              <input
                type="url"
                required
                placeholder="https://www.amazon.com/item..."
                className="w-full p-3 rounded-xl bg-black border border-zinc-800 focus:border-amber-500 text-white mb-4 outline-none transition-colors"
                value={sourcingLink}
                onChange={(e) => setSourcingLink(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3 rounded-xl transition-colors"
              >
                ሊንክ ላክ (Send Link)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL CHECKOUT MODAL - BUG FIX 1: object-contain for full un-cut image */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 px-4">
          <div className="bg-zinc-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 p-6 relative">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag size={20} /> Order Details
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-zinc-800 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex space-x-2 mb-6 bg-black p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setOrderDestination("local")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  orderDestination === "local"
                    ? "bg-amber-500 text-black"
                    : "text-zinc-500"
                }`}
              >
                <MapPin size={14} /> Local Order
              </button>
              <button
                onClick={() => setOrderDestination("international")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  orderDestination === "international"
                    ? "bg-amber-500 text-black"
                    : "text-zinc-500"
                }`}
              >
                <Globe2 size={14} /> Diaspora Gift
              </button>
            </div>

            <form onSubmit={handleBotOrderSubmit} className="space-y-4">
              {/* THE IMAGE CUT-OFF FIX IS HERE: object-contain and height increased */}
              {currentOrderImages.length > 0 && (
                <div className="w-full h-48 bg-zinc-950 flex items-center justify-center rounded-xl border border-zinc-800 mb-4 overflow-hidden p-2">
                  <img
                    src={currentOrderImages[activeProductImageIndex]}
                    className="max-w-full max-h-full object-contain"
                    alt=""
                  />
                </div>
              )}

              {!user?.isVIP && (
                <div className="bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30 p-3 rounded-xl mb-4">
                  <p className="text-amber-500 text-[10px] font-black uppercase mb-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Wait! You're paying full price.
                  </p>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {orderDestination === "local"
                      ? "VIP Members get an instant 10% discount on this item. Close this window and upgrade to VIP first!"
                      : "Diaspora VIP Benefit: Become a Goleth VIP and we will completely WAIVE the international service handling fee on this order!"}
                  </p>
                </div>
              )}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  Your Full Name
                </label>
                <input
                  required
                  type="text"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-amber-500"
                />
              </div>
              {orderDestination === "local" ? (
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                    Local Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={orderPhone}
                    onChange={(e) => setOrderPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-amber-500"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                      Your International Phone
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none w-24"
                      >
                        <option value="+1">US/CA (+1)</option>
                        <option value="+44">UK (+44)</option>
                        <option value="+971">UAE (+971)</option>
                        <option value="+49">GER (+49)</option>
                        <option value="+251">ETH (+251)</option>
                      </select>
                      <input
                        required
                        type="tel"
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1 text-amber-500">
                      Receiver's Phone (In Ethiopia)
                    </label>
                    <input
                      required
                      type="tel"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      placeholder="09..."
                      className="w-full bg-amber-500/5 border border-amber-500/30 rounded-xl p-3 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}
              {orderDestination === "local" && (
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                    Shipping Method
                  </label>
                  <select
                    value={orderShipping}
                    onChange={(e) => setOrderShipping(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-amber-500"
                  >
                    <option value="local_delivery">በከተማ ውስጥ (+150 ETB)</option>
                    <option value="traveler">በመንገደኛ መላክ (+500 ETB)</option>
                  </select>
                </div>
              )}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mt-4">
                <p className="text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-wider">
                  Payment Instructions:
                </p>
                {orderDestination === "local" ? (
                  <>
                    <p className="text-sm font-black text-white">
                      • CBE:{" "}
                      <span className="text-amber-500">1000XXXXXXXXX</span>
                    </p>
                    <p className="text-sm font-black text-white">
                      • Telebirr:{" "}
                      <span className="text-amber-500">09XXXXXXXX</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black text-white mb-2">
                      • PayPal:{" "}
                      <span className="text-blue-400">paypal.me/goleth</span>
                    </p>
                    <p className="text-sm font-black text-white">
                      • Sendwave / Remitly to Receiver
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-2 italic">
                      * Upload screenshot of successful transfer below.
                    </p>
                  </>
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  Upload Receipt
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setOrderReceipt(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 bg-black border border-zinc-800 p-2 rounded-xl focus:border-amber-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl mt-2 flex justify-center items-center gap-2 transition-colors"
              >
                {isSubmittingOrder ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                <span>
                  {isSubmittingOrder ? "Processing..." : "Confirm & Send"}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="p-4 max-w-lg mx-auto pb-32 relative">
        {activeTab === "ዜና" && renderShop()}{" "}
        {/* Removing news to prioritize shop as default home per instructions */}
        {activeTab === "ሱቅ" && renderShop()}
        {/* CEO ACTION BUTTON RESTORED */}
        {isCEO && !showAdmin && (
          <button
            onClick={() => {
              let defaultTab = "products";
              handleEdit(null, defaultTab);
            }}
            className="fixed bottom-24 right-4 bg-amber-500 text-black p-4 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] z-30 flex items-center justify-center"
          >
            <PlusCircle size={28} />
          </button>
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-zinc-950/95 border-t border-zinc-800 flex justify-around pb-6 pt-3 px-2 z-40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.id || (tab.id === "ዜና" && activeTab === "ሱቅ");
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
