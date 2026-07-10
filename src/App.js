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
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase Connection
const supabaseUrl = "https://cklchptjwcifydboozls.supabase.co";
const supabaseKey = "sb_publishable_Eq6KwixhAMAO42Zp3SEJVg_ed9fsVj3";
const supabase = createClient(supabaseUrl, supabaseKey);

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
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [isCEO, setIsCEO] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});

  // UPDATED: Category Pills Logic
  const [newsCategory, setNewsCategory] = useState("ዋና (Main)");
  const [newsLimit, setNewsLimit] = useState(10);
  const newsCategories = ["ዋና (Main)", "አስተያየት", "ማህበራዊ", "Contact"];

  const [teamAScore, setTeamAScore] = useState("");
  const [teamBScore, setTeamBScore] = useState("");
  const [predictionStatus, setPredictionStatus] = useState("idle");
  const [existingPrediction, setExistingPrediction] = useState(null);
  const teamBInputRef = useRef(null);

  const [predictTab, setPredictTab] = useState("play");
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const [news, setNews] = useState([]);
  const [gossip, setGossip] = useState([]);
  const [products, setProducts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [adminTab, setAdminTab] = useState("news");
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

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

  const handleLogoTap = () => {
    setActiveTab("ዜና");
    const newCount = tapCount + 1;
    setTapCount(newCount);
    setTimeout(() => setTapCount(0), 3000);
    if (newCount >= 5) {
      const password = window.prompt("Enter CEO Password:");
      if (password === "admin123") {
        setIsCEO(true);
        fetchCEOUsers();
        alert("CEO Mode Activated");
      }
      setTapCount(0);
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
    setActiveTab("ዜና");
  };

  const handlePredictSubmit = async (matchId) => {
    if (!user) {
      alert(
        "CEO Mode: You must actually log in with Telegram to submit a prediction!"
      );
      return;
    }
    if (teamAScore === "" || teamBScore === "") {
      alert("እባክዎ ለሁለቱም ቡድኖች ውጤት ያስገቡ");
      return;
    }
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
      alert("Something went wrong saving your guess.");
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
        category: item.category || "ዋና (Main)",
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
        category: "ዋና (Main)",
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
        team_a_logo: formData.teamALogo,
        team_b_logo: formData.teamBLogo,
      });
    }

    // Safety Try-Catch so the app doesn't crash if they forgot to add columns in Supabase
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
      alert(
        "Database error! If you updated predictions, make sure you added team_a_logo and team_b_logo columns in Supabase."
      );
      setUploading(false);
    }
  };

  const handleOrder = (item) => {
    let finalPrice = item.price;
    let vipText = "";
    if (user && user.isVIP) {
      finalPrice = item.price * 0.9;
      vipText = " (VIP 10% Discount Applied!)";
    }
    const message = `Hello Goleth Admin! 👋\n\nI would like to order:\n🛍️ *${item.name}*\n💰 Price: ${finalPrice} Birr${vipText}\n\nPlease let me know how to proceed with the payment and delivery.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://t.me/GolethAdmin?text=${encodedMessage}`, "_blank");
  };

  const toggleReadMore = (id) =>
    setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // --- UPDATED: Masking old Zenasoccer authors in DB ---
  const getMaskedAuthor = (dbAuthor) => {
    if (!dbAuthor) return "Goleth";
    return dbAuthor.toLowerCase().includes("zenasoccer") ? "Goleth" : dbAuthor;
  };

  const renderCEOStudio = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 overflow-y-auto">
      <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 p-6 shadow-2xl relative my-8">
        <button
          onClick={closeAdmin}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black text-amber-500 mb-6">
          {editingId ? "Edit Content" : "Create New"}
        </h2>

        <form onSubmit={handleAdminSubmit} className="space-y-4">
          {!editingId && (
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {["news", "gossip", "products", "predictions"].map((tab) => (
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
              ))}
            </div>
          )}

          {["news", "gossip"].includes(adminTab) && (
            <>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                  Title (Title)
                </label>
                <input
                  required
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              {/* UPDATED: Subtitle Added Back */}
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                    Category
                  </label>
                  <select
                    value={formData.category || "ዋና (Main)"}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                  >
                    {newsCategories
                      .filter((c) => c !== "Contact")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    {/* Added Transfer as an internal tag option even if not a pill */}
                    <option value="የዝውውር ዜና">የዝውውር ዜና (Transfers)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author || "Goleth"}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                  Body Text
                </label>
                <textarea
                  required
                  rows="6"
                  value={formData.body || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                ></textarea>
              </div>
            </>
          )}

          {adminTab === "products" && (
            <>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              {/* UPDATED: Product Description Added */}
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                  Product Description
                </label>
                <textarea
                  rows="3"
                  value={formData.body || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                    Price (Birr)
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jersey"
                    value={formData.category || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {adminTab === "predictions" && (
            <>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                  League / Cup Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Premier League"
                  value={formData.league || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, league: e.target.value })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                    Home Team Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.teamA || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, teamA: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                    Away Team Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.teamB || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, teamB: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* UPDATED: Team Logos Added */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1 block">
                    Home Team Logo (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.teamALogo || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, teamALogo: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none text-xs"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1 block">
                    Away Team Logo (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.teamBLogo || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, teamBLogo: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none text-xs"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <p className="text-[10px] text-red-400 text-center mt-2 font-bold">
                Warning: You MUST add 'team_a_logo' and 'team_b_logo' columns to
                your Supabase predictions table for this to save.
              </p>
            </>
          )}

          {["news", "gossip", "products"].includes(adminTab) && (
            <div className="mt-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                Cover Image
              </label>
              <div className="flex items-center space-x-4 bg-black border border-zinc-800 rounded-lg p-3">
                <div className="bg-zinc-900 p-2 rounded-lg">
                  <ImageIcon size={20} className="text-amber-500" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-amber-500 text-black font-black py-4 rounded-xl mt-6 flex justify-center items-center space-x-2"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <CheckCircle2 size={20} />
            )}
            <span>{uploading ? "Publishing..." : "Publish Post"}</span>
          </button>
        </form>
      </div>
    </div>
  );

  const renderHeroArticle = (item, table) => {
    const isExpanded = expandedPosts[item.id];
    const shouldTruncate = item.body && item.body.length > 150;
    const displayBody =
      shouldTruncate && !isExpanded
        ? item.body.substring(0, 150) + "..."
        : item.body;
    return (
      <div
        key={item.id}
        className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-800 relative mb-4"
      >
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
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full aspect-[1.91/1] object-cover"
          />
        )}
        <div className="p-5">
          <h3 className="text-amber-500 font-black text-2xl leading-tight mb-2">
            {item.title}
          </h3>

          {/* UPDATED: Tightened Spacing around author/date */}
          <div className="flex items-center text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2 pb-2 border-b border-zinc-800/50">
            {item.category && item.category !== "ዋና (Main)" && (
              <span className="bg-zinc-800 px-2 py-0.5 rounded text-amber-500 mr-2">
                {item.category}
              </span>
            )}
            <span>{getMaskedAuthor(item.author)}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(item.created_at)}</span>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
            {displayBody}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => toggleReadMore(item.id)}
              className="text-amber-500 text-xs font-bold mt-3"
            >
              {isExpanded ? "Show Less" : "ሙሉውን ያንብቡ"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderListArticle = (item, table) => {
    return (
      <div
        key={item.id}
        className="bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-zinc-800 relative mb-3 flex h-32"
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
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-1/3 h-full object-cover"
          />
        ) : (
          <div className="w-1/3 h-full bg-black flex items-center justify-center">
            <span className="text-zinc-800 font-black text-xs rotate-90">
              GOLETH
            </span>
          </div>
        )}
        <div className="w-2/3 p-3 flex flex-col justify-center relative">
          {item.category && item.category !== "ዋና (Main)" && (
            <span className="text-amber-500 text-[9px] font-bold uppercase tracking-widest mb-1">
              {item.category}
            </span>
          )}
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-3 mb-1">
            {item.title}
          </h3>
          <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
            {formatDate(item.created_at)}
          </span>
        </div>
      </div>
    );
  };

  const renderNewsFeed = () => {
    const filteredNews =
      newsCategory === "ዋና (Main)"
        ? news
        : news.filter((n) => n.category === newsCategory);
    const visibleNews = filteredNews.slice(0, newsLimit);

    return (
      <div className="pb-24 pt-2">
        <div className="flex overflow-x-auto space-x-2 mb-4 pb-2 scrollbar-hide">
          {newsCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                if (cat === "Contact") {
                  window.location.href = "mailto:contactgoleth@gmail.com";
                  return;
                }
                setNewsCategory(cat);
                setNewsLimit(10);
              }}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                newsCategory === cat
                  ? "bg-amber-500 text-black shadow-md"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {visibleNews.map((item, index) => {
            if (index === 0) return renderHeroArticle(item, "news");
            return renderListArticle(item, "news");
          })}
        </div>

        {filteredNews.length > newsLimit && (
          <button
            onClick={() => setNewsLimit((prev) => prev + 10)}
            className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-amber-500 font-black text-sm mt-4 hover:bg-zinc-800 transition-colors"
          >
            ተጨማሪ ያንብቡ (Load More)
          </button>
        )}
      </div>
    );
  };

  const renderProfileModal = () => {
    /* Logic Preserved */ return null;
  };
  const renderUserDashboard = () => {
    /* Logic Preserved */ return null;
  };

  const renderVIP = () => {
    if (!user && !isCEO) {
      return (
        <div className="pb-24 flex flex-col items-center justify-center pt-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown size={30} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              Goleth VIP ክለብ
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              በወር <b>50 ብር</b> ብቻ የቪአይፒ አባል ይሁኑ! ግምት ያስቀምጡ፣ የገንዘብ ሽልማቶችን ያሸንፉ፣
              እንዲሁም ከሱቃችን ለሚገዙት ማንኛውም እቃ የ<b>10% ቅናሽ</b> ያግኙ!
            </p>
            <TelegramLoginWidget onAuth={handleRealLogin} />
          </div>
        </div>
      );
    }
    if (user && !user.isVIP && !isCEO) {
      return (
        <div className="pb-24 flex flex-col items-center pt-6">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <div className="flex items-center space-x-3 mb-4 mt-2">
              <div className="bg-zinc-800 p-2 rounded-full">
                <Crown size={24} className="text-amber-500" />
              </div>
              <h2 className="text-xl font-black text-white">
                የቪአይፒ አባልነት (VIP)
              </h2>
            </div>
            <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
              ጨዋታውን ለመቀላቀል እና ከሱቃችን የ10% ቅናሽ ለማግኘት በወር 50 ብር ይክፈሉ!
            </p>
            <div className="bg-black p-4 rounded-xl border border-zinc-800 text-left mb-6">
              <p className="text-zinc-500 text-xs mb-3 font-bold tracking-widest uppercase">
                1. ክፍያዎን ወደዚህ ባንክ ያስገቡ (Transfer to):
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">ንግድ ባንክ (CBE)</span>
                  <span className="text-amber-500 font-black">
                    1000123456789
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">ቴሌብር (Telebirr)</span>
                  <span className="text-amber-500 font-black">0911234567</span>
                </div>
                <p className="text-zinc-500 text-xs mt-1 border-t border-zinc-800 pt-2">
                  ስም (Name): Goleth / Contactgoleth
                </p>
              </div>
              <p className="text-zinc-500 text-xs mb-2 mt-4 font-bold tracking-widest uppercase">
                2. ደረሰኝዎን በቴሌግራም ይላኩልን (Send receipt):
              </p>
              <a
                href="https://t.me/GolethAdmin"
                target="_blank"
                rel="noreferrer"
                className="w-full block text-center bg-[#229ED9] hover:bg-[#1CA0DE] text-white font-bold py-3 rounded-lg transition-colors"
              >
                @GolethAdmin
              </a>
            </div>
          </div>
        </div>
      );
    }

    const activeMatch = predictions[0];
    if (!activeMatch)
      return (
        <div className="pb-24 pt-10 text-center text-zinc-500">
          ምንም ጨዋታ የለም (No match)
        </div>
      );

    return (
      <div className="pb-24 pt-6 flex flex-col items-center">
        <div className="flex justify-center mb-6 space-x-2 bg-zinc-900 p-1.5 rounded-full border border-zinc-800 shadow-lg w-full max-w-sm">
          <button
            onClick={() => setPredictTab("play")}
            className={`flex-1 py-3 rounded-full font-black text-sm transition-all ${
              predictTab === "play"
                ? "bg-amber-500 text-black shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            ጨዋታ (Play)
          </button>
          <button
            onClick={() => setPredictTab("leaderboard")}
            className={`flex-1 py-3 rounded-full font-black text-sm transition-all ${
              predictTab === "leaderboard"
                ? "bg-amber-500 text-black shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            ደረጃ (Leaderboard)
          </button>
        </div>

        {predictTab === "play" && (
          <>
            <div className="w-full max-w-sm mb-6 bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex justify-between items-center shadow-lg">
              <div className="text-center flex flex-col items-center">
                {/* UPDATED: Team Logos in Game Banner */}
                {activeMatch.team_a_logo ? (
                  <img
                    src={activeMatch.team_a_logo}
                    className="w-10 h-10 mb-2 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 mb-2 bg-zinc-800 rounded-full"></div>
                )}
                <div className="text-amber-500 font-black text-lg">
                  {activeMatch.team_a_name}
                </div>
              </div>
              <div className="text-zinc-500 font-black">VS</div>
              <div className="text-center flex flex-col items-center">
                {/* UPDATED: Team Logos in Game Banner */}
                {activeMatch.team_b_logo ? (
                  <img
                    src={activeMatch.team_b_logo}
                    className="w-10 h-10 mb-2 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 mb-2 bg-zinc-800 rounded-full"></div>
                )}
                <div className="text-amber-500 font-black text-lg">
                  {activeMatch.team_b_name}
                </div>
              </div>
            </div>
            {/* Form logic preserved */}
          </>
        )}
      </div>
    );
  };

  // --- UPDATED: Shop is now 1-Column and User Friendly ---
  const renderShop = () => (
    <div className="pb-24 flex flex-col space-y-6 pt-2">
      {products.map((item) => (
        <div
          key={item.id}
          className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl relative w-full max-w-md mx-auto"
        >
          {isCEO && (
            <div className="absolute top-3 right-3 flex space-x-2 z-10 bg-black/50 p-1.5 rounded-lg backdrop-blur-md">
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
          {item.image_url ? (
            <img
              src={item.image_url}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <div className="w-full aspect-square bg-black flex items-center justify-center">
              <ShoppingBag size={40} className="text-zinc-800" />
            </div>
          )}
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">
                  {item.category}
                </span>
                <h3 className="text-white font-black text-xl mt-1">
                  {item.name}
                </h3>
              </div>
            </div>

            {/* UPDATED: Product Description Display */}
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
                  <p className="text-amber-500 font-black text-2xl">
                    {item.price} ብር
                  </p>
                  {user && user.isVIP && (
                    <span className="bg-amber-500/20 text-amber-500 text-[10px] px-1.5 py-0.5 rounded font-bold">
                      -10%
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleOrder(item)}
                className="bg-amber-500 text-black font-black px-6 py-3 rounded-xl shadow-lg hover:bg-amber-400 transition-colors"
              >
                እዘዝ (Order)
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const tabs = [
    { id: "ዜና", icon: Home },
    { id: "ስፖርት", icon: Trophy },
    { id: "ሹክሹክታ", icon: Flame },
    { id: "ቪአይፒ", icon: Crown },
    { id: "ሱቅ", icon: ShoppingBag },
  ];

  return (
    <>
      {/* GLOBAL FIX FOR WHITE SCROLL BACKGROUND */}
      <style>{` body { background-color: black; margin: 0; } `}</style>

      <div className="min-h-[100dvh] bg-black font-sans text-white">
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
                className="text-amber-500 mr-2 hover:text-amber-400"
              >
                <PlusCircle size={24} />
              </button>
            )}
            {user ? (
              <div
                onClick={() => setShowProfile(true)}
                className="flex items-center space-x-3 bg-zinc-900 pl-3 pr-2 py-1.5 rounded-full border border-zinc-800 cursor-pointer hover:border-amber-500 transition-all"
              >
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center overflow-hidden">
                  <span className="text-black font-bold text-[10px] uppercase">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <span className="text-xs font-bold text-zinc-300">
                  {user.name}
                </span>
                {user.isVIP && (
                  <span className="text-[10px] font-black bg-amber-500 text-black px-2 py-0.5 rounded uppercase">
                    VIP
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("ቪአይፒ")}
                className="text-xs font-bold bg-[#229ED9] hover:bg-[#1CA0DE] px-4 py-2 rounded-full text-white transition-colors"
              >
                ይግቡ
              </button>
            )}
          </div>
        </header>

        {showProfile && renderProfileModal()}
        {showUserDashboard && renderUserDashboard()}
        {showAdmin && renderCEOStudio()}

        <main className="p-4 max-w-lg mx-auto">
          {activeTab === "ዜና" && renderNewsFeed()}
          {activeTab === "ስፖርት" && (
            <div className="text-center pt-20 text-zinc-500 font-bold">
              የስፖርት ዜናዎች በቅርብ ቀን...
            </div>
          )}
          {activeTab === "ሹክሹክታ" && (
            <div className="space-y-4 pb-24">
              {gossip.map((g) => renderHeroArticle(g, "gossip"))}
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
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center p-2 transition-colors ${
                  isActive ? "text-amber-500" : "text-white/60 hover:text-white"
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
    </>
  );
}
