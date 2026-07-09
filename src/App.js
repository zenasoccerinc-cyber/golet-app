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
  Calendar,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase Connection
const supabaseUrl = "https://cklchptjwcifydboozls.supabase.co";
const supabaseKey = "sb_publishable_Eq6KwixhAMAO42Zp3SEJVg_ed9fsVj3";
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Official Telegram Login Widget ---
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
  const [isCEO, setIsCEO] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [paymentStatus, setPaymentStatus] = useState("idle");

  const [teamAScore, setTeamAScore] = useState("");
  const [teamBScore, setTeamBScore] = useState("");
  const [predictionStatus, setPredictionStatus] = useState("idle");
  const [existingPrediction, setExistingPrediction] = useState(null);
  const teamBInputRef = useRef(null);

  const [predictTab, setPredictTab] = useState("play");
  const [leaderboard, setLeaderboard] = useState([]);

  const [news, setNews] = useState([]);
  const [gossip, setGossip] = useState([]);
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [adminTab, setAdminTab] = useState("news");
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user && predictions.length > 0) {
      checkExistingPrediction(predictions[0].id);
    }
  }, [user, predictions]);

  const fetchData = async () => {
    const { data: nData } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: gData } = await supabase
      .from("gossip")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: pData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: rData } = await supabase
      .from("results")
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
    if (rData) setResults(rData);
    if (prData) setPredictions(prData);
    setLeaderboard(lData);
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
    const newCount = tapCount + 1;
    setTapCount(newCount);
    setTimeout(() => setTapCount(0), 3000);
    if (newCount >= 5) {
      const password = window.prompt("Enter CEO Password:");
      if (password === "admin123") {
        setIsCEO(true);
        setShowAdmin(true);
      }
      setTapCount(0);
    }
  };

  const handleRealLogin = async (telegramUser) => {
    const userIdString = telegramUser.id.toString();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userIdString)
      .single();

    let currentUser;
    if (data) {
      let currentlyValidVIP = false;
      if (data.is_vip && data.vip_until) {
        currentlyValidVIP = new Date(data.vip_until) > new Date();
        if (!currentlyValidVIP) {
          await supabase
            .from("users")
            .update({ is_vip: false })
            .eq("id", userIdString);
        }
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
        isVIP: newUser.is_vip,
        vipUntil: null,
      };
    }

    setUser(currentUser);
    localStorage.setItem("goleth_user", JSON.stringify(currentUser));
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setUser(null);
      localStorage.removeItem("goleth_user");
      setActiveTab("ዜና");
    }
  };

  const handleTelebirrPayment = async () => {
    setPaymentStatus("loading");

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const expirationIsoString = expirationDate.toISOString();

    setTimeout(async () => {
      const { error } = await supabase
        .from("users")
        .update({ is_vip: true, vip_until: expirationIsoString })
        .eq("id", user.id);

      if (!error) {
        setPaymentStatus("success");
        setTimeout(() => {
          const updatedUser = {
            ...user,
            isVIP: true,
            vipUntil: expirationIsoString,
          };
          setUser(updatedUser);
          localStorage.setItem("goleth_user", JSON.stringify(updatedUser));
          setPaymentStatus("idle");
        }, 1500);
      } else {
        alert("Payment failed. Please try again.");
        setPaymentStatus("idle");
      }
    }, 2500);
  };

  const handlePredictSubmit = async (matchId) => {
    if (teamAScore === "" || teamBScore === "") {
      alert("እባክዎ ለሁለቱም ቡድኖች ውጤት ያስገቡ (Please enter a score for both teams)");
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
      alert("Something went wrong saving your guess. Try again!");
      setPredictionStatus("idle");
    }
  };

  const handleDelete = async (table, id) => {
    if (window.confirm("Are you sure?")) {
      await supabase.from(table).delete().eq("id", id);
      fetchData();
    }
  };

  const handleEdit = (item, table) => {
    setEditingId(item.id);
    setAdminTab(table);
    setFormData({
      title: item.title || item.name || "",
      subtitle: item.subtitle || "",
      author: item.author || "",
      body: item.body || "",
      price: item.price || "",
      category: item.category || "",
      league: item.league_name || "",
      teamA: item.team_a_name || "",
      teamB: item.team_b_name || "",
      score: item.score || "",
      details: item.match_details || "",
      image_url: item.image_url || null,
    });
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
        image_url: finalImageUrl,
      });
    } else if (adminTab === "products") {
      Object.assign(payload, {
        name: formData.title,
        price: Number(formData.price),
        category: formData.category,
        image_url: finalImageUrl,
      });
    } else if (["results", "predictions"].includes(adminTab)) {
      Object.assign(payload, {
        league_name: formData.league,
        team_a_name: formData.teamA,
        team_b_name: formData.teamB,
      });
      if (adminTab === "results")
        Object.assign(payload, {
          score: formData.score,
          match_details: formData.details,
        });
    }
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
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("am-ET", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const renderArticle = (item, table) => {
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
            className="w-full h-56 object-cover"
          />
        )}
        <div className="p-5">
          <h3 className="text-amber-500 font-black text-xl mb-1">
            {item.title}
          </h3>
          {item.subtitle && (
            <h4 className="text-white text-md font-bold mb-3">
              {item.subtitle}
            </h4>
          )}
          <div className="flex items-center text-zinc-500 text-xs font-bold uppercase tracking-wider mb-4 border-b border-zinc-800 pb-3">
            <span>{item.author || "Goleth"}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(item.created_at)}</span>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
            {displayBody}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => toggleReadMore(item.id)}
              className="text-amber-500 text-xs font-bold mt-2"
            >
              {isExpanded ? "Show Less (አሳጥር)" : "Read More (ሙሉውን አንብብ)"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="space-y-4 pb-24">
      {results.map((item) => (
        <div
          key={item.id}
          className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center shadow-lg relative"
        >
          {isCEO && (
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => handleEdit(item, "results")}
                className="text-blue-500"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete("results", item.id)}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          <p className="text-zinc-400 text-sm mb-4 font-bold">
            {item.league_name}
          </p>
          <div className="flex justify-between items-center mb-6 px-4">
            <div className="w-1/3 text-white font-bold">{item.team_a_name}</div>
            <div className="text-3xl font-black text-amber-500 bg-black px-4 py-2 rounded-lg border border-zinc-800">
              {item.score}
            </div>
            <div className="w-1/3 text-white font-bold">{item.team_b_name}</div>
          </div>
          {item.match_details && (
            <div className="text-sm text-zinc-400 bg-black p-3 rounded-lg">
              <p>{item.match_details}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderPredict = () => {
    if (!user) {
      return (
        <div className="pb-24 flex flex-col items-center justify-center pt-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={30} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">የቪአይፒ ጨዋታ</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              ግምት ለማስቀመጥ እና የገንዘብ ሽልማቶችን ለማሸነፍ በወር <b>50 ብር</b> የቪአይፒ (VIP) አባል
              መሆን ያስፈልጋል። ለመጀመር እባክዎ በቴሌግራም ይግቡ።
            </p>
            <TelegramLoginWidget onAuth={handleRealLogin} />
          </div>
        </div>
      );
    }

    if (!user.isVIP) {
      return (
        <div className="pb-24 flex flex-col items-center justify-center pt-10">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-6 text-center max-w-sm w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <h2 className="text-2xl font-black text-white mb-3 mt-4">
              የቪአይፒ አባልነት ያስፈልጋል
            </h2>
            <p className="text-zinc-400 text-sm mb-8">
              በወር 50 ብር በመክፈል የቪአይፒ አባል ይሁኑ!
            </p>
            <button
              onClick={handleTelebirrPayment}
              disabled={paymentStatus !== "idle"}
              className="w-full bg-[#8bc53f] hover:bg-[#7ab036] text-white font-black py-4 rounded-xl flex justify-center space-x-2"
            >
              {paymentStatus === "idle" && (
                <span>በቴሌብር ክፈሉ (Pay with Telebirr)</span>
              )}
              {paymentStatus === "loading" && (
                <>
                  <Loader2 className="animate-spin" size={20} />{" "}
                  <span>Processing...</span>
                </>
              )}
              {paymentStatus === "success" && (
                <>
                  <CheckCircle2 size={20} /> <span>Payment Successful!</span>
                </>
              )}
            </button>
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
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            ጨዋታ (Play)
          </button>
          <button
            onClick={() => setPredictTab("leaderboard")}
            className={`flex-1 py-3 rounded-full font-black text-sm transition-all ${
              predictTab === "leaderboard"
                ? "bg-amber-500 text-black shadow-md"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            ደረጃ (Leaderboard)
          </button>
        </div>

        {predictTab === "leaderboard" && (
          <div className="bg-zinc-900 w-full max-w-sm rounded-xl border border-zinc-800 overflow-hidden shadow-2xl mb-6">
            <div className="bg-black p-5 border-b border-zinc-800 text-center relative">
              <h2 className="text-white font-black text-xl">
                {activeMatch.team_a_name} vs {activeMatch.team_b_name}
              </h2>
              <p className="text-zinc-500 text-[11px] uppercase font-bold tracking-widest mt-1">
                ተወዳዳሪዎች (Contenders)
              </p>
            </div>
            <div className="p-2">
              {leaderboard.length === 0 ? (
                <div className="text-center p-8 text-zinc-500 text-sm font-bold">
                  ምንም ግምት የለም
                </div>
              ) : (
                leaderboard.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border-b border-zinc-800/50"
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-black w-5 text-center ${
                          index < 3 ? "text-amber-500" : "text-zinc-600"
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <span className="text-white font-bold text-sm">
                        {player.name}
                      </span>
                    </div>
                    <div className="bg-black px-3 py-1 rounded border border-zinc-800">
                      <span className="text-amber-500 font-black">
                        {player.team_a_score} - {player.team_b_score}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {predictTab === "play" && (
          <>
            {/* --- NEW: MATCH PREVIEW BANNER --- */}
            <div className="w-full max-w-sm mb-6 bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex justify-between items-center shadow-lg">
              <div className="text-center">
                <div className="text-amber-500 font-black text-lg">
                  {activeMatch.team_a_name}
                </div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Home
                </div>
              </div>
              <div className="text-zinc-500 font-black">VS</div>
              <div className="text-center">
                <div className="text-amber-500 font-black text-lg">
                  {activeMatch.team_b_name}
                </div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Away
                </div>
              </div>
            </div>

            {existingPrediction ? (
              <div className="bg-zinc-900 rounded-xl p-5 text-center w-full max-w-sm border border-zinc-800 shadow-xl relative mb-6">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Lock size={16} className="text-amber-500" />
                </div>
                <h2 className="text-amber-500 font-black text-lg mb-1">
                  ግምትዎ ተቀምጧል!
                </h2>
                <div className="flex justify-between items-center bg-black p-3 rounded-xl border border-zinc-800 mt-4">
                  <span className="text-white font-bold text-sm">
                    {activeMatch.team_a_name}
                  </span>
                  <span className="text-2xl font-black text-amber-500">
                    {existingPrediction.team_a_score} -{" "}
                    {existingPrediction.team_b_score}
                  </span>
                  <span className="text-white font-bold text-sm">
                    {activeMatch.team_b_name}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-xl p-6 text-center w-full max-w-sm border border-amber-500/50 shadow-2xl">
                <h2 className="text-white font-black text-xl mb-6">ውጤት ይገምቱ</h2>
                <div className="flex justify-between items-center mb-8 bg-black p-4 rounded-xl border border-zinc-800">
                  <span className="text-white font-bold w-1/3 text-sm">
                    {activeMatch.team_a_name}
                  </span>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="number"
                      min="0"
                      placeholder="-"
                      value={teamAScore}
                      onChange={(e) => {
                        setTeamAScore(e.target.value);
                        if (e.target.value !== "" && teamBInputRef.current)
                          teamBInputRef.current.focus();
                      }}
                      className="w-12 h-12 bg-zinc-900 text-amber-500 border border-zinc-700 text-center rounded-lg font-black text-xl outline-none"
                    />
                    <span className="text-zinc-500 font-bold">-</span>
                    <input
                      ref={teamBInputRef}
                      type="number"
                      min="0"
                      placeholder="-"
                      value={teamBScore}
                      onChange={(e) => setTeamBScore(e.target.value)}
                      className="w-12 h-12 bg-zinc-900 text-amber-500 border border-zinc-700 text-center rounded-lg font-black text-xl outline-none"
                    />
                  </div>
                  <span className="text-white font-bold w-1/3 text-sm">
                    {activeMatch.team_b_name}
                  </span>
                </div>
                <button
                  onClick={() => handlePredictSubmit(activeMatch.id)}
                  disabled={predictionStatus !== "idle"}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl"
                >
                  አስገባ (Submit)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderShop = () => (
    <div className="pb-24 grid grid-cols-2 gap-4">
      {products.map((item) => (
        <div
          key={item.id}
          className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex flex-col relative"
        >
          {isCEO && (
            <div className="absolute top-2 right-2 flex space-x-1 z-10">
              <button
                onClick={() => handleEdit(item, "products")}
                className="bg-blue-600 p-1.5 rounded-full"
              >
                <Edit size={14} className="text-white" />
              </button>
              <button
                onClick={() => handleDelete("products", item.id)}
                className="bg-red-600 p-1.5 rounded-full"
              >
                <Trash2 size={14} className="text-white" />
              </button>
            </div>
          )}
          {item.image_url ? (
            <img src={item.image_url} className="w-full h-40 object-cover" />
          ) : (
            <div className="w-full h-40 bg-black" />
          )}
          <div className="p-4 flex flex-col flex-grow">
            <span className="text-xs text-zinc-500 mb-1 font-bold">
              {item.category}
            </span>
            <h3 className="text-white font-bold text-sm mb-2">{item.name}</h3>
            <p className="text-amber-500 font-black text-lg mb-4">
              {item.price} ብር
            </p>
            <button className="mt-auto w-full bg-amber-500 text-black font-black py-2 rounded-lg text-sm">
              እዘዝ (Order)
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const tabs = [
    { id: "ዜና", icon: Home },
    { id: "ውጤቶች", icon: Trophy },
    { id: "ሹክሹክታ", icon: Flame },
    { id: "ግምት", icon: Target },
    { id: "ሱቅ", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-black font-sans text-white">
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
          {user ? (
            <div className="flex items-center space-x-3 bg-zinc-900 pl-3 pr-2 py-1.5 rounded-full border border-zinc-800">
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
              <button
                onClick={handleLogout}
                className="ml-2 text-zinc-500 hover:text-red-500 transition-colors p-1"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab("ግምት")}
              className="text-xs font-bold bg-[#229ED9] hover:bg-[#1CA0DE] px-4 py-2 rounded-full text-white transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {activeTab === "ዜና" && (
          <div className="space-y-4 pb-24">
            {news.map((n) => renderArticle(n, "news"))}
          </div>
        )}
        {activeTab === "ውጤቶች" && renderResults()}
        {activeTab === "ሹክሹክታ" && (
          <div className="space-y-4 pb-24">
            {gossip.map((g) => renderArticle(g, "gossip"))}
          </div>
        )}
        {activeTab === "ግምት" && renderPredict()}
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
              className={`flex flex-col items-center p-2 ${
                isActive ? "text-amber-500" : "text-zinc-600"
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
