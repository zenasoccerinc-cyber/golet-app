import React, { useState, useEffect } from "react";
import {
  Home,
  Trophy,
  Flame,
  Users,
  Target,
  ShoppingBag,
  X,
  Trash2,
  ChevronLeft,
  MessageCircle,
  PlusCircle,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Secure Supabase Connection
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [activeTab, setActiveTab] = useState("ዋና");
  const [activePost, setActivePost] = useState(null); // Controls Single Post View
  
  // Shop States
  const [shopCategory, setShopCategory] = useState("ሁሉም");
  const [shopSubCategory, setShopSubCategory] = useState("ሁሉም");

  // CEO States
  const [isCEO, setIsCEO] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState("posts");
  const [uploading, setUploading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  // Data States
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      setPosts(postsData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleLogoTap = () => {
    setActiveTab("ዋና");
    setActivePost(null);
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
    if (window.confirm("Are you sure? (እርግጠኛ ነዎት?)")) {
      await supabase.from(table).delete().eq("id", id);
      fetchData();
      setActivePost(null);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let finalImageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("images").upload(fileName, imageFile);
      if (!uploadError) {
        const { data } = supabase.storage.from("images").getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }
    }

    if (adminTab === "posts") {
      await supabase.from("posts").insert([
        {
          category: formData.postCategory || "ዋና",
          title: formData.title,
          subtitle: formData.subtitle,
          excerpt: formData.excerpt,
          body: formData.body,
          image_url: finalImageUrl,
          author: "GOLETH",
        },
      ]);
    } else if (adminTab === "products") {
      const optionsArray = formData.options ? formData.options.split(",").map(opt => opt.trim()) : [];
      await supabase.from("products").insert([
        {
          name: formData.title,
          brand: formData.brand,
          price: Number(formData.price),
          vip_price: Number(formData.vipPrice),
          category: formData.shopCat,
          options: optionsArray,
          image_url: finalImageUrl,
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("am-ET", options).toUpperCase();
  };

  // --- UI COMPONENTS ---

  const renderBanners = () => (
    <div className="mb-6 space-y-3">
      <a href="https://t.me/goleth_orders_bot" target="_blank" rel="noreferrer" className="block bg-blue-700 rounded-xl p-4 flex justify-between items-center shadow-lg border border-blue-600">
        <div>
          <h3 className="text-white font-bold text-sm">ልዩ ዕቃ ማዘዝ ይፈልጋሉ?</h3>
          <p className="text-blue-200 text-xs mt-1">ከአማዞን (AMAZON) ወይም ከየትኛውም ቦታ፡ እኛ እናመጣሎታለን!</p>
        </div>
        <PlusCircle className="text-blue-300" size={24} />
      </a>
      <a href="https://t.me/goleth_app_bot" target="_blank" rel="noreferrer" className="block bg-zinc-900 rounded-xl p-3 flex justify-center items-center border border-zinc-800 text-amber-500 font-bold text-sm">
        <MessageCircle size={18} className="mr-2" /> ያግኙን (Contact Us)
      </a>
    </div>
  );

  const renderSinglePost = () => (
    <div className="pb-24 animate-in fade-in zoom-in-95 duration-200">
      <button onClick={() => setActivePost(null)} className="flex items-center text-zinc-400 mb-4 hover:text-white">
        <ChevronLeft size={20} className="mr-1" /> ወደ ኋላ ተመለስ (Back)
      </button>
      
      {isCEO && (
        <button onClick={() => handleDelete("posts", activePost.id)} className="bg-red-600 text-white p-2 rounded-lg text-xs font-bold mb-4 w-full">
          Delete Post
        </button>
      )}

      {activePost.image_url && <img src={activePost.image_url} alt={activePost.title} className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg" />}
      
      <h1 className="text-3xl font-black text-amber-500 mb-2 leading-tight">{activePost.title}</h1>
      {activePost.subtitle && <h2 className="text-xl text-zinc-300 font-bold mb-4">{activePost.subtitle}</h2>}
      
      <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">
        {activePost.author} • {formatDate(activePost.created_at)}
      </div>

      {activePost.excerpt && <p className="text-lg text-white font-medium mb-6 italic border-l-2 border-amber-500 pl-4">{activePost.excerpt}</p>}
      
      <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
        {activePost.body}
      </div>
    </div>
  );

  const renderPostFeed = () => {
    const filteredPosts = activeTab === "ዋና" ? posts : posts.filter(p => p.category === activeTab);

    if (filteredPosts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center mt-20 text-zinc-500">
          <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center mb-4">!</div>
          <p>ምንም አልተገኘም (Empty)</p>
          <p className="text-xs mt-1">Check back later for updates.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 pb-24">
        {["ዋና", "ስፖርት", "ሹክሹክታ", "ማህበራዊ"].includes(activeTab) && renderBanners()}
        
        {/* Layout Engine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post, index) => {
            // Hero Layout (Index 0)
            if (index === 0) {
              return (
                <div key={post.id} onClick={() => setActivePost(post)} className="col-span-1 md:col-span-2 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer shadow-lg mb-2">
                  {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-60 object-cover" />}
                  <div className="p-5">
                    <h2 className="text-2xl font-black text-amber-500 mb-2 leading-tight">{post.title}</h2>
                    <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-3">
                      {post.author} • {formatDate(post.created_at)}
                    </div>
                    <p className="text-zinc-400 text-sm line-clamp-2">{post.excerpt || post.body}</p>
                  </div>
                </div>
              );
            }
            
            // Grid Layout (Index 1 to 4)
            if (index > 0 && index <= 4) {
              return (
                <div key={post.id} onClick={() => setActivePost(post)} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer flex flex-col">
                  {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-36 object-cover" />}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-md font-bold text-white mb-2 line-clamp-2 leading-snug">{post.title}</h3>
                    <div className="mt-auto text-zinc-500 text-[10px] font-bold uppercase">{formatDate(post.created_at)}</div>
                  </div>
                </div>
              );
            }

            // List Layout (Index 5+)
            return (
              <div key={post.id} onClick={() => setActivePost(post)} className="col-span-1 md:col-span-2 flex items-center bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer p-2">
                {post.image_url && <img src={post.image_url} alt={post.title} className="w-24 h-24 object-cover rounded-lg" />}
                <div className="pl-4 pr-2 flex flex-col justify-center py-1">
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{post.title}</h3>
                  <div className="text-zinc-500 text-[10px] font-bold uppercase">{formatDate(post.created_at)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderShop = () => {
    const primaryCats = ["ሁሉም", "ወንድ", "ሴት", "ልጅ", "መድሀኒት"];
    const secondaryCats = ["ሁሉም", "ልብስ", "ጫማ", "ሌሎች"];

    let filtered = products;
    if (shopCategory !== "ሁሉም") filtered = filtered.filter(p => p.category === shopCategory);
    
    // Quick frontend filter logic for subcategories if implemented by keyword in category or options
    // For now, if secondary category is selected, we filter by seeing if the keyword exists in options or brand
    if (shopCategory !== "ሁሉም" && shopSubCategory !== "ሁሉም") {
       filtered = filtered.filter(p => (p.options && p.options.includes(shopSubCategory)) || (p.brand && p.brand.includes(shopSubCategory)));
    }

    return (
      <div className="pb-24">
        {/* Primary Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
          {primaryCats.map(cat => (
            <button key={cat} onClick={() => { setShopCategory(cat); setShopSubCategory("ሁሉም"); }} 
              className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${shopCategory === cat ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 border border-zinc-800"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Banner */}
        <div className="mb-6">
          <a href="https://t.me/goleth_orders_bot" target="_blank" rel="noreferrer" className="block bg-blue-700 rounded-xl p-4 flex justify-between items-center shadow-lg border border-blue-600">
            <div>
              <h3 className="text-white font-bold text-sm">ልዩ ዕቃ ማዘዝ ይፈልጋሉ?</h3>
              <p className="text-blue-200 text-xs mt-1">ከአማዞን (AMAZON) ወይም ከየትኛውም ቦታ፡ እኛ እናመጣሎታለን!</p>
            </div>
            <PlusCircle className="text-blue-300" size={24} />
          </a>
        </div>

        {/* Secondary Categories (Only show if a primary category is selected) */}
        {shopCategory !== "ሁሉም" && shopCategory !== "መድሀኒት" && (
           <div className="flex space-x-2 overflow-x-auto pb-6 mb-2 no-scrollbar">
           {secondaryCats.map(cat => (
             <button key={cat} onClick={() => setShopSubCategory(cat)} 
               className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${shopSubCategory === cat ? "bg-white text-black" : "bg-zinc-800 text-zinc-400"}`}>
               {cat}
             </button>
           ))}
         </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col relative">
              {isCEO && (
                <button onClick={() => handleDelete("products", item.id)} className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full z-10">
                  <Trash2 size={14} className="text-white" />
                </button>
              )}
              {item.category && <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-br-lg z-10 uppercase tracking-widest">FREE DELIVERY</div>}
              
              <div className="bg-white pt-8 pb-4 px-2 flex justify-center">
                 {item.image_url ? <img src={item.image_url} alt={item.name} className="h-28 object-contain" /> : <div className="h-28" />}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <p className="text-white font-black text-lg">{item.price} ብር</p>
                {item.vip_price && (
                  <p className="text-amber-500 font-bold text-xs mt-1 mb-3 flex items-center">
                    👑 VIP: {item.vip_price} ብር
                  </p>
                )}
                
                <h3 className="text-zinc-300 font-bold text-sm mb-1 leading-tight">{item.name}</h3>
                {item.brand && <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-4">{item.brand}</p>}
                
                {item.options && item.options.length > 0 && (
                  <div className="mb-4">
                     <p className="text-zinc-500 text-[10px] mb-2">አማራጭ ይምረጡ (OPTION):</p>
                     <div className="flex flex-wrap gap-2">
                        {item.options.map(opt => (
                          <span key={opt} className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-2 py-1 rounded-md">{opt}</span>
                        ))}
                     </div>
                  </div>
                )}
                
                <a href="https://t.me/goleth_orders_bot" target="_blank" rel="noreferrer" className="mt-auto w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm flex justify-center items-center">
                  <ShoppingBag size={16} className="mr-2" /> እዘዝ
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVIP = () => (
    <div className="pb-24">
      {renderBanners()}
      <div className="flex flex-col items-center justify-center pt-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl">
          <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700">
            <Users className="text-blue-400" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">እንኳን በደህና መጡ!</h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            አዲስ መለያ ለመፍጠር ወይም ለመግባት የቴሌግራም ቁልፉን ይጫኑ::
          </p>
          <a href="https://t.me/goleth_app_bot" target="_blank" rel="noreferrer" className="w-full bg-[#2AABEE] text-white font-bold py-3.5 rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors">
             <MessageCircle size={20} className="mr-2 fill-current" /> Log in with Telegram
          </a>
        </div>
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto flex flex-col p-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-6 mt-4">
        <h2 className="text-amber-500 font-black text-2xl tracking-wide">CEO Dashboard</h2>
        <button onClick={() => setShowAdmin(false)} className="bg-zinc-900 p-2 rounded-full">
          <X className="text-white w-6 h-6" />
        </button>
      </div>

      <div className="flex space-x-2 mb-6 border-b border-zinc-800 pb-4">
        {["posts", "products"].map((tab) => (
          <button key={tab} onClick={() => setAdminTab(tab)} className={`px-4 py-2 rounded-xl text-sm font-bold ${adminTab === tab ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400"}`}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <form onSubmit={handleAdminSubmit} className="space-y-4">
        {adminTab === "posts" && (
          <>
            <select required onChange={(e) => setFormData({ ...formData, postCategory: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500">
              <option value="">Select Category (ምድብ)</option>
              <option value="ዋና">ዋና (Main)</option>
              <option value="ስፖርት">ስፖርት (Sport)</option>
              <option value="ሹክሹክታ">ሹክሹክታ (Gossip)</option>
              <option value="ማህበራዊ">ማህበራዊ (Social)</option>
            </select>
            <input required placeholder="Title (ርዕስ)" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500" />
            <input placeholder="Subtitle (ንዑስ ርዕስ)" onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500" />
            <textarea rows="2" placeholder="Excerpt (አጭር ማብራሪያ)" onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500"></textarea>
            <textarea required rows="6" placeholder="Full Body (ሙሉ ጽሑፍ)" onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500"></textarea>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:bg-zinc-800 file:text-white" />
          </>
        )}

        {adminTab === "products" && (
          <>
            <input required placeholder="Product Name (የእቃው ስም)" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500" />
            <input placeholder="Brand Name (ምልክት - e.g. COLE HAAN)" onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500" />
            
            <div className="grid grid-cols-2 gap-4">
              <input required type="number" placeholder="Regular Price" onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl" />
              <input type="number" placeholder="VIP Price (Optional)" onChange={(e) => setFormData({ ...formData, vipPrice: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl" />
            </div>

            <select required onChange={(e) => setFormData({ ...formData, shopCat: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500">
              <option value="">Primary Category (ዋና ምድብ)</option>
              <option value="ወንድ">ወንድ</option>
              <option value="ሴት">ሴት</option>
              <option value="ልጅ">ልጅ</option>
              <option value="መድሀኒት">መድሀኒት</option>
            </select>
            
            <input placeholder="Sizes/Options (Comma separated: 42, 43, 44 OR ልብስ, ጫማ)" onChange={(e) => setFormData({ ...formData, options: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500" />
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:bg-zinc-800 file:text-white" />
          </>
        )}
        
        <button disabled={uploading} type="submit" className="w-full bg-amber-500 text-black font-black py-4 rounded-xl mt-4">
          {uploading ? "Uploading..." : "Publish (አትም)"}
        </button>
      </form>
    </div>
  );

  const tabs = [
    { id: "ዋና", icon: Home },
    { id: "ስፖርት", icon: Trophy },
    { id: "ሹክሹክታ", icon: Flame },
    { id: "ማህበራዊ", icon: Users },
    { id: "ቪአይፒ", icon: Target },
    { id: "ሱቅ", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-zinc-900 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer select-none" onClick={handleLogoTap}>
          <h1 className="text-white font-black text-2xl tracking-widest">
            GOL<span className="text-amber-500">ETH</span>
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {isCEO && (
            <button onClick={() => setShowAdmin(true)} className="bg-amber-500/20 text-amber-500 px-3 py-1.5 rounded-full font-bold text-xs">
              CEO
            </button>
          )}
          <a href="https://t.me/goleth_app_bot" target="_blank" rel="noreferrer" className="bg-[#2AABEE] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-blue-500">
            ይግቡ / ይመዝገቡ
          </a>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {activePost ? (
          renderSinglePost()
        ) : (
          <>
            {["ዋና", "ስፖርት", "ሹክሹክታ", "ማህበራዊ"].includes(activeTab) && renderPostFeed()}
            {activeTab === "ቪአይፒ" && renderVIP()}
            {activeTab === "ሱቅ" && renderShop()}
          </>
        )}
      </main>

      {showAdmin && renderAdmin()}

      <nav className="fixed bottom-0 w-full bg-black/95 backdrop-blur-md border-t border-zinc-900 flex justify-around pb-6 pt-3 px-1 z-40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActivePost(null); }}
              className={`flex flex-col items-center p-2 ${isActive ? "text-amber-500" : "text-zinc-500"}`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
              <span className="text-[10px] font-bold tracking-wide">{tab.id}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
