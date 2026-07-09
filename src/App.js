import React, { useState, useEffect } from "react";
import {
  Home,
  Trophy,
  Flame,
  Target,
  ShoppingBag,
  User,
  Share2,
  X,
  PlusCircle,
  UploadCloud,
  Trash2,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase Connection
const supabaseUrl = "https://cklchptjwcifydboozls.supabase.co";
const supabaseKey = "sb_publishable_Eq6KwixhAMAO42Zp3SEJVg_ed9fsVj3";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [activeTab, setActiveTab] = useState("ዜና");
  const [isVIP, setIsVIP] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isCEO, setIsCEO] = useState(false); // New state to show CEO controls
  const [uploading, setUploading] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  // Database States
  const [news, setNews] = useState([]);
  const [gossip, setGossip] = useState([]);
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [predictions, setPredictions] = useState([]);

  // Admin Form States
  const [adminTab, setAdminTab] = useState("news");
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

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

  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    setTimeout(() => setTapCount(0), 3000);

    if (newCount >= 5) {
      const password = window.prompt("Enter CEO Password:");
      if (password === "admin123") {
        setIsCEO(true);
        setShowAdmin(true);
      } else if (password !== null) {
        alert("Access Denied");
      }
      setTapCount(0);
    }
  };

  const handleDelete = async (table, id) => {
    if (window.confirm("Are you sure you want to delete this? (እርግጠኛ ነዎት?)")) {
      await supabase.from(table).delete().eq("id", id);
      fetchData();
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let finalImageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, imageFile);
      if (!uploadError) {
        const { data } = supabase.storage.from("images").getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }
    }

    if (adminTab === "news" || adminTab === "gossip") {
      await supabase.from(adminTab).insert([
        {
          title: formData.title,
          subtitle: formData.subtitle,
          author: formData.author || "ZenaSoccer",
          body: formData.body,
          image_url: finalImageUrl,
        },
      ]);
    } else if (adminTab === "products") {
      await supabase.from("products").insert([
        {
          name: formData.title,
          price: Number(formData.price),
          category: formData.category,
          image_url: finalImageUrl,
        },
      ]);
    } else if (adminTab === "results") {
      await supabase.from("results").insert([
        {
          league_name: formData.league,
          team_a_name: formData.teamA,
          team_b_name: formData.teamB,
          score: formData.score,
          match_details: formData.details,
        },
      ]);
    } else if (adminTab === "predictions") {
      // Deactivate old predictions first
      await supabase
        .from("predictions")
        .update({ is_active: false })
        .neq("id", 0);
      await supabase.from("predictions").insert([
        {
          league_name: formData.league,
          team_a_name: formData.teamA,
          team_b_name: formData.teamB,
        },
      ]);
    }

    setFormData({});
    setImageFile(null);
    setUploading(false);
    setShowAdmin(false);
    fetchData();
    alert("Published successfully!");
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("am-ET", options);
  };

  // --- UI COMPONENTS ---

  const renderArticle = (item, table) => (
    <div
      key={item.id}
      className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-800 relative"
    >
      {isCEO && (
        <button
          onClick={() => handleDelete(table, item.id)}
          className="absolute top-2 right-2 bg-red-600 p-2 rounded-full z-10 hover:bg-red-700"
        >
          <Trash2 size={16} className="text-white" />
        </button>
      )}
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-56 object-cover"
        />
      )}
      <div className="p-5">
        <h3 className="text-amber-500 font-black text-xl mb-1 leading-tight">
          {item.title}
        </h3>
        {item.subtitle && (
          <h4 className="text-white text-md font-bold mb-3">{item.subtitle}</h4>
        )}

        <div className="flex items-center text-zinc-500 text-xs font-bold uppercase tracking-wider mb-4 border-b border-zinc-800 pb-3">
          <span>{item.author || "ZenaSoccer"}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(item.created_at)}</span>
        </div>

        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
          {item.body}
        </p>
        <div className="flex justify-end mt-4">
          <button className="bg-zinc-800 p-2 rounded-full text-zinc-400 hover:text-amber-500">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-4 pb-24">
      {results.length === 0 && (
        <p className="text-zinc-500 text-center mt-10">
          ምንም ውጤት የለም (No Results)
        </p>
      )}
      {results.map((item) => (
        <div
          key={item.id}
          className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center shadow-lg relative"
        >
          {isCEO && (
            <button
              onClick={() => handleDelete("results", item.id)}
              className="absolute top-2 right-2 text-red-500"
            >
              <Trash2 size={16} />
            </button>
          )}
          <p className="text-zinc-400 text-sm mb-4 font-bold tracking-wide">
            {item.league_name}
          </p>
          <div className="flex justify-between items-center mb-6 px-4">
            <div className="flex flex-col items-center w-1/3">
              <span className="text-white font-bold">{item.team_a_name}</span>
            </div>
            <div className="text-3xl font-black text-amber-500 bg-black px-4 py-2 rounded-lg border border-zinc-800">
              {item.score}
            </div>
            <div className="flex flex-col items-center w-1/3">
              <span className="text-white font-bold">{item.team_b_name}</span>
            </div>
          </div>
          {item.match_details && (
            <div className="text-sm text-zinc-400 bg-black p-3 rounded-lg border border-zinc-800">
              <p>{item.match_details}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderPredict = () => {
    const activeMatch = predictions[0];

    return (
      <div className="pb-24 flex flex-col items-center justify-center pt-10">
        {!isVIP ? (
          <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-6 text-center max-w-sm w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <h2 className="text-2xl font-black text-white mb-3 mt-4">
              የቪአይፒ አባልነት ያስፈልጋል
            </h2>
            <p className="text-zinc-400 text-sm mb-8">
              በወር 50 ብር በመክፈል የቪአይፒ አባል ይሁኑ እና በየሳምንቱ ግምት በማስቀመጥ የገንዘብ ሽልማቶችን
              ያሸንፉ!
            </p>
            <button className="w-full bg-amber-500 text-black font-black py-4 rounded-xl">
              በቴሌብር ክፈሉ
            </button>
          </div>
        ) : !activeMatch ? (
          <p className="text-zinc-500">ምንም ጨዋታ የለም (No active match)</p>
        ) : (
          <div className="bg-zinc-900 rounded-xl p-6 text-center w-full max-w-sm border border-amber-500/50 shadow-2xl relative">
            {isCEO && (
              <button
                onClick={() => handleDelete("predictions", activeMatch.id)}
                className="absolute top-2 right-2 text-red-500"
              >
                <Trash2 size={16} />
              </button>
            )}
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

  const renderShop = () => (
    <div className="pb-24 grid grid-cols-2 gap-4">
      {products.map((item) => (
        <div
          key={item.id}
          className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex flex-col relative"
        >
          {isCEO && (
            <button
              onClick={() => handleDelete("products", item.id)}
              className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full z-10"
            >
              <Trash2 size={14} className="text-white" />
            </button>
          )}
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-black" />
          )}
          <div className="p-4 flex flex-col flex-grow">
            <span className="text-xs text-zinc-500 mb-1 font-bold uppercase">
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

  const renderAdmin = () => (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto flex flex-col p-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-6 mt-4">
        <h2 className="text-amber-500 font-black text-2xl tracking-wide">
          CEO Dashboard
        </h2>
        <button
          onClick={() => setShowAdmin(false)}
          className="bg-zinc-900 p-2 rounded-full"
        >
          <X className="text-white w-6 h-6" />
        </button>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {["news", "gossip", "products", "results", "predictions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setAdminTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${
              adminTab === tab
                ? "bg-amber-500 text-black"
                : "bg-zinc-900 text-zinc-400"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <form onSubmit={handleAdminSubmit} className="space-y-4">
        {(adminTab === "news" || adminTab === "gossip") && (
          <>
            <input
              required
              placeholder="Main Title (ርዕስ)"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500"
            />
            <input
              placeholder="Subtitle (ንዑስ ርዕስ)"
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500"
            />
            <input
              placeholder="Author (ደራሲ - Default: ZenaSoccer)"
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500"
            />
            <textarea
              required
              rows="4"
              placeholder="Body (ጽሑፍ)"
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500"
            ></textarea>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:bg-zinc-800 file:text-white"
            />
          </>
        )}

        {(adminTab === "results" || adminTab === "predictions") && (
          <>
            <input
              required
              placeholder="League (የሊግ ስም)"
              onChange={(e) =>
                setFormData({ ...formData, league: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                placeholder="Team A (ቡድን 1)"
                onChange={(e) =>
                  setFormData({ ...formData, teamA: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl"
              />
              <input
                required
                placeholder="Team B (ቡድን 2)"
                onChange={(e) =>
                  setFormData({ ...formData, teamB: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl"
              />
            </div>
            {adminTab === "results" && (
              <>
                <input
                  required
                  placeholder="Score (ምሳሌ: 2 - 1)"
                  onChange={(e) =>
                    setFormData({ ...formData, score: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl"
                />
                <input
                  placeholder="Scorers (ሳካ 12', ኦዴጋርድ 45')"
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl"
                />
              </>
            )}
          </>
        )}

        <button
          disabled={uploading}
          type="submit"
          className="w-full bg-amber-500 text-black font-black py-4 rounded-xl mt-4 flex justify-center"
        >
          {uploading ? "Uploading..." : "Publish (አትም)"}
        </button>
      </form>
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
      <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 p-4 flex justify-between items-center shadow-md">
        <div
          className="flex items-center space-x-3 cursor-pointer select-none"
          onClick={handleLogoTap}
        >
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
            <span className="text-black font-black text-xs">GOL</span>
          </div>
          <h1 className="text-white font-black text-2xl tracking-widest">
            GOL<span className="text-amber-500">ET</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-black rounded-full px-3 py-1.5 border border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">
              {isVIP ? "VIP" : "Free"}
            </span>
            <div
              className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer ${
                isVIP ? "bg-amber-500" : "bg-zinc-800"
              }`}
              onClick={() => setIsVIP(!isVIP)}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isVIP ? "translate-x-4" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
          {isCEO && (
            <button
              onClick={() => setShowAdmin(true)}
              className="bg-amber-500/20 text-amber-500 p-2 rounded-full font-bold text-xs"
            >
              CEO
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

      {showAdmin && renderAdmin()}

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
