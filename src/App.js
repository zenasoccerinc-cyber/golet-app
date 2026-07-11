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
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase Connection
const supabaseUrl = "https://cklchptjwcifydboozls.supabase.co";
const supabaseKey = "sb_publishable_Eq6KwixhAMAO42Zp3SEJVg_ed9fsVj3";
const supabase = createClient(supabaseUrl, supabaseKey);

// TELEGRAM BOT CREDENTIALS
const BOT_TOKEN = "8726960567:AAGx_RJag33dBAjlQdGkJhgYEbzdVrBAlHU";
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

  const [newsCategory, setNewsCategory] = useState("ዋና");
  const [newsLimit, setNewsLimit] = useState(10);
  const newsCategories = ["ዋና", "አስተያየት", "ማህበራዊ", "ያግኙን"];

  const [sportCategory, setSportCategory] = useState("የዝውውር ዜና");
  const sportCategories = ["የዝውውር ዜና"];

  const [shopCategory, setShopCategory] = useState("ሁሉም");
  const shopCategories = ["ሁሉም", "ወንዶች", "ሴቶች", "ልጆች", "መድሃኒት", "ሌላ"];

  // ORDER FORM STATES
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeProductImageIndex, setActiveProductImageIndex] = useState(0);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderShipping, setOrderShipping] = useState("local");
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const [teamAScore, setTeamAScore] = useState("");
  const [teamBScore, setTeamBScore] = useState("");
  const [predictionStatus, setPredictionStatus] = useState("idle");
  const [existingPrediction, setExistingPrediction] = useState(null);

  const [leaderboard, setLeaderboard] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

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

  useEffect(() => {
    if (user && predictions.length > 0) {
      checkExistingPrediction(predictions[0].id);
      fetchUserPoints();
    }
  }, [user, predictions]);

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
    const { data: prData } = await supabase
      .from("predictions")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    const { data: oData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    let lData = [];
    if (prData && prData.length > 0) {
      const activeMatch = prData[0];
      const { data: matchGuesses } = await supabase
        .from("user_predictions")
        .select("*")
        .eq("match_id", activeMatch.id);
      if (matchGuesses && matchGuesses.length > 0) {
        const userIds = matchGuesses.map((g) => g.user_id);
        const { data: guessUsers } = await supabase
          .from("users")
          .select("id, name, total_points")
          .in("id", userIds);
        if (guessUsers) {
          lData = matchGuesses.map((guess) => {
            const u = guessUsers.find((user) => user.id === guess.user_id);
            return {
              ...guess,
              name: u ? u.name : "Unknown",
              total_points: u ? u.total_points : 0,
            };
          });
          lData.sort((a, b) => b.total_points - a.total_points);
        }
      }
    }

    if (nData) setNews(nData);
    if (gData) setGossip(gData);
    if (pData) setProducts(pData);
    if (prData) setPredictions(prData);
    if (oData) setOrders(oData);
    setLeaderboard(lData);
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
    setActiveTab("ዜና");
    setNewsCategory("ዋና");
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
        fetchCEOUsers();
        alert("CEO Mode");
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

  const fetchCEOUsers = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAllUsers(data);
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
    navigateHome();
  };

  const handlePredictSubmit = async (matchId) => {
    if (!user) {
      alert("በመጀመሪያ በቴሌግራም ይግቡ (Log in first)");
      return;
    }
    if (teamAScore === "" || teamBScore === "") return;
    setPredictionStatus("loading");
    const newGuess = {
      user_id: user.id,
      match_id: matchId,
      team_a_score: Number(teamAScore),
      team_b_score: Number(teamBScore),
    };
    const { error } = await supabase
      .from("user_predictions")
      .insert([newGuess]);
    if (!error) {
      setPredictionStatus("success");
      setTimeout(() => {
        setPredictionStatus("idle");
        setExistingPrediction(newGuess);
        fetchData();
      }, 1500);
    } else {
      alert("Error");
      setPredictionStatus("idle");
    }
  };

  const handleDelete = async (table, id) => {
    if (window.confirm("Are you sure?")) {
      await supabase.from(table).delete().eq("id", id);
      fetchData();
    }
  };

  const handleEdit = (item = null, table) => {
    setAdminTab(table);
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title || item.name || "",
        subtitle: item.subtitle || "",
        author: item.author || "",
        body: item.body || "",
        price: item.price || "",
        category: item.category || "ዋና",
        league: item.league_name || "",
        teamA: item.team_a_name || "",
        teamB: item.team_b_name || "",
        teamALogo: item.team_a_logo || "",
        teamBLogo: item.team_b_logo || "",
        image_url: item.image_url || null,
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
        league: "",
        teamA: "",
        teamB: "",
        teamALogo: "",
        teamBLogo: "",
        image_url: null,
      });
    }
    setShowAdmin(true);
  };

  const closeAdmin = () => {
    setShowAdmin(false);
    setEditingId(null);
    setFormData({});
    setImageFiles([]);
    setTeamAImageFile(null);
    setTeamBImageFile(null);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (adminTab === "analytics") return;
    setUploading(true);

    let finalImageUrl = formData.image_url || null;
    let finalTeamALogo = formData.teamALogo;
    let finalTeamBLogo = formData.teamBLogo;

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

    if (teamAImageFile) {
      const fileName = `${Date.now()}_teamA.${teamAImageFile.name
        .split(".")
        .pop()}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, teamAImageFile);
      if (!error)
        finalTeamALogo = supabase.storage.from("images").getPublicUrl(fileName)
          .data.publicUrl;
    }
    if (teamBImageFile) {
      const fileName = `${Date.now()}_teamB.${teamBImageFile.name
        .split(".")
        .pop()}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, teamBImageFile);
      if (!error)
        finalTeamBLogo = supabase.storage.from("images").getPublicUrl(fileName)
          .data.publicUrl;
    }

    const payload = {};
    if (["news", "gossip"].includes(adminTab)) {
      Object.assign(payload, {
        title: formData.title,
        subtitle: formData.subtitle,
        author: formData.author || "Goleth",
        body: formData.body,
        category: formData.category,
        image_url: finalImageUrl,
      });
    } else if (adminTab === "products") {
      Object.assign(payload, {
        name: formData.title,
        body: formData.body,
        price: Number(formData.price),
        category: formData.category,
        image_url: finalImageUrl,
      });
    } else if (adminTab === "predictions") {
      Object.assign(payload, {
        league_name: formData.league,
        team_a_name: formData.teamA,
        team_b_name: formData.teamB,
        team_a_logo: finalTeamALogo,
        team_b_logo: finalTeamBLogo,
      });
    }

    try {
      if (editingId)
        await supabase.from(adminTab).update(payload).eq("id", editingId);
      else {
        if (adminTab === "predictions")
          await supabase
            .from("predictions")
            .update({ is_active: false })
            .neq("id", 0);
        await supabase.from(adminTab).insert([payload]);
      }
      closeAdmin();
      setUploading(false);
      fetchData();
    } catch (err) {
      alert("DB Error!");
      setUploading(false);
    }
  };

  const handleBotOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderReceipt) {
      alert("እባክዎ የክፍያ ደረሰኝዎን ያስገቡ (Please upload receipt)");
      return;
    }
    setIsSubmittingOrder(true);
    let basePrice = selectedProduct.price;
    let vipText = "";
    if (user && user.isVIP) {
      basePrice = selectedProduct.price * 0.9;
      vipText = " (VIP 10% Discount Applied!)";
    }
    const shippingCost = orderShipping === "local" ? 150 : 500;
    const total = basePrice + shippingCost;
    const shippingName = orderShipping === "local" ? "Intra-City" : "Traveler";

    try {
      const orderPayload = {
        customer_name: orderName,
        phone: orderPhone,
        product_name: selectedProduct.name,
        total_price: total,
        shipping_method: shippingName,
        is_vip: user ? user.isVIP : false,
      };

      const { error: dbError } = await supabase
        .from("orders")
        .insert([orderPayload]);
      if (dbError) {
        console.error("Supabase Analytics Save Error:", dbError);
      } else {
        fetchData();
      }
    } catch (err) {
      console.error("Database connection issue:", err);
    }

    const captionText = `🚨 <b>New Order Received!</b>\n\n📦 <b>Product:</b> ${selectedProduct.name}\n👤 <b>Customer:</b> ${orderName}\n📞 <b>Phone:</b> ${orderPhone}\n🚚 <b>Shipping Method:</b> ${shippingName}\n💰 <b>Total Paid:</b> ${total} ETB${vipText}`;

    const formPayload = new FormData();
    formPayload.append("chat_id", CHAT_ID);
    formPayload.append("photo", orderReceipt);
    formPayload.append("caption", captionText);
    formPayload.append("parse_mode", "HTML");

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
        { method: "POST", body: formPayload }
      );
      if (response.ok) {
        alert("ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል! (Order submitted successfully!)");
        setSelectedProduct(null);
        setActiveProductImageIndex(0);
        setOrderName("");
        setOrderPhone("");
        setOrderShipping("local");
        setOrderReceipt(null);
      } else {
        const errorData = await response.json();
        console.error("Telegram API Error:", errorData);
        alert(
          `ትዕዛዙ አልተላከም። (Failed to send order.)\nReason: ${
            errorData.description || "Unknown error"
          }`
        );
      }
    } catch (error) {
      alert("ስህተት አጋጥሟል። በይነመረብዎን ያረጋግጡ። (Check internet connection.)");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const toggleReadMore = (id) =>
    setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const getMaskedAuthor = (dbAuthor) => {
    if (!dbAuthor) return "Goleth";
    return dbAuthor.toLowerCase().includes("zenasoccer") ? "Goleth" : dbAuthor;
  };

  const renderSmartBody = (text, imagesArray, isExpanded, articleId) => {
    if (!text) return null;
    if (!isExpanded) {
      let truncated = text.substring(0, 150) + "...";
      truncated = truncated.replace(/\[IMAGE\d+\]/g, "");
      return (
        <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
          {truncated}
        </p>
      );
    }
    const parts = text.split(/(\[IMAGE\d+\])/g);
    return (
      <div
        className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap cursor-pointer"
        onClick={() => toggleReadMore(articleId)}
      >
        {parts.map((part, i) => {
          const match = part.match(/\[IMAGE(\d+)\]/);
          if (match) {
            const imgIndex = parseInt(match[1], 10);
            if (imagesArray[imgIndex]) {
              return (
                <img
                  key={i}
                  src={imagesArray[imgIndex]}
                  alt="Article Content"
                  className="w-full my-4 rounded-lg object-cover"
                />
              );
            }
            return null;
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
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
            {!editingId && (
              <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {["news", "gossip", "products", "predictions", "analytics"].map(
                  (tab) => (
                    <button
                      type="button"
                      key={tab}
                      onClick={() => setAdminTab(tab)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                        adminTab === tab
                          ? "bg-amber-500 text-black"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  )
                )}
              </div>
            )}

            {adminTab === "analytics" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center">
                    <TrendingUp size={24} className="text-green-500 mb-2" />
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      Total Sales
                    </span>
                    <span className="text-2xl font-black text-white">
                      {totalRevenue}{" "}
                      <span className="text-sm text-zinc-500">ETB</span>
                    </span>
                  </div>
                  <div className="bg-black border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center">
                    <Package size={24} className="text-blue-500 mb-2" />
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      Orders
                    </span>
                    <span className="text-2xl font-black text-white">
                      {orders.length}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">
                    Recent Transactions
                  </h3>
                  <div className="bg-black border border-zinc-800 rounded-xl max-h-60 overflow-y-auto p-2 space-y-2">
                    {orders.length === 0 && (
                      <p className="text-zinc-600 text-xs text-center py-4">
                        No orders yet.
                      </p>
                    )}
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        className="bg-zinc-900 p-3 rounded-lg border border-zinc-800/50"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white font-bold text-sm">
                            {o.customer_name}
                          </span>
                          <span className="text-amber-500 font-black text-sm">
                            {o.total_price} ETB
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400 text-xs">
                            {o.product_name}
                          </span>
                          <span className="text-zinc-500 text-[10px]">
                            {formatDate(o.created_at)}
                          </span>
                        </div>
                        <div className="text-blue-400 text-xs mt-1">
                          {o.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {["news", "gossip"].includes(adminTab) && (
              <>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                    Title
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
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category || "ዋና"}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                    >
                      <option value="ዋና">ዋና</option>
                      <option value="ሰበር ዜና">ሰበር ዜና (Breaking)</option>
                      <option value="የዝውውር ዜና">የዝውውር ዜና (Transfers)</option>
                      <option value="አስተያየት">አስተያየት</option>
                      <option value="ማህበራዊ">ማህበራዊ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author || "Goleth"}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                    Body Text
                  </label>
                  <textarea
                    required
                    rows="6"
                    value={formData.body || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, body: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-700"
                    placeholder="Type [IMAGE1], [IMAGE2] anywhere here to inject the additional images you upload below..."
                  ></textarea>
                </div>
              </>
            )}

            {adminTab === "products" && (
              <>
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
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                    Description / Details
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Price
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
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category || "ሌላ"}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                    >
                      <option value="ወንዶች">ወንዶች (Men)</option>
                      <option value="ሴቶች">ሴቶች (Women)</option>
                      <option value="ልጆች">ልጆች (Kids)</option>
                      <option value="መድሃኒት">መድሃኒት (Medicine)</option>
                      <option value="ሌላ">ሌላ (Other)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {adminTab === "predictions" && (
              <>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                    League
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.league || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, league: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Home Team
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.teamA || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, teamA: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Away Team
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.teamB || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, teamB: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                    />
                  </div>
                </div>
                <div className="bg-black p-3 border border-zinc-800 rounded-lg">
                  <label className="text-[10px] text-amber-500 uppercase block mb-2 font-bold">
                    Team Logos (Upload)
                  </label>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-zinc-500 block mb-1">
                        Home Logo:
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setTeamAImageFile(e.target.files[0])}
                        className="text-[10px] text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-800 file:text-white w-full"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block mb-1">
                        Away Logo:
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setTeamBImageFile(e.target.files[0])}
                        className="text-[10px] text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-800 file:text-white w-full"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {["news", "gossip", "products"].includes(adminTab) && (
              <div className="mt-4">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                  Select 1 or more Images
                </label>
                <div className="flex items-center space-x-4 bg-black border border-zinc-800 rounded-lg p-3">
                  <div className="bg-zinc-900 p-2 rounded-lg">
                    <ImageIcon size={20} className="text-amber-500" />
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-500"
                  />
                </div>
                <p className="text-[9px] text-zinc-500 mt-2 leading-relaxed">
                  * Select multiple files at once. The first is the Main Cover.
                  For articles, type <b>[IMAGE1]</b>, <b>[IMAGE2]</b> in the
                  Body Text to place the extra images inline! For products,
                  extra images will create a gallery.
                </p>
              </div>
            )}

            {adminTab !== "analytics" && (
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-amber-500 text-black font-black py-4 rounded-xl flex justify-center items-center space-x-2 mt-4"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <CheckCircle2 size={20} />
                )}
                <span>{uploading ? "..." : "አስገባ (Publish)"}</span>
              </button>
            )}
          </form>
        </div>
      </div>
    );
  };

  const renderArticle = (item, isHero, table) => {
    const isExpanded = expandedPosts[item.id];
    const shouldTruncate = item.body && item.body.length > 150;
    const isBreaking = item.category === "ሰበር ዜና";

    const imagesArray = item.image_url ? item.image_url.split(",") : [];
    const mainImage = imagesArray[0];

    if (isHero) {
      return (
        <div
          key={item.id}
          className={`bg-zinc-900 rounded-xl overflow-hidden shadow-lg relative mb-4 ${
            isBreaking ? "border-2 border-red-600" : "border border-zinc-800"
          }`}
        >
          {isBreaking && (
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse z-20"></div>
          )}
          {isCEO && (
            <div className="absolute top-2 right-2 flex space-x-2 z-10">
              <button
                onClick={() => handleEdit(item, table)}
                className="bg-blue-600 p-2 rounded-full"
              >
                <Edit size={16} className="text-white" />
              </button>
              <button
                onClick={() => handleDelete(table, item.id)}
                className="bg-red-600 p-2 rounded-full"
              >
                <Trash2 size={16} className="text-white" />
              </button>
            </div>
          )}
          {mainImage && (
            <img
              src={mainImage}
              alt={item.title}
              className="w-full aspect-[1.91/1] object-cover"
            />
          )}
          <div className="p-5">
            <h3
              className={`font-black text-2xl leading-tight mb-2 ${
                isBreaking ? "text-red-500" : "text-amber-500"
              }`}
            >
              {item.title}
            </h3>
            {item.subtitle && (
              <h4 className="text-white text-md font-bold mb-3">
                {item.subtitle}
              </h4>
            )}

            <div className="flex flex-wrap items-center text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2 pb-2 border-b border-zinc-800/50">
              {isBreaking && (
                <span className="bg-red-600 px-2 py-0.5 rounded text-white mr-2 flex items-center gap-1">
                  <Flame size={10} /> ሰበር ዜና
                </span>
              )}
              {!isBreaking && item.category && item.category !== "ዋና" && (
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-amber-500 mr-2">
                  {item.category}
                </span>
              )}
              <span>{getMaskedAuthor(item.author)}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(item.created_at)}</span>
            </div>

            {renderSmartBody(item.body, imagesArray, isExpanded, item.id)}

            {shouldTruncate && (
              <button
                onClick={() => toggleReadMore(item.id)}
                className={`${
                  isBreaking ? "text-red-500" : "text-amber-500"
                } text-xs font-bold mt-3`}
              >
                {isExpanded ? "አሳጥር (Collapse)" : "ሙሉውን ያንብቡ"}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={item.id}
        className={`bg-zinc-900 rounded-xl overflow-hidden shadow-sm relative mb-3 flex h-32 ${
          isBreaking ? "border border-red-900/50" : "border border-zinc-800"
        }`}
      >
        {isCEO && (
          <div className="absolute top-2 right-2 flex space-x-2 z-10 bg-black/50 p-1 rounded-bl-lg">
            <button onClick={() => handleEdit(item, table)} className="p-1">
              <Edit size={14} className="text-blue-400" />
            </button>
            <button
              onClick={() => handleDelete(table, item.id)}
              className="p-1"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        )}
        {mainImage ? (
          <img src={mainImage} className="w-1/3 h-full object-cover" />
        ) : (
          <div className="w-1/3 h-full bg-black flex items-center justify-center">
            <span className="text-zinc-800 font-black text-xs rotate-90">
              GOLETH
            </span>
          </div>
        )}
        <div className="w-2/3 p-3 flex flex-col justify-center relative">
          {isBreaking && (
            <span className="text-red-500 text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <Flame size={8} /> ሰበር ዜና
            </span>
          )}
          {!isBreaking && item.category && item.category !== "ዋና" && (
            <span className="text-amber-500 text-[9px] font-bold uppercase tracking-widest mb-1">
              {item.category}
            </span>
          )}

          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">
            {item.title}
          </h3>

          {item.body && (
            <p className="text-zinc-400 text-[10px] leading-tight line-clamp-2 mb-1.5">
              {item.body.replace(/\[IMAGE\d+\]/g, "")}
            </p>
          )}

          <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
            {formatDate(item.created_at)}
          </span>
        </div>
      </div>
    );
  };

  const renderNewsFeed = (
    feedData,
    currentCategory,
    setCategoryFunc,
    categoriesList
  ) => {
    const filteredData =
      currentCategory === "ዋና" || currentCategory === "ሁሉም"
        ? feedData
        : feedData.filter((n) => n.category === currentCategory);
    const visibleData = filteredData.slice(0, newsLimit);

    return (
      <div className="pb-24 pt-2">
        <div className="flex overflow-x-auto space-x-2 mb-4 pb-2 scrollbar-hide">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                if (cat === "ያግኙን") {
                  window.location.href = "mailto:contactgoleth@gmail.com";
                  return;
                }
                setCategoryFunc(cat);
                setNewsLimit(10);
              }}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentCategory === cat
                  ? "bg-amber-500 text-black shadow-md"
                  : "bg-zinc-800 text-white border border-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {visibleData.length === 0 && (
            <div className="text-center text-zinc-500 pt-10 text-sm font-bold">
              ምንም ዜና የለም
            </div>
          )}
          {visibleData.map((item, index) =>
            renderArticle(item, index === 0, "news")
          )}
        </div>

        {filteredData.length > newsLimit && (
          <button
            onClick={() => setNewsLimit((prev) => prev + 10)}
            className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-black text-sm mt-4 hover:bg-zinc-800 transition-colors"
          >
            ተጨማሪ ያንብቡ
          </button>
        )}
      </div>
    );
  };

  const renderProfileModal = () => {
    const daysLeft = user.vipUntil
      ? Math.max(
          0,
          Math.ceil(
            (new Date(user.vipUntil) - new Date()) / (1000 * 60 * 60 * 24)
          )
        )
      : 0;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-zinc-900 w-full max-w-sm rounded-2xl border border-zinc-800 p-6 shadow-2xl relative">
          <button
            onClick={() => setShowProfile(false)}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-3xl font-black text-black mb-4 uppercase">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-black text-white">{user.name}</h2>
            {user.isVIP ? (
              <span className="text-amber-500 font-bold text-xs uppercase tracking-widest mt-1">
                VIP
              </span>
            ) : (
              <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">
                Free
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-900/20 text-red-500 font-bold py-3 rounded-xl"
          >
            <LogOut size={18} /> <span>ውጣ</span>
          </button>
        </div>
      </div>
    );
  };

  // UPDATED VIP SCREEN TO SEPARATE GENERAL LOGIN FROM VIP UPGRADE
  const renderVIP = () => {
    if (!user && !isCEO) {
      return (
        <div className="pb-24 flex flex-col items-center justify-center pt-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={30} className="text-[#229ED9]" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              እንኳን በደህና መጡ!
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              አዲስ መለያ ለመፍጠር ወይም ለመግባት ከታች ያለውን የቴሌግራም ቁልፍ ይጫኑ። (Click below to
              log in or register instantly with Telegram.)
            </p>
            <TelegramLoginWidget onAuth={handleRealLogin} />
          </div>
        </div>
      );
    }
    if (user && !user.isVIP && !isCEO) {
      return (
        <div className="pb-24 flex flex-col items-center justify-center pt-10">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-6 w-full max-w-sm shadow-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown size={30} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Goleth VIP</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              በወር <b>50 ብር</b> ብቻ የቪአይፒ አባል ይሁኑ እና የ10% ቅናሽ ያግኙ! (Upgrade to VIP
              for 50 ETB/month!)
            </p>
            <div className="bg-black p-4 rounded-lg text-left border border-zinc-800 mb-4">
              <p className="text-xs text-zinc-400 mb-2">
                ክፍያዎን እዚህ ይፈጽሙ (Pay here):
              </p>
              <p className="text-sm font-bold text-white">CBE: 1000XXXXXXXXX</p>
              <p className="text-sm font-bold text-white">
                Telebirr: 09XXXXXXXX
              </p>
            </div>
            <p className="text-xs text-zinc-500">
              ከከፈሉ በኋላ ደረሰኝዎን በቴሌግራም ይላኩልን። (Send receipt to our Telegram bot).
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="pb-24 pt-6 flex flex-col items-center">
        <div className="text-center text-amber-500 font-black mb-4">
          👑 አንተ የቪአይፒ አባል ነህ! (You are a VIP!)
        </div>
        <div className="text-center text-zinc-500 font-bold">
          ምንም ጨዋታ የለም (No match)
        </div>
      </div>
    );
  };

  const renderShop = () => {
    const filteredProducts =
      shopCategory === "ሁሉም"
        ? products
        : products.filter((p) => p.category === shopCategory);

    return (
      <div className="pb-24 pt-2">
        <div className="flex overflow-x-auto space-x-2 mb-4 pb-2 scrollbar-hide">
          {shopCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setShopCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                shopCategory === cat
                  ? "bg-amber-500 text-black shadow-md"
                  : "bg-zinc-800 text-white border border-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col space-y-6">
          {filteredProducts.map((item) => {
            const productImages = item.image_url
              ? item.image_url.split(",")
              : [];
            const mainImg = productImages[0];

            return (
              <div
                key={item.id}
                className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl relative w-full max-w-md mx-auto"
              >
                {isCEO && (
                  <div className="absolute top-3 right-3 flex space-x-2 z-10 bg-black/50 p-1.5 rounded-lg">
                    <button
                      onClick={() => handleEdit(item, "products")}
                      className="p-1"
                    >
                      <Edit size={16} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete("products", item.id)}
                      className="p-1"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                )}
                {mainImg ? (
                  <img
                    src={mainImg}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square bg-black"></div>
                )}
                <div className="p-6">
                  <span className="text-[10px] text-amber-500 font-bold uppercase">
                    {item.category}
                  </span>
                  <h3 className="text-white font-black text-xl mt-1 mb-2">
                    {item.name}
                  </h3>

                  {item.body && (
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed whitespace-pre-wrap border-b border-zinc-800/50 pb-4">
                      {item.body}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-[10px] font-bold uppercase">
                        Price
                      </span>
                      <div className="flex items-center space-x-2">
                        {user && user.isVIP ? (
                          <>
                            <p className="text-amber-500 font-black text-2xl">
                              {Math.round(item.price * 0.9)} ብር
                            </p>
                            <p className="text-zinc-500 font-bold text-sm line-through">
                              {item.price}
                            </p>
                            <span className="bg-amber-500/20 text-amber-500 text-[10px] px-1.5 py-0.5 rounded font-bold">
                              VIP
                            </span>
                          </>
                        ) : (
                          <p className="text-amber-500 font-black text-2xl">
                            {item.price} ብር
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProduct(item);
                        setActiveProductImageIndex(0);
                      }}
                      className="bg-amber-500 text-black font-black px-6 py-3 rounded-xl hover:bg-amber-400 shadow-lg"
                    >
                      እዘዝ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "ዜና", icon: Home },
    { id: "ስፖርት", icon: Trophy },
    { id: "ሹክሹክታ", icon: Flame },
    { id: "ቪአይፒ", icon: Crown },
    { id: "ሱቅ", icon: ShoppingBag },
  ];

  const currentOrderImages =
    selectedProduct && selectedProduct.image_url
      ? selectedProduct.image_url.split(",")
      : [];

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black font-sans text-white">
      <style>{` body, html { background-color: black; margin: 0; overscroll-behavior-y: none; } `}</style>

      <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 p-4 flex justify-between items-center">
        <div
          className="flex items-center space-x-3 cursor-pointer select-none"
          onClick={handleLogoTap}
        >
          <h1 className="text-white font-black text-2xl tracking-widest">
            GOL<span className="text-amber-500">ETH</span>
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {isCEO && (
            <button
              onClick={() =>
                handleEdit(null, activeTab === "ሱቅ" ? "products" : "news")
              }
              className="text-amber-500 mr-2"
            >
              <PlusCircle size={24} />
            </button>
          )}
          {user ? (
            <div
              onClick={() => setShowProfile(true)}
              className="flex items-center space-x-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 cursor-pointer"
            >
              <span className="text-xs font-bold text-white">{user.name}</span>
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

      {showProfile && renderProfileModal()}
      {showAdmin && renderCEOStudio()}

      {/* FULLY RESTORED & FIXED CHECKOUT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 p-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
              <h2 className="text-xl font-black text-white">
                ማዘዣ ቅጽ (Order Form)
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-zinc-800 border border-zinc-700 p-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBotOrderSubmit} className="space-y-4">
              <div className="bg-black p-3 rounded-lg border border-zinc-800 mb-4">
                {currentOrderImages.length > 0 ? (
                  <>
                    <img
                      src={currentOrderImages[activeProductImageIndex]}
                      className="w-full h-48 object-cover rounded-md border border-zinc-700 mb-2"
                      alt="Product Main"
                    />
                    {currentOrderImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {currentOrderImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            onClick={() => setActiveProductImageIndex(idx)}
                            className={`w-12 h-12 rounded-md object-cover cursor-pointer transition-all ${
                              idx === activeProductImageIndex
                                ? "border-2 border-amber-500 opacity-100"
                                : "opacity-50 hover:opacity-100"
                            }`}
                            alt="Thumb"
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-32 bg-zinc-800 rounded-md border border-zinc-700 flex items-center justify-center">
                    <ShoppingBag size={30} className="text-zinc-500" />
                  </div>
                )}

                <div className="mt-3">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">
                    Product
                  </p>
                  <p className="text-white font-bold">{selectedProduct.name}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">
                  ሙሉ ስም (Full Name)
                </label>
                <input
                  required
                  type="text"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">
                  ስልክ ቁጥር (Phone Number)
                </label>
                <input
                  required
                  type="tel"
                  value={orderPhone}
                  onChange={(e) => setOrderPhone(e.target.value)}
                  placeholder="09..."
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">
                  የማጓጓዣ አማራጭ (Shipping)
                </label>
                <select
                  value={orderShipping}
                  onChange={(e) => setOrderShipping(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                >
                  <option value="local">በከተማ ውስጥ (+150 ETB)</option>
                  <option value="traveler">በመንገደኛ መላክ (+500 ETB)</option>
                </select>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-500 font-bold">Total Amount:</span>
                <span className="text-amber-500 font-black text-xl">
                  {(user && user.isVIP
                    ? Math.round(selectedProduct.price * 0.9)
                    : selectedProduct.price) +
                    (orderShipping === "local" ? 150 : 500)}{" "}
                  ETB
                </span>
              </div>

              <div className="bg-green-900/20 border-l-4 border-green-500 p-4 rounded text-sm text-zinc-300">
                <strong className="text-white block mb-2">
                  የክፍያ መመሪያ (Payment):
                </strong>
                እባክዎ ክፍያዎን ከታች ባሉት አካውንቶች ፈጽመው ሲጨርሱ፣{" "}
                <b>ተመልሰው የክፍያ ደረሰኝዎን (Screenshot) እዚህ ጋር ይስቀሉ።</b>
                <br />
                <br />• <strong>CBE:</strong> 1000XXXXXXXXX
                <br />• <strong>Telebirr:</strong> 09XXXXXXXX
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">
                  የክፍያ ደረሰኝ (Upload Receipt)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setOrderReceipt(e.target.files[0])}
                  className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-500 bg-black border border-zinc-800 p-2 rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full bg-[#229ED9] hover:bg-[#1CA0DE] text-white font-black py-4 rounded-xl mt-4 flex justify-center items-center space-x-2 transition-colors"
              >
                {isSubmittingOrder ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>
                  {isSubmittingOrder ? "በመላክ ላይ..." : "ትዕዛዝ ላክ (Submit)"}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="p-4 max-w-lg mx-auto pb-32">
        {activeTab === "ዜና" &&
          renderNewsFeed(news, newsCategory, setNewsCategory, newsCategories)}
        {activeTab === "ስፖርት" &&
          renderNewsFeed(
            news,
            sportCategory,
            setSportCategory,
            sportCategories
          )}
        {activeTab === "ሹክሹክታ" && (
          <div className="space-y-4">
            {gossip.map((g, index) => renderArticle(g, index === 0, "gossip"))}
          </div>
        )}
        {activeTab === "ቪአይፒ" && renderVIP()}
        {activeTab === "ሱቅ" && renderShop()}
      </main>

      <nav className="fixed bottom-0 w-full bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 flex justify-around pb-6 pt-3 px-2 z-40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive ? "text-amber-500" : "text-white/90 hover:text-white"
              }`}
            >
              <Icon
                size={isActive ? 26 : 24}
                strokeWidth={isActive ? 2.5 : 2}
                className="mb-1.5"
              />
              <span className="text-[11px] font-bold tracking-wide">
                {tab.id}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
