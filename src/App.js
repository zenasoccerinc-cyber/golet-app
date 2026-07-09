import React, { useState, useEffect } from "react";
import {
  Home,
  Trophy,
  Flame,
  Target,
  ShoppingBag,
  X,
  Trash2,
  Edit,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase Connection
const supabaseUrl = "https://cklchptjwcifydboozls.supabase.co";
const supabaseKey = "sb_publishable_Eq6KwixhAMAO42Zp3SEJVg_ed9fsVj3";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  // Authentication & Profile State
  const [user, setUser] = useState(null);

  // Navigation & Admin State
  const [activeTab, setActiveTab] = useState("ዜና");
  const [showAdmin, setShowAdmin] = useState(false);
  const [isCEO, setIsCEO] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  // App Data States
  const [news, setNews] = useState([]);
  const [gossip, setGossip] = useState([]);
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});

  // Telebirr Mock State
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, loading, success

  useEffect(() => {
    fetchData();
  }, []);

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

    if (nData) setNews(nData);
    if (gData) setGossip(gData);
    if (pData) setProducts(pData);
    if (rData) setResults(rData);
    if (prData) setPredictions(prData);
  };

  const toggleReadMore = (id) => {
    setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
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

  const handleMockLogin = () => {
    // Simulating a fast Telegram login
    setUser({
      name: "Goleth Fan",
      isVIP: false,
    });
  };

  const handleTelebirrPayment = () => {
    setPaymentStatus("loading");
    // Simulate network request to Telebirr (3 seconds)
    setTimeout(() => {
      setPaymentStatus("success");
      // Upgrade user to VIP
      setTimeout(() => {
        setUser({ ...user, isVIP: true });
        setPaymentStatus("idle");
      }, 2000);
    }, 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("am-ET", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- UI RENDERING ---

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] mb-6">
          <span className="text-black font-black text-2xl tracking-tighter">
            GOL
          </span>
        </div>
        <h1 className="text-white font-black text-4xl tracking-widest mb-2">
          GOLETH
        </h1>
        <p className="text-zinc-400 text-center mb-12">
          The heartbeat of Ethiopian football.
        </p>

        <button
          onClick={handleMockLogin}
          className="w-full max-w-sm bg-[#229ED9] hover:bg-[#1CA0DE] text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-3 transition-colors"
        >
          <Send size={20} />
          <span>Log in with Telegram</span>
        </button>
      </div>
    );
  }

  const renderArticle = (item) => {
    const isExpanded = expandedPosts[item.id];
    const displayBody =
      item.body?.length > 150 && !isExpanded
        ? item.body.substring(0, 150) + "..."
        : item.body;

    return (
      <div
        key={item.id}
        className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-800 mb-4"
      >
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
          <div className="text-zinc-500 text-xs font-bold uppercase mb-4 border-b border-zinc-800 pb-3">
            {formatDate(item.created_at)}
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
            {displayBody}
          </p>
          {item.body?.length > 150 && (
            <button
              onClick={() => toggleReadMore(item.id)}
              className="text-amber-500 text-xs font-bold mt-2"
            >
              {isExpanded ? "Show Less" : "Read More (ሙሉውን አንብብ)"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderPredict = () => {
    const activeMatch = predictions[0];

    if (!user.isVIP) {
      return (
        <div className="pb-24 flex flex-col items-center justify-center pt-10">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-6 text-center max-w-sm w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <h2 className="text-2xl font-black text-white mb-3 mt-4">
              የቪአይፒ አባልነት ያስፈልጋል
            </h2>
            <p className="text-zinc-400 text-sm mb-8">
              በወር 50 ብር በመክፈል የቪአይፒ አባል ይሁኑ እና በየሳምንቱ ግምት በማስቀመጥ የገንዘብ ሽልማቶችን
              ያሸንፉ!
            </p>

            <button
              onClick={handleTelebirrPayment}
              disabled={paymentStatus !== "idle"}
              className="w-full bg-[#8bc53f] hover:bg-[#7ab036] text-white font-black py-4 rounded-xl flex items-center justify-center space-x-2 transition-colors"
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

    return (
      <div className="pb-24 flex flex-col items-center pt-10">
        {!activeMatch ? (
          <p className="text-zinc-500">ምንም ጨዋታ የለም (No active match)</p>
        ) : (
          <div className="bg-zinc-900 rounded-xl p-6 text-center w-full max-w-sm border border-amber-500/50 shadow-2xl">
            <p className="text-zinc-400 text-xs font-bold tracking-wide mb-2">
              {activeMatch.league_name}
            </p>
            <h2 className="text-amber-500 font-black text-xl mb-6">
              የሳምንቱ ጨዋታ ግምት
            </h2>
            <div className="flex justify-between items-center mb-8 bg-black p-4 rounded-xl border border-zinc-800">
              <span className="text-white font-bold w-1/3">
                {activeMatch.team_a_name}
              </span>
              <div className="flex space-x-2 items-center">
                <input
                  type="number"
                  className="w-10 h-10 bg-zinc-900 text-amber-500 border border-zinc-700 text-center rounded-lg text-lg font-bold"
                  defaultValue="0"
                />
                <span className="text-zinc-600">-</span>
                <input
                  type="number"
                  className="w-10 h-10 bg-zinc-900 text-amber-500 border border-zinc-700 text-center rounded-lg text-lg font-bold"
                  defaultValue="0"
                />
              </div>
              <span className="text-white font-bold w-1/3">
                {activeMatch.team_b_name}
              </span>
            </div>
            <button className="w-full bg-amber-500 text-black font-black py-3 rounded-xl">
              አስገባ (Submit)
            </button>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: "ዜና", icon: Home },
    { id: "ውጤቶች", icon: Trophy },
    { id: "ሹክሹክታ", icon: Flame },
    { id: "ግምት", icon: Target },
    { id: "ሱቅ", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 p-4 flex justify-between items-center shadow-md">
        <div
          className="flex items-center space-x-3 cursor-pointer select-none"
          onClick={handleLogoTap}
        >
          <h1 className="text-white font-black text-2xl tracking-widest">
            GOL<span className="text-amber-500">ETH</span>
          </h1>
        </div>
        <div className="flex items-center space-x-3 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-[10px]">GF</span>
          </div>
          <span className="text-xs font-bold text-zinc-300">{user.name}</span>
          {user.isVIP && (
            <span className="text-[10px] font-black bg-amber-500 text-black px-2 py-0.5 rounded text-uppercase">
              VIP
            </span>
          )}
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {activeTab === "ዜና" && (
          <div className="pb-24">{news.map(renderArticle)}</div>
        )}
        {activeTab === "ግምት" && renderPredict()}
        {/* Other tabs omitted for brevity in demo layout but function identically */}
        {(activeTab === "ውጤቶች" ||
          activeTab === "ሹክሹክታ" ||
          activeTab === "ሱቅ") && (
          <div className="text-center text-zinc-500 mt-20">
            ይህ ገጽ በቅርቡ ይመጣል (Coming Soon to Demo)
          </div>
        )}
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
