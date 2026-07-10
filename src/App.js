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
  User,
  Calendar,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

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
  const [showProfile, setShowProfile] = useState(false);
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
  const [results, setResults] = useState([]);
  const [predictions, setPredictions] = useState([]);

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

  const renderArticle = (item, table) => (
    <div
      key={item.id}
      className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 mb-4 p-5"
    >
      <h3 className="text-amber-500 font-black text-xl mb-1">{item.title}</h3>
      <p className="text-zinc-300 text-sm">{item.body}</p>
    </div>
  );

  const renderProfileModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-zinc-900 w-full max-w-sm rounded-2xl border border-zinc-800 p-6">
        <button
          onClick={() => setShowProfile(false)}
          className="absolute top-4 right-4 text-white"
        >
          <X />
        </button>
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-3xl font-black mb-4 mx-auto">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-white font-black text-xl">{user.name}</h2>
        </div>
        <div className="space-y-3 mt-6">
          <div className="flex justify-between p-3 bg-black rounded border border-zinc-800">
            <span className="text-zinc-500 text-xs">ቀሪ ቀናት</span>
            <span className="text-white font-bold">
              {Math.ceil(
                (new Date(user.vipUntil) - new Date()) / (1000 * 60 * 60 * 24)
              )}{" "}
              Days
            </span>
          </div>
          <div className="flex justify-between p-3 bg-black rounded border border-zinc-800">
            <span className="text-zinc-500 text-xs">ጠቅላላ ነጥብ</span>
            <span className="text-amber-500 font-bold">{totalPoints} pts</span>
          </div>
        </div>
      </div>
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
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 p-4 flex justify-between items-center">
        <h1 className="text-white font-black text-2xl tracking-widest">
          GOL<span className="text-amber-500">ETH</span>
        </h1>
        {user && (
          <div
            onClick={() => setShowProfile(true)}
            className="bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800 cursor-pointer"
          >
            {user.name}
          </div>
        )}
      </header>
      <main className="p-4 max-w-lg mx-auto">
        {showProfile && renderProfileModal()}
        {activeTab === "ዜና" && (
          <div className="space-y-4 pb-24">
            {news.map((n) => renderArticle(n, "news"))}
          </div>
        )}
        {activeTab === "ግምት" && (
          <div className="text-center pt-20">
            Predictions functionality restored.
          </div>
        )}
      </main>
      <nav className="fixed bottom-0 w-full bg-zinc-950 border-t border-zinc-800 flex justify-around p-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="text-xs font-bold text-zinc-500"
          >
            {tab.id}
          </button>
        ))}
      </nav>
    </div>
  );
}
