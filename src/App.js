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
  Edit2,
  ChevronLeft,
  PlusCircle,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Secure Supabase Connection
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [activeTab, setActiveTab] = useState("ዋና");
  const [activePost, setActivePost] = useState(null);
  
  const [shopCategory, setShopCategory] = useState("ሁሉም");
  const [shopSubCategory, setShopSubCategory] = useState("ሁሉም");

  const [isCEO, setIsCEO] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState("posts");
  const [uploading, setUploading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ options: [] });
  
  const [mainImageFile, setMainImageFile] = useState(null);
  const [inlineImageFiles, setInlineImageFiles] = useState([]);
  const [productImageFiles, setProductImageFiles] = useState([]);
  
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);

  const availableSizes = [
    "XS", "S", "M", "L", "XL", "XXL", 
    "38", "39", "40", "41", "42", "43", "44", "45",
    "Kids 0-3m", "Kids 3-6m", "Kids 6-12m", "Kids 1-2Y", "Kids 2-4Y", "Kids 4-6Y", "Kids 6-8Y", "Kids 8-10Y", "Kids 10-12Y",
    "Kids Shoe 20-25", "Kids Shoe 26-30", "Kids Shoe 31-35",
    "50g", "100g", "250g", "500g", "1kg"
  ];

  useEffect(() => {
    fetchData();
    
    // Hardware Back Button Support
    const handlePopState = () => {
      setActivePost(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const fetchData = async () => {
    try {
      const { data: postsData } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      const { data: productsData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setPosts(postsData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleLogoTap = () => {
    setActiveTab("ዋና");
    if (activePost) window.history.back(); // safely exit post
    
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

  // Safely open an article and update browser history
  const openPost = (post) => {
    window.history.pushState({ postId: post.id }, "", `#article-${post.id}`);
    setActivePost(post);
  };

  const handleDelete = async (table, id) => {
    if (window.confirm("እርግጠኛ ነዎት? (Are you sure you want to delete this?)")) {
      await supabase.from(table).delete().eq("id", id);
      fetchData();
      if (activePost) window.history.back();
    }
  };

  const handleEdit = (type, item) => {
    setAdminTab(type);
    setEditId(item.id);
    
    if (type === "posts") {
      setFormData({
        postCategory: item.category,
        title: item.title,
        subtitle: item.subtitle || "",
        excerpt: item.excerpt || "",
        body: item.body || "",
      });
    } else {
      setFormData({
        title: item.name,
        brand: item.brand || "",
        price: item.price,
        vipPrice: item.vip_price || "",
        shopCat: item.category,
        shopSubCat: item.subcategory || "",
        options: item.options || [],
      });
    }
    
    setMainImageFile(null);
    setInlineImageFiles([]);
    setProductImageFiles([]);
    setShowAdmin(true);
  };

  const openNewPost = (type) => {
    setAdminTab(type);
    setEditId(null);
    setFormData({ options: [] });
    setMainImageFile(null);
    setInlineImageFiles([]);
    setProductImageFiles([]);
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const options = prev.options || [];
      if (options.includes(value)) return { ...prev, options: options.filter((s) => s !== value) };
      return { ...prev, options: [...options, value] };
    });
  };

  const uploadFileToSupabase = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file);
    if (!uploadError) {
      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      return data.publicUrl;
    }
    return null;
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let uploadedUrls = [];

    if (adminTab === "posts") {
      if (mainImageFile) {
        const mainUrl = await uploadFileToSupabase(mainImageFile);
        if (mainUrl) uploadedUrls.push(mainUrl);
      }
      
      if (inlineImageFiles.length > 0) {
        for (const file of inlineImageFiles) {
          const inlineUrl = await uploadFileToSupabase(file);
          if (inlineUrl) uploadedUrls.push(inlineUrl);
        }
      }

      const payload = {
        category: formData.postCategory || "ዋና",
        title: formData.title,
        subtitle: formData.subtitle,
        excerpt: formData.excerpt,
        body: formData.body,
        author: "GOLETH",
      };
      
      if (uploadedUrls.length > 0) payload.image_urls = uploadedUrls;

      if (editId) {
        await supabase.from("posts").update(payload).eq("id", editId);
      } else {
        await supabase.from("posts").insert([payload]);
      }
    } else if (adminTab === "products") {
      if (productImageFiles.length > 0) {
        for (const file of productImageFiles) {
          const prodUrl = await uploadFileToSupabase(file);
          if (prodUrl) uploadedUrls.push(prodUrl);
        }
      }

      const payload = {
        name: formData.title,
        brand: formData.brand,
        price: Number(formData.price),
        vip_price: formData.vipPrice ? Number(formData.vipPrice) : null,
        category: formData.shopCat,
        subcategory: formData.shopSubCat,
        options: formData.options,
      };
      if (uploadedUrls.length > 0) payload.image_urls = uploadedUrls;

      if (editId) {
        await supabase.from("products").update(payload).eq("id", editId);
      } else {
        await supabase.from("products").insert([payload]);
      }
    }

    setFormData({ options: [] });
    setMainImageFile(null);
    setInlineImageFiles([]);
    setProductImageFiles([]);
    setEditId(null);
    setUploading(false);
    setShowAdmin(false);
    setShowSizeDropdown(false);
    fetchData();
    alert("በተሳካ ሁኔታ ተጠናቋል! (Success!)");
  };

  const renderOrderBanner = () => (
    <a href="https://t.me/goleth_orders_bot" target="_blank" rel="noreferrer" 
       className="col-span-2 block bg-gradient-to-b from-blue-600 to-blue-800 rounded-xl p-3 flex justify-between items-center shadow-[0_6px_0_#1e3a8a,0_10px_20px_rgba(0,0,0,0.4)] border border-blue-400/20 mb-6 mt-2 active:shadow-[0_2px_0_#1e3a8a] active:translate-y-1 transition-all">
      <div className="relative z-10">
        <h3 className="text-white font-black text-sm tracking-wide mb-0.5 drop-shadow-md">ልዩ ዕቃ ማዘዝ ይፈልጋሉ?</h3>
        <p className="text-blue-100 text-[10px] font-bold drop-shadow-md">ከአማዞን (AMAZON) ወይም ከየትኛውም ቦታ፡ እኛ እናመጣሎታለን!</p>
      </div>
      <div className="bg-blue-500/30 p-1.5 rounded-full shadow-inner border border-blue-400/30">
         <PlusCircle className="text-white drop-shadow-lg" size={20} />
      </div>
    </a>
  );

  // Smart Regex Renderer for [image1], [image2], etc.
  const renderBodyWithImages = (text, urls) => {
    if (!text) return null;
    
    // Regex finds [image1], [IMAGE 1], [image2], etc.
    const regex = /\[image\s*(\d+)\]/gi;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const imgNumber = parseInt(match[1], 10);
      // Because urls[0] is the main feed cover, urls[1] is inline image 1.
      if (urls && urls[imgNumber]) {
         parts.push(<img key={match.index} src={urls[imgNumber]} alt="Article Content" className="w-full h-auto rounded-xl my-5 shadow-lg object-cover" />);
      }
      
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return (
      <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
        {parts.length > 0 ? parts : text}
      </div>
    );
  };

  const renderSinglePost = () => (
    <div className="pb-24 animate-in fade-in zoom-in-95 duration-200">
      <button onClick={() => window.history.back()} className="flex items-center text-zinc-400 mb-4 hover:text-white">
        <ChevronLeft size={20} className="mr-1" /> ወደ ኋላ ተመለስ
      </button>
      
      {isCEO && (
        <div className="flex space-x-2 mb-4 w-full">
          <button onClick={() => handleEdit("posts", activePost)} className="bg-blue-600 text-white p-2 rounded-lg text-xs font-bold flex-1 flex items-center justify-center">
            <Edit2 size={14} className="mr-1" /> አስተካክል (Edit)
          </button>
          <button onClick={() => handleDelete("posts", activePost.id)} className="bg-red-600 text-white p-2 rounded-lg text-xs font-bold flex-1 flex items-center justify-center">
            <Trash2 size={14} className="mr-1" /> ሰርዝ (Delete)
          </button>
        </div>
      )}

      {/* Main Image for Reading View */}
      {(!activePost.body || !/\[image\s*\d+\]/i.test(activePost.body)) && activePost.image_urls && activePost.image_urls[0] && (
        <img src={activePost.image_urls[0]} alt={activePost.title} className="w-full aspect-[1.91/1] object-cover rounded-xl mb-6 shadow-lg" />
      )}
      
      <h1 className="text-xl font-black text-amber-500 mb-2 leading-tight">{activePost.title}</h1>
      {activePost.subtitle && <h2 className="text-base text-zinc-300 font-bold mb-3">{activePost.subtitle}</h2>}
      
      <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6">
        {activePost.author}
      </div>

      {activePost.excerpt && <p className="text-sm text-white font-medium mb-6 italic border-l-2 border-amber-500 pl-3">{activePost.excerpt}</p>}
      
      {renderBodyWithImages(activePost.body, activePost.image_urls)}

      {/* Added Sourcing Banner to the bottom of the article */}
      <div className="mt-10 border-t border-zinc-800 pt-6">
        {renderOrderBanner()}
      </div>
    </div>
  );

  const renderPostFeed = () => {
    const filteredPosts = activeTab === "ዋና" ? posts : posts.filter(p => p.category === activeTab);

    if (filteredPosts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center mt-20 text-zinc-500">
          <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center mb-4">!</div>
          <p>ምንም አልተገኘም</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {["ዋና", "ስፖርት", "ሹክሹክታ", "ማህበራዊ"].includes(activeTab) && renderOrderBanner()}
          
          {filteredPosts.map((post, index) => {
            const firstImg = post.image_urls && post.image_urls.length > 0 ? post.image_urls[0] : null;

            // 1. Hero Layout
            if (index === 0) {
              return (
                <div key={post.id} onClick={() => openPost(post)} className="col-span-2 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 cursor-pointer shadow-lg mb-2">
                  {firstImg && <img src={firstImg} alt={post.title} className="w-full aspect-[1.91/1] object-cover" />}
                  <div className="p-4">
                    <h2 className="text-lg font-black text-amber-500 mb-2 leading-tight line-clamp-2">{post.title}</h2>
                    <div className="text-zinc-500 text-[10px] font-bold tracking-wider mb-2 uppercase">{post.author}</div>
                    <p className="text-zinc-400 text-sm line-clamp-2">{post.excerpt || post.body.replace(/\[image\s*\d+\]/gi, '')}</p>
                  </div>
                </div>
              );
            }
            
            // 2. Grid Layout
            if (index > 0 && index <= 4) {
              return (
                <div key={post.id} onClick={() => openPost(post)} className="col-span-1 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer flex flex-col">
                  {firstImg && <img src={firstImg} alt={post.title} className="w-full aspect-[1.91/1] object-cover" />}
                  <div className="p-3 flex flex-col flex-grow justify-between">
                    <h3 className="text-xs font-bold text-white mb-2 line-clamp-2 leading-snug">{post.title}</h3>
                    <div className="text-zinc-500 text-[9px] font-bold uppercase mt-auto">{post.author}</div>
                  </div>
                </div>
              );
            }
            
            // 3. List Layout
            return (
              <div key={post.id} onClick={() => openPost(post)} className="col-span-2 flex items-center bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer p-3 mb-1">
                {firstImg && <img src={firstImg} alt={post.title} className="w-36 shrink-0 aspect-[1.91/1] object-cover rounded-lg" />}
                <div className="pl-4 flex flex-col flex-grow">
                  <h3 className="text-xs font-bold text-white mb-2 line-clamp-2 leading-snug">{post.title}</h3>
                  <div className="text-zinc-500 text-[9px] font-bold uppercase">{post.author}</div>
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
    if (shopCategory !== "ሁሉም" && shopSubCategory !== "ሁሉም") {
       filtered = filtered.filter(p => p.subcategory === shopSubCategory);
    }

    return (
      <div className="pb-24">
        <div className="flex space-x-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
          {primaryCats.map(cat => (
            <button key={cat} onClick={() => { setShopCategory(cat); setShopSubCategory("ሁሉም"); }} 
              className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${shopCategory === cat ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 border border-zinc-800"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {renderOrderBanner()}
        </div>

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
                <div className="absolute top-2 right-2 flex space-x-1 z-10">
                  <button onClick={() => handleEdit("products", item)} className="bg-blue-600 p-1.5 rounded-full shadow">
                    <Edit2 size={14} className="text-white" />
                  </button>
                  <button onClick={() => handleDelete("products", item.id)} className="bg-red-600 p-1.5 rounded-full shadow">
                    <Trash2 size={14} className="text-white" />
                  </button>
                </div>
              )}
              {item.category && <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-br-lg z-10 tracking-widest">ነፃ ትራንስፖርት</div>}
              
              <div className="bg-white pt-8 pb-4 px-2 flex overflow-x-auto snap-x no-scrollbar">
                 {item.image_urls && item.image_urls.length > 0 ? (
                   item.image_urls.map((img, i) => <img key={i} src={img} alt={item.name} className="h-28 object-contain flex-shrink-0 snap-center mr-2" />)
                 ) : <div className="h-28" />}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <p className="text-white font-black text-lg">{item.price} ብር</p>
                {item.vip_price && <p className="text-amber-500 font-bold text-xs mt-1 mb-3">👑 VIP: {item.vip_price} ብር</p>}
                
                <h3 className="text-zinc-300 font-bold text-sm mb-1 leading-tight">{item.name}</h3>
                {item.brand && <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-4">{item.brand}</p>}
                
                {item.options && item.options.length > 0 && (
                  <div className="mb-4">
                     <p className="text-zinc-500 text-[10px] mb-2">አማራጭ ይምረጡ፡</p>
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
      <div className="grid grid-cols-2 gap-4">{renderOrderBanner()}</div>
      <div className="flex flex-col items-center justify-center pt-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl">
          <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700">
            <Users className="text-blue-400" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">እንኳን በደህና መጡ!</h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">አዲስ መለያ ለመፍጠር ወይም ለመግባት የቴሌግራም ቁልፉን ይጫኑ::</p>
          <a href="https://t.me/goleth_app_bot" target="_blank" rel="noreferrer" className="w-full bg-[#2AABEE] text-white font-bold py-3.5 rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors">
             በቴሌግራም ይግቡ
          </a>
        </div>
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto flex flex-col p-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-6 mt-4">
        <h2 className="text-amber-500 font-black text-2xl tracking-wide">{editId ? "Edit Listing" : "CEO Dashboard"}</h2>
        <button onClick={() => { setShowAdmin(false); setEditId(null); }} className="bg-zinc-900 p-2 rounded-full">
          <X className="text-white w-6 h-6" />
        </button>
      </div>

      {!editId && (
        <div className="flex space-x-2 mb-6 border-b border-zinc-800 pb-4">
          {["posts", "products"].map((tab) => (
            <button key={tab} onClick={() => openNewPost(tab)} className={`px-4 py-2 rounded-xl text-sm font-bold ${adminTab === tab ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400"}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleAdminSubmit} className="space-y-4">
        {adminTab === "posts" && (
          <>
            <select required value={formData.postCategory || ""} onChange={(e) => setFormData({ ...formData, postCategory: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500">
              <option value="">ምድብ ይምረጡ</option>
              <option value="ዋና">ዋና</option>
              <option value="ስፖርት">ስፖርት</option>
              <option value="ሹክሹክታ">ሹክሹክታ</option>
              <option value="ማህበራዊ">ማህበራዊ</option>
            </select>
            <input required value={formData.title || ""} placeholder="ርዕስ (Title)" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500" />
            <input value={formData.subtitle || ""} placeholder="ንዑስ ርዕስ (Subtitle)" onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500" />
            <textarea value={formData.excerpt || ""} rows="2" placeholder="አጭር ማብራሪያ (Excerpt)" onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500"></textarea>
            
            <div className="relative">
              <textarea required value={formData.body || ""} rows="6" placeholder="ሙሉ ጽሑፍ (Body). Type [image1] wherever you want an uploaded picture to appear!" onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500"></textarea>
              <p className="text-[10px] text-amber-500 mt-1 pl-2">Tip: Type <b>[image1]</b>, <b>[image2]</b> inside the text to insert numbered pictures.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-4">
               <div>
                 <label className="block text-white font-bold text-sm mb-2">1. ዋና ምስል (Main Feed Image)</label>
                 <input type="file" accept="image/*" onChange={(e) => setMainImageFile(e.target.files[0])} className="w-full text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:bg-amber-500 file:text-black file:font-bold file:border-0" />
               </div>
               <div className="border-t border-zinc-800 pt-4">
                 <label className="block text-white font-bold text-sm mb-2">2. የጽሑፍ ውስጥ ምስሎች (Inline Images)</label>
                 <p className="text-xs text-zinc-400 mb-2">ጽሑፉ ውስጥ <b>[image1]</b> እና <b>[image2]</b> ባሉበት ቦታ ይገባሉ።</p>
                 <input type="file" multiple accept="image/*" onChange={(e) => setInlineImageFiles(Array.from(e.target.files))} className="w-full text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:bg-zinc-700 file:text-white file:border-0" />
               </div>
               {editId && <p className="text-xs text-amber-500 mt-2">ማስታወሻ፡ አዲስ ምስል ከመረጡ የድሮው ምስል ይቀየራል።</p>}
            </div>
          </>
        )}

        {adminTab === "products" && (
          <>
            <input required value={formData.title || ""} placeholder="የእቃው ስም (Product Name)" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500" />
            <input value={formData.brand || ""} placeholder="ምልክት (Brand - e.g. NIKE)" onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500" />
            
            <div className="grid grid-cols-2 gap-4">
              <input required value={formData.price || ""} type="number" placeholder="ዋጋ (Price)" onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl" />
              <input value={formData.vipPrice || ""} type="number" placeholder="የ VIP ዋጋ (Optional)" onChange={(e) => setFormData({ ...formData, vipPrice: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select required value={formData.shopCat || ""} onChange={(e) => setFormData({ ...formData, shopCat: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500">
                <option value="">ዋና ምድብ</option>
                <option value="ወንድ">ወንድ</option>
                <option value="ሴት">ሴት</option>
                <option value="ልጅ">ልጅ</option>
                <option value="መድሀኒት">መድሀኒት</option>
              </select>
              <select value={formData.shopSubCat || ""} onChange={(e) => setFormData({ ...formData, shopSubCat: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500">
                <option value="">ንዑስ ምድብ</option>
                <option value="ልብስ">ልብስ</option>
                <option value="ጫማ">ጫማ</option>
                <option value="ሌሎች">ሌሎች</option>
              </select>
            </div>
            
            <div className="relative">
              <button type="button" onClick={() => setShowSizeDropdown(!showSizeDropdown)} className="w-full bg-zinc-900 border border-zinc-800 text-left p-4 rounded-xl focus:border-amber-500 text-zinc-400 flex justify-between items-center">
                <span>መጠኖች ይምረጡ (Sizes) {formData.options?.length > 0 && `(${formData.options.length} selected)`}</span>
                <span>{showSizeDropdown ? "▲" : "▼"}</span>
              </button>
              
              {showSizeDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl max-h-60 overflow-y-auto p-4 shadow-2xl">
                  <div className="grid grid-cols-2 gap-2">
                    {availableSizes.map(size => (
                      <label key={size} className="flex items-center space-x-2 text-white cursor-pointer bg-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-700">
                        <input type="checkbox" value={size} checked={formData.options?.includes(size)} onChange={handleSizeChange} className="accent-amber-500 w-4 h-4" />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                  <button type="button" onClick={() => setShowSizeDropdown(false)} className="w-full mt-4 bg-amber-500 text-black font-bold py-2 rounded-lg">Done (ጨርስ)</button>
                </div>
              )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
               <label className="block text-zinc-400 text-sm mb-2">የእቃው ምስሎች (Product Images - ብዙ መምረጥ ይቻላል):</label>
               <input type="file" multiple accept="image/*" onChange={(e) => setProductImageFiles(Array.from(e.target.files))} className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:bg-zinc-800 file:text-white file:border-0" />
            </div>
          </>
        )}
        
        <button disabled={uploading} type="submit" className="w-full bg-amber-500 text-black font-black py-4 rounded-xl mt-4">
          {uploading ? "በመጫን ላይ..." : (editId ? "አስተካክል (Update)" : "አትም (Publish)")}
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
          <a href="https://t.me/goleth_app_bot" target="_blank" rel="noreferrer" className="text-emerald-500 font-bold text-sm hover:text-emerald-400 px-2 border-r border-zinc-800">
            ያግኙን
          </a>
          {isCEO && (
            <button onClick={() => { openNewPost("posts"); setShowAdmin(true); }} className="bg-amber-500/20 text-amber-500 px-3 py-1.5 rounded-full font-bold text-xs">
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
              onClick={() => { setActiveTab(tab.id); if(activePost) window.history.back(); }}
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
