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
  const [showProfile, setShowProfile] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [isCEO, setIsCEO] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});

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
      .limit(10);
    const { data: gData } = await supabase
      .from("gossip")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
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
        isVIP: newUser.is_vip,
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

  const toggleUserVIP = async (targetUser) => {
    const isCurrentlyVip =
      targetUser.is_vip && new Date(targetUser.vip_until) > new Date();
    if (isCurrentlyVip) {
      if (window.confirm(`Remove VIP from ${targetUser.name}?`)) {
        await supabase
          .from("users")
          .update({ is_vip: false, vip_until: null })
          .eq("id", targetUser.id);
        fetchCEOUsers();
      }
    } else {
      if (window.confirm(`Give 30 Days VIP to ${targetUser.name}?`)) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        await supabase
          .from("users")
          .update({ is_vip: true, vip_until: expirationDate.toISOString() })
          .eq("id", targetUser.id);
        fetchCEOUsers();
      }
    }
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

  const handleResolveMatch = async (match) => {
    const scoreA = window.prompt(`Enter final score for ${match.team_a_name}:`);
    if (scoreA === null || scoreA === "") return;
    const scoreB = window.prompt(`Enter final score for ${match.team_b_name}:`);
    if (scoreB === null || scoreB === "") return;
    const pointsToAward = window.prompt(
      "How many points should the winners get?",
      "10"
    );
    if (pointsToAward === null || pointsToAward === "") return;

    if (
      window.confirm(
        `Are you sure? This will award ${pointsToAward} points to everyone who guessed exactly ${scoreA} - ${scoreB}!`
      )
    ) {
      setUploading(true);
      const { data: guesses } = await supabase
        .from("user_predictions")
        .select("*")
        .eq("match_id", match.id);
      if (guesses) {
        const winners = guesses.filter(
          (g) =>
            g.team_a_score === Number(scoreA) &&
            g.team_b_score === Number(scoreB)
        );
        for (let winner of winners) {
          const { data: userRecord } = await supabase
            .from("users")
            .select("total_points")
            .eq("id", winner.user_id)
            .single();
          if (userRecord) {
            const newPoints =
              (userRecord.total_points || 0) + Number(pointsToAward);
            await supabase
              .from("users")
              .update({ total_points: newPoints })
              .eq("id", winner.user_id);
          }
        }
        alert(
          `Success! Awarded ${pointsToAward} points to ${winners.length} winners.`
        );
      }
      setUploading(false);
      fetchData();
    }
  };

  const handleDelete = async (table, id) => {
    if (window.confirm("Are you sure?")) {
      await supabase.from(table).delete().eq("id", id);
      fetchData();
    }
  };
  const handleEdit = (item, table) => {
    setShowAdmin(true);
  };
  const toggleReadMore = (id) =>
    setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
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
        className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-800 relative mb-6"
      >
        {isCEO && (
          <div className="absolute top-2 right-2 flex space-x-2 z-10">
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
          <h3 className="text-amber-500 font-black text-xl leading-tight mb-1">
            {item.title}
          </h3>
          {item.subtitle && (
            <h4 className="text-white text-md font-bold mb-1">
              {item.subtitle}
            </h4>
          )}
          <div className="flex items-center text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-3 pb-3 border-b border-zinc-800/50">
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
              className="text-amber-500 text-xs font-bold mt-3"
            >
              {isExpanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
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
                VIP Member
              </span>
            ) : (
              <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">
                Free User
              </span>
            )}
          </div>
          <div className="space-y-3 mb-8">
            <div className="flex justify-between p-3 bg-black rounded-lg border border-zinc-800">
              <span className="text-zinc-500 font-bold text-xs">
                ቀሪ ቀናት (Days Left)
              </span>
              <span className="text-white font-black text-xs">
                {daysLeft} Days
              </span>
            </div>
            <div className="flex justify-between p-3 bg-black rounded-lg border border-zinc-800">
              <span className="text-zinc-500 font-bold text-xs">
                ጠቅላላ ነጥብ (Total Points)
              </span>
              <span className="text-amber-500 font-black text-xs">
                {totalPoints} pts
              </span>
            </div>
          </div>
          <p className="text-center text-zinc-500 text-xs mb-4">
            Contact: contactgoleth@gmail.com
          </p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 font-bold py-3 rounded-xl transition-all"
          >
            <LogOut size={18} /> <span>ውጣ (Logout)</span>
          </button>
        </div>
      </div>
    );
  };

  const renderUserDashboard = () => (
    <div className="fixed inset-0 z-[100] flex flex-col p-4 bg-black/95">
      <div className="flex justify-between items-center mb-6 mt-4">
        <h2 className="text-amber-500 font-black text-xl">
          CEO User Management
        </h2>
        <button
          onClick={() => setShowUserDashboard(false)}
          className="text-white bg-zinc-800 p-2 rounded-full"
        >
          <X size={20} />
        </button>
      </div>
      <div className="overflow-y-auto space-y-3 pb-20">
        {allUsers.map((u) => {
          const isVip = u.is_vip && new Date(u.vip_until) > new Date();
          return (
            <div
              key={u.id}
              className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-bold">{u.name}</p>
                <p className="text-zinc-500 text-xs mt-1">
                  Points: {u.total_points || 0}
                </p>
              </div>
              <button
                onClick={() => toggleUserVIP(u)}
                className={`px-4 py-2 rounded-lg font-bold text-xs ${
                  isVip
                    ? "bg-amber-500 text-black"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {isVip ? "Remove VIP" : "Make VIP"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

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
        {isCEO && (
          <div className="w-full max-w-sm mb-4 flex justify-end space-x-2">
            <button
              onClick={() => setShowUserDashboard(true)}
              className="bg-zinc-800 text-white flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold border border-zinc-700 hover:border-amber-500"
            >
              <Users size={14} />
              <span>Manage Users</span>
            </button>
            <button
              onClick={() => handleResolveMatch(activeMatch)}
              className="bg-amber-500 text-black flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold"
            >
              <Trophy size={14} />
              <span>Award Points</span>
            </button>
          </div>
        )}

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
                          index < 3 ? "text-amber-500" : "text-white/50"
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
              <div className="bg-zinc-900 rounded-xl p-6 text-center w-full max-w-sm border border-amber-500/50 shadow-2xl relative">
                <h2 className="text-white font-black text-xl mb-6 mt-4">
                  ውጤት ይገምቱ
                </h2>
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
            <div className="flex items-center space-x-2 mb-4">
              <p className="text-amber-500 font-black text-lg">
                {item.price} ብር
              </p>
              {user && user.isVIP && (
                <span className="bg-amber-500/20 text-amber-500 text-[10px] px-1.5 py-0.5 rounded font-bold">
                  -10% VIP
                </span>
              )}
            </div>
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
    { id: "ስፖርት", icon: Trophy },
    { id: "ሹክሹክታ", icon: Flame },
    { id: "ቪአይፒ", icon: Crown },
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

      <main className="p-4 max-w-lg mx-auto">
        {activeTab === "ዜና" && (
          <div className="space-y-4 pb-24">
            {news.map((n) => renderArticle(n, "news"))}
          </div>
        )}
        {activeTab === "ስፖርት" && (
          <div className="text-center pt-20 text-zinc-500 font-bold">
            የስፖርት ዜናዎች በቅርብ ቀን...
          </div>
        )}
        {activeTab === "ሹክሹክታ" && (
          <div className="space-y-4 pb-24">
            {gossip.map((g) => renderArticle(g, "gossip"))}
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
  );
}
