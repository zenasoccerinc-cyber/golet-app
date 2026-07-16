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
  Send
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Secure Supabase Connection
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Your Telegram Configuration
const TELEGRAM_BOT_TOKEN = "8726960567:AAGx_RJag33dBAjlQdGkJhgYEbzdVrBAlHU"; 
const TELEGRAM_CHAT_ID = "813725953"; 

export default function App() {
  const [activeTab, setActiveTab] = useState("ዋና");
  const [activePost, setActivePost] = useState(null);
  
  const [shopCategory, setShopCategory] = useState("ሁሉም");
  const [shopSubCategory, setShopSubCategory] = useState("ሁሉም");

  const [isCEO, setIsCEO] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  const [adminTab, setAdminTab] = useState("posts");
  const [uploading, setUploading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ options: [], relatedLinks: [] });
  
  // Existing Image Previews for Edit Mode
  const [existingMainImage, setExistingMainImage] = useState(null);
  const [existingInlineImages, setExistingInlineImages] = useState([]);

  const [mainImageFile, setMainImageFile] = useState(null);
  const [inlineImageFiles, setInlineImageFiles] = useState([]);
  const [productImageFiles, setProductImageFiles] = useState([]);
  
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);

  const authorList = ["GOLETH", "አማኑኤል", "Writer Name"];
  
  const availableSizes = [
    "XS", "S", "M", "L", "XL", "XXL", 
    "38", "39", "40", "41", "42", "43", "44", "45",
    "Kids 0-3m", "Kids 3-6m", "Kids 6-12m", "Kids 1-2Y", "Kids 2-4Y", "Kids 4-6Y", "Kids 6-8Y", "Kids 8-10Y", "Kids 10-12Y",
    "Kids Shoe 20-25", "Kids Shoe 26-30", "Kids Shoe 31-35",
    "50g", "100g", "250g", "500g", "1kg"
  ];

  useEffect(() => {
    fetchData();
    const handlePopState = () => setActivePost(null);
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
    if (activePost) window.history.back(); 
    
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
        author: item.author || "GOLETH",
        relatedLinks: item.related_links || []
      });
      
      if (item.image_urls && item.image_urls.length > 0) {
        setExistingMainImage(item.image_urls[0]);
        setExistingInlineImages(item.image_urls.slice(1));
      } else {
        setExistingMainImage(null);
        setExistingInlineImages([]);
      }
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
    setFormData({ options: [], relatedLinks: [], author: "GOLETH" });
    setExistingMainImage(null);
    setExistingInlineImages([]);
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

  const handleAddRelated = (e) => {
    const value = e.target.value;
    if (!value) return;
    
    if (!formData.relatedLinks?.includes(value)) {
      setFormData(prev => ({
        ...prev,
        relatedLinks: [...(prev.relatedLinks || []), value]
      }));
    }
  };

  const removeRelated = (linkToRemove) => {
    setFormData(prev => ({
      ...prev,
      relatedLinks: prev.relatedLinks.filter(l => l !== linkToRemove)
    }));
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
    let finalUrls = [];

    if (adminTab === "posts") {
      if (mainImageFile) {
        const newMainUrl = await uploadFileToSupabase(mainImageFile);
        if (newMainUrl) finalUrls.push(newMainUrl);
      } else if (existingMainImage) {
        finalUrls.push(existingMainImage);
      }
      
      const uploadedInlineUrls = [];
      if (inlineImageFiles.length > 0) {
        for (const file of inlineImageFiles) {
          const inlineUrl = await uploadFileToSupabase(file);
          if (inlineUrl) uploadedInlineUrls.push(inlineUrl);
        }
      }

      if (uploadedInlineUrls.length > 0) {
        finalUrls = [...finalUrls, ...uploadedInlineUrls];
      } else {
        finalUrls = [...finalUrls, ...existingInlineImages];
      }

      const payload = {
        category: formData.postCategory || "ዋና",
        title: formData.title,
        subtitle: formData.subtitle,
        excerpt: formData.excerpt,
        body: formData.body,
        author: formData.author || "GOLETH",
        related_links: formData.relatedLinks || [],
        image_urls: finalUrls
      };

      if (editId) {
        await supabase.from("posts").update(payload).eq("id", editId);
      } else {
        await supabase.from("posts").insert([payload]);
      }
    } else if (adminTab === "products") {
      if (productImageFiles.length > 0) {
        for (const file of productImageFiles) {
          const prodUrl = await uploadFileToSupabase(file);
          if (prodUrl) finalUrls.push(prodUrl);
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
      if (finalUrls.length > 0) payload.image_urls = finalUrls;

      if (editId) {
        await supabase.from("products").update(payload).eq("id", editId);
      } else {
        await supabase.from("products").insert([payload]);
      }
    }

    setFormData({ options: [], relatedLinks: [] });
    setMainImageFile(null);
    setInlineImageFiles([]);
    setProductImageFiles([]);
    setExistingMainImage(null);
    setExistingInlineImages([]);
    setEditId(null);
    setUploading(false);
    setShowAdmin(false);
    setShowSizeDropdown(false);
    fetchData();
    alert("በተሳካ ሁኔታ ተጠናቋል! (Success!)");
  };

  const submitOrderForm = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const phone = e.target.phone.value;
    const item = e.target.item.value;
    
    const message = `🛍️ *New Sourcing Order!*\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n📦 *Item:* ${item}`;
    
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "Markdown" })
      });
    } catch (err) {
      console.log("Telegram Error", err);
    }

    alert("ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል! (Order Sent Successfully!)");
    setShowOrderForm(false);
    
    if(activePost) window.history.back(); 
    setActiveTab("ሱቅ");
    window.scrollTo(0,0);
  };

  const renderOrderForm = () => (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto flex flex-col p-6 animate-in fade-in zoom-in duration-200 justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative shadow-2xl">
        <button onClick={() => setShowOrderForm(false)} className="absolute top-4 right-4 bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors">
          <X className="text-white w-5 h-5" />
        </button>
        <h2 className="text-xl font-black text-amber-500 mb-2">ልዩ ዕቃ ማዘዣ (Order Form)</h2>
        <p className="text-zinc-400 text-xs mb-6">ምን ማምጣት እንድንልዎት ይፈልጋሉ? መረጃዎን ይሙሉና አሁኑኑ እናረጋግጥልዎታለን።</p>
        
        <form onSubmit={submitOrderForm} className="space-y-4">
          <input required name="name" placeholder="ሙሉ ስም (Full Name)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors" />
          <input required name="phone" type="tel" placeholder="ስልክ ቁጥር (Phone Number)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors" />
          <textarea required name="item" rows="4" placeholder="የእቃው ስም ወይም የአማዞን ሊንክ (Item Name or Amazon Link)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors"></textarea>
          
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl mt-2 flex items-center justify-center transition-colors">
            <Send size={18} className="mr-2" /> ትዕዛዙን ላክ (Send Order)
          </button>
        </form>
      </div>
    </div>
  );

  const renderOrderBanner = () => (
    <button onClick={() => setShowOrderForm(true)} className="col-span-2 w-full text-left bg-gradient-to-br from-zinc-900 to-black rounded-xl p-4 flex justify-between items-center shadow-2xl border border-amber-500/20 mb-6 mt-2 hover:border-amber-500/50 transition-all group">
      <div className="relative z-10">
        <h3 className="text-amber-500 font-black text-sm tracking-wide mb-1 drop-shadow-md">ልዩ ዕቃ ማዘዝ ይፈልጋሉ?</h3>
        <p className="text-zinc-400 text-[10px] font-bold">ከአማዞን (AMAZON) ወይም ከየትኛውም ቦታ፡ እኛ እናመጣሎታለን!</p>
      </div>
      <div className="bg-amber-500/10 p-2 rounded-full shadow-inner border border-amber-500/30 group-hover:bg-amber-500/20 transition-colors">
         <PlusCircle className="text-amber-500 drop-shadow-lg" size={20} />
      </div>
    </button>
  );

  const renderBodyWithImages = (text, urls) => {
    if (!text) return null;
    
    const regex = /\[image\s*(\d+)\]/gi;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const imgNumber = parseInt(match[1], 10);
      if (urls && urls[imgNumber]) {
         parts.push(<img key={match.index} src={urls[imgNumber]} alt="Article Content" className="w-full h-auto rounded-xl my-6 shadow-lg object-cover border border-zinc-800" />);
      }
      
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return (
      <div className="text-zinc-300 text-sm leading-loose whitespace-pre-wrap">
        {parts.length > 0 ? parts : text}
      </div>
    );
  };

  const renderRelatedItems = () => {
    if (!activePost || !activePost.related_links || activePost.related_links.length === 0) return null;

    const relatedCards = activePost.related_links.map(link => {
      const [type, idStr] = link.split('_');
      const id = parseInt(idStr, 10);

      if (type === 'post') {
        const p = posts.find(post => post.id === id);
        if (!p) return null;
        const img = p.image_urls && p.image_urls.length > 0 ? p.image_urls[0] : null;
        return (
          <div key={`post_${p.id}`} onClick={() => { setActiveTab(p.category); openPost(p); window.scrollTo(0,0); }} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer flex flex-col hover:border-amber-500/30 transition-colors">
            {img && <img src={img} alt={p.title} className="w-full aspect-[1.91/1] object-cover" />}
            <div className="p-3">
              <h4 className="text-white text-xs font-bold line-clamp-2">{p.title}</h4>
            </div>
          </div>
        );
      } else if (type === 'product') {
        const p = products.find(prod => prod.id === id);
        if (!p) return null;
        const img = p.image_urls && p.image_urls.length > 0 ? p.image_urls[0] : null;
        return (
          <div key={`prod_${p.id}`} onClick={() => { setActivePost(null); setActiveTab('ሱቅ'); window.scrollTo(0,0); }} className="bg-zinc-900 rounded-xl overflow-hidden border border-amber-500/50 hover:border-amber-500 cursor-pointer flex flex-col items-center p-3 relative transition-colors">
             <span className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-bl-lg z-10">ወደ ሱቅ</span>
             {img && <img src={img} alt={p.name} className="h-20 object-contain mb-2 drop-shadow-md" />}
             <h4 className="text-white text-xs font-bold line-clamp-1 text-center w-full">{p.name}</h4>
             <p className="text-amber-500 text-xs font-black mt-1">{p.price} ብር</p>
          </div>
        );
      }
      return null;
    });

    return (
      <div className="mt-10 border-t border-zinc-800 pt-6">
        <h3 className="text-amber-500 font-black text-sm mb-4">ተያያዥ (Related)</h3>
        <div className="grid grid-cols-2 gap-3">
          {relatedCards}
        </div>
      </div>
    );
  };

  const renderSinglePost = () => (
    <div className="pb-24 animate-in fade-in zoom-in-95 duration-200">
      <button onClick={() => window.history.back()} className="flex items-center text-zinc-400 mb-6 hover:text-amber-500 transition-colors font-bold text-sm">
        <ChevronLeft size={20} className="mr-1" /> ወደ ኋላ ተመለስ
      </button>
      
      {isCEO && (
        <div className="flex space-x-2 mb-6 w-full">
          <button onClick={() => handleEdit("posts", activePost)} className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg text-xs font-bold flex-1 flex items-center justify-center transition-colors border border-zinc-700">
            <Edit2 size={14} className="mr-1" /> አስተካክል (Edit)
          </button>
          <button onClick={() => handleDelete("posts", activePost.id)} className="bg-red-900/30 text-red-500 hover:bg-red-900/50 hover:text-red-400 border border-red-900 p-2 rounded-lg text-xs font-bold flex-1 flex items-center justify-center transition-colors">
            <Trash2 size={14} className="mr-1" /> ሰርዝ (Delete)
          </button>
        </div>
      )}

      {(!activePost.body || !/\[image\s*\d+\]/i.test(activePost.body)) && activePost.image_urls && activePost.image_urls[0] && (
        <img src={activePost.image_urls[0]} alt={activePost.title} className="w-full aspect-[1.91/1] object-cover rounded-xl mb-6 shadow-2xl border border-zinc-800" />
      )}
      
      <h1 className="text-2xl font-black text-white mb-2 leading-tight">{activePost.title}</h1>
      {activePost.subtitle && <h2 className="text-base text-amber-500 font-bold mb-4">{activePost.subtitle}</h2>}
      
      <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8 border-b border-zinc-800 pb-4">
        {activePost.author}
      </div>

      {activePost.excerpt && <p className="text-sm text-white font-medium mb-8 italic border-l-2 border-amber-500 pl-4">{activePost.excerpt}</p>}
      
      {renderBodyWithImages(activePost.body, activePost.image_urls)}

      {renderRelatedItems()}

      <div className="mt-10">
        {renderOrderBanner()}
      </div>
    </div>
  );

  const renderPostFeed = () => {
    const filteredPosts = activeTab === "ዋና" ? posts : posts.filter(p => p.category === activeTab);

    if (filteredPosts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center mt-20 text-zinc-500">
          <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center mb-4 text-zinc-700 font-black">!</div>
          <p className="font-medium text-sm">ምንም አልተገኘም</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {["ዋና", "ስፖርት", "ሹክሹክታ", "ማህበራዊ"].includes(activeTab) && renderOrderBanner()}
          
          {filteredPosts.map((post, index) => {
            const firstImg = post.image_urls && post.image_urls.length > 0 ? post.image_urls[0] : null;

            if (index === 0) {
              return (
                <div key={post.id} onClick={() => openPost(post)} className="col-span-2 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 cursor-pointer shadow-lg mb-2 hover:border-zinc-700 transition-colors">
                  {firstImg && <img src={firstImg} alt={post.title} className="w-full aspect-[1.91/1] object-cover" />}
                  <div className="p-5">
                    <h2 className="text-lg font-black text-white mb-2 leading-tight line-clamp-2">{post.title}</h2>
                    <div className="text-amber-500 text-[10px] font-bold tracking-wider mb-3 uppercase">{post.author}</div>
                    <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">{post.excerpt || post.body.replace(/\[image\s*\d+\]/gi, '')}</p>
                  </div>
                </div>
              );
            }
            
            if (index > 0 && index <= 4) {
              return (
                <div key={post.id} onClick={() => openPost(post)} className="col-span-1 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer flex flex-col hover:border-zinc-700 transition-colors">
                  {firstImg && <img src={firstImg} alt={post.title} className="w-full aspect-[1.91/1] object-cover" />}
                  <div className="p-3 flex flex-col flex-grow justify-between">
                    <h3 className="text-xs font-bold text-white mb-2 line-clamp-2 leading-snug">{post.title}</h3>
                    <div className="text-amber-500 text-[9px] font-bold uppercase mt-auto">{post.author}</div>
                  </div>
                </div>
              );
            }
            
            return (
              <div key={post.id} onClick={() => openPost(post)} className="col-span-2 flex items-center bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer p-3 mb-1 hover:border-zinc-700 transition-colors">
                {firstImg && <img src={firstImg} alt={post.title} className="w-36 shrink-0 aspect-[1.91/1] object-cover rounded-lg border border-zinc-800" />}
                <div className="pl-4 flex flex-col flex-grow">
                  <h3 className="text-xs font-bold text-white mb-2 line-clamp-2 leading-snug">{post.title}</h3>
                  <div className="text-amber-500 text-[9px] font-bold uppercase">{post.author}</div>
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
              className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${shopCategory === cat ? "bg-amber-500 text-black shadow-lg" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"}`}>
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
               className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${shopSubCategory === cat ? "bg-zinc-300 text-black" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>
               {cat}
             </button>
           ))}
         </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col relative group">
              
              {isCEO && (
                <div className="absolute top-2 right-2 flex space-x-1 z-10">
                  <button onClick={() => handleEdit("products", item)} className="bg-zinc-800 border border-zinc-700 p-1.5 rounded-md shadow">
                    <Edit2 size={14} className="text-white" />
                  </button>
                  <button onClick={() => handleDelete("products", item.id)} className="bg-red-900/50 border border-red-900 p-1.5 rounded-md shadow">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              )}
              {item.category && <div className="absolute top-0 left-0 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-br-lg z-10 tracking-widest shadow-md">ነፃ ትራንስፖርት</div>}
              
              <div className="bg-white pt-8 pb-4 px-2 flex overflow-x-auto snap-x no-scrollbar">
                 {item.image_urls && item.image_urls.length > 0 ? (
                   item.image_urls.map((img, i) => <img key={i} src={img} alt={item.name} className="h-28 object-contain flex-shrink-0 snap-center mr-2 drop-shadow-sm" />)
                 ) : <div className="h-28" />}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <p className="text-white font-black text-lg">{item.price} ብር</p>
                {item.vip_price && <p className="text-amber-500 font-bold text-xs mt-1 mb-3 flex items-center">👑 VIP: {item.vip_price} ብር</p>}
                
                <h3 className="text-zinc-300 font-bold text-sm mb-1 leading-tight">{item.name}</h3>
                {item.brand && <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-4">{item.brand}</p>}
                
                {item.options && item.options.length > 0 && (
                  <div className="mb-4">
                     <p className="text-zinc-500 text-[10px] mb-2 font-medium">አማራጭ ይምረጡ፡</p>
                     <div className="flex flex-wrap gap-2">
                        {item.options.map(opt => (
                          <span key={opt} className="bg-black border border-zinc-800 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-md">{opt}</span>
                        ))}
                     </div>
                  </div>
                )}
                
                <a href="https://t.me/goleth_orders_bot" target="_blank" rel="noreferrer" className="mt-auto w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 rounded-xl text-sm flex justify-center items-center transition-colors shadow-lg shadow-amber-500/10">
                  <ShoppingBag size={16} className="mr-2" /> እዘዝ (Order)
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
          <div className="w-16 h-16 mx-auto bg-black rounded-full flex items-center justify-center mb-6 border border-zinc-800 shadow-inner">
            <Users className="text-amber-500" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">እንኳን በደህና መጡ!</h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">አዲስ መለያ ለመፍጠር ወይም ለመግባት የቴሌግራም ቁልፉን ይጫኑ::</p>
          <a href="https://t.me/goleth_app_bot" target="_blank" rel="noreferrer" className="w-full bg-[#2AABEE] text-white font-bold py-3.5 rounded-xl flex items-center justify-center shadow-lg hover:bg-[#229ED9] transition-colors">
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
        <button onClick={() => { setShowAdmin(false); setEditId(null); }} className="bg-zinc-900 hover:bg-zinc-800 p-2 rounded-full transition-colors">
          <X className="text-white w-6 h-6" />
        </button>
      </div>

      {!editId && (
        <div className="flex space-x-2 mb-6 border-b border-zinc-800 pb-4">
          {["posts", "products"].map((tab) => (
            <button key={tab} onClick={() => openNewPost(tab)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${adminTab === tab ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleAdminSubmit} className="space-y-4">
        {adminTab === "posts" && (
          <>
            <select required value={formData.postCategory || ""} onChange={(e) => setFormData({ ...formData, postCategory: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors">
              <option value="">ምድብ ይምረጡ</option>
              <option value="ዋና">ዋና</option>
              <option value="ስፖርት">ስፖርት</option>
              <option value="ሹክሹክታ">ሹክሹክታ</option>
              <option value="ማህበራዊ">ማህበራዊ</option>
            </select>

            <select required value={formData.author || ""} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-amber-500 font-bold p-4 rounded-xl focus:border-amber-500 outline-none transition-colors">
              <option value="">ጸሐፊ (Author) ይምረጡ</option>
              {authorList.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            <input required value={formData.title || ""} placeholder="ርዕስ (Title)" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors" />
            <input value={formData.subtitle || ""} placeholder="ንዑስ ርዕስ (Subtitle)" onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors" />
            <textarea value={formData.excerpt || ""} rows="2" placeholder="አጭር ማብራሪያ (Excerpt)" onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors"></textarea>
            
            <div className="relative">
              <textarea required value={formData.body || ""} rows="8" placeholder="ሙሉ ጽሑፍ (Body)." onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors"></textarea>
              <p className="text-[10px] text-amber-500 mt-1 pl-2">Tip: Type <b>[image1]</b> and <b>[image2]</b> inside the text to place your pictures.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-4">
               <div>
                 <label className="block text-white font-bold text-sm mb-2">1. ዋና ምስል (Main Feed Image)</label>
                 {existingMainImage && (
                    <div className="mb-3">
                       <p className="text-[10px] text-zinc-400 mb-1 uppercase font-bold tracking-widest">Current Image:</p>
                       <img src={existingMainImage} alt="Current Main" className="h-16 rounded-md object-cover border border-zinc-700" />
                    </div>
                 )}
                 <input type="file" accept="image/*" onChange={(e) => setMainImageFile(e.target.files[0])} className="w-full text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:bg-amber-500 file:text-black file:font-bold file:border-0 file:cursor-pointer" />
                 {existingMainImage && <p className="text-[10px] text-zinc-500 mt-2">Select a new file only if you want to replace the current one.</p>}
               </div>
               
               <div className="border-t border-zinc-800 pt-4">
                 <label className="block text-white font-bold text-sm mb-2">2. የጽሑፍ ውስጥ ምስሎች (Inline Images)</label>
                 
                 {existingInlineImages.length > 0 && (
                    <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
                       {existingInlineImages.map((img, idx) => (
                          <div key={idx} className="relative">
                             <span className="absolute top-0 left-0 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-br-lg z-10 shadow-sm">[image{idx + 1}]</span>
                             <img src={img} alt={`Inline ${idx + 1}`} className="h-20 w-20 rounded-md object-cover border border-zinc-700 shrink-0" />
                          </div>
                       ))}
                    </div>
                 )}

                 <p className="text-xs text-zinc-400 mb-3">Upload multiple files at once. They will become <b>[image1]</b>, <b>[image2]</b>, etc.</p>
                 <input type="file" multiple accept="image/*" onChange={(e) => setInlineImageFiles(Array.from(e.target.files))} className="w-full text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:bg-zinc-800 file:text-white file:border-0 file:cursor-pointer hover:file:bg-zinc-700" />
                 {existingInlineImages.length > 0 && <p className="text-[10px] text-amber-500 mt-2">Warning: Selecting new files will replace all existing inline images.</p>}
               </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
               <label className="block text-white font-bold text-sm mb-2">3. ተያያዥ ጽሑፎች/እቃዎች (Related Items)</label>
               <p className="text-xs text-zinc-400 mb-3">እነዚህ ጽሑፉ መጨረሻ ላይ ይታያሉ (እስከ 2 መምረጥ ይመከራል)።</p>
               
               <select onChange={handleAddRelated} className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg mb-3 outline-none focus:border-amber-500">
                  <option value="">+ ምረጥ (Select Related...)</option>
                  <optgroup label="Articles (ዜናዎች)">
                    {posts.filter(p => p.id !== editId).map(p => (
                      <option key={`post_${p.id}`} value={`post_${p.id}`}>{p.title}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Shop Items (ሱቅ)">
                    {products.map(p => (
                      <option key={`product_${p.id}`} value={`product_${p.id}`}>{p.name}</option>
                    ))}
                  </optgroup>
               </select>

               {formData.relatedLinks && formData.relatedLinks.length > 0 && (
                 <div className="space-y-2 mt-2">
                   {formData.relatedLinks.map(link => {
                     const [type, id] = link.split('_');
                     const item = type === 'post' ? posts.find(p => p.id === parseInt(id)) : products.find(p => p.id === parseInt(id));
                     return (
                       <div key={link} className="flex justify-between items-center bg-black p-2 rounded-lg text-xs border border-zinc-800">
                         <span className="text-zinc-300 truncate w-64">{item ? (item.title || item.name) : "Loading..."}</span>
                         <button type="button" onClick={() => removeRelated(link)} className="text-red-500 font-bold ml-2 hover:text-red-400">X</button>
                       </div>
                     );
                   })}
                 </div>
               )}
            </div>
          </>
        )}

        {adminTab === "products" && (
          <>
            <input required value={formData.title || ""} placeholder="የእቃው ስም (Product Name)" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors" />
            <input value={formData.brand || ""} placeholder="ምልክት (Brand - e.g. NIKE)" onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors" />
            
            <div className="grid grid-cols-2 gap-4">
              <input required value={formData.price || ""} type="number" placeholder="ዋጋ (Price)" onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl outline-none focus:border-amber-500" />
              <input value={formData.vipPrice || ""} type="number" placeholder="የ VIP ዋጋ (Optional)" onChange={(e) => setFormData({ ...formData, vipPrice: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl outline-none focus:border-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select required value={formData.shopCat || ""} onChange={(e) => setFormData({ ...formData, shopCat: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors">
                <option value="">ዋና ምድብ</option>
                <option value="ወንድ">ወንድ</option>
                <option value="ሴት">ሴት</option>
                <option value="ልጅ">ልጅ</option>
                <option value="መድሀኒት">መድሀኒት</option>
              </select>
              <select value={formData.shopSubCat || ""} onChange={(e) => setFormData({ ...formData, shopSubCat: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors">
                <option value="">ንዑስ ምድብ</option>
                <option value="ልብስ">ልብስ</option>
                <option value="ጫማ">ጫማ</option>
                <option value="ሌሎች">ሌሎች</option>
              </select>
            </div>
            
            <div className="relative">
              <button type="button" onClick={() => setShowSizeDropdown(!showSizeDropdown)} className="w-full bg-zinc-900 border border-zinc-800 text-left p-4 rounded-xl focus:border-amber-500 text-zinc-400 flex justify-between items-center transition-colors">
                <span>መጠኖች ይምረጡ (Sizes) {formData.options?.length > 0 && <span className="text-amber-500 font-bold ml-1">({formData.options.length})</span>}</span>
                <span>{showSizeDropdown ? "▲" : "▼"}</span>
              </button>
              
              {showSizeDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl max-h-60 overflow-y-auto p-4 shadow-2xl">
                  <div className="grid grid-cols-2 gap-2">
                    {availableSizes.map(size => (
                      <label key={size} className="flex items-center space-x-2 text-white cursor-pointer bg-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors">
                        <input type="checkbox" value={size} checked={formData.options?.includes(size)} onChange={handleSizeChange} className="accent-amber-500 w-4 h-4" />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                  <button type="button" onClick={() => setShowSizeDropdown(false)} className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded-lg transition-colors">Done (ጨርስ)</button>
                </div>
              )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
               <label className="block text-white font-bold text-sm mb-2">የእቃው ምስሎች (Product Images)</label>
               <input type="file" multiple accept="image/*" onChange={(e) => setProductImageFiles(Array.from(e.target.files))} className="w-full text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:bg-zinc-800 file:text-white file:border-0 file:cursor-pointer hover:file:bg-zinc-700" />
            </div>
          </>
        )}
        
        <button disabled={uploading} type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl mt-4 transition-colors">
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
          <a href="https://t.me/goleth_app_bot" target="_blank" rel="noreferrer" className="text-zinc-400 font-bold text-sm hover:text-amber-500 px-3 border-r border-zinc-800 transition-colors">
            ያግኙን
          </a>
          {isCEO && (
            <button onClick={() => { openNewPost("posts"); setShowAdmin(true); }} className="bg-amber-500 text-black px-3 py-1.5 rounded-full font-bold text-xs shadow-lg shadow-amber-500/20">
              CEO
            </button>
          )}
          <a href="https://t.me/goleth_app_bot" target="_blank" rel="noreferrer" className="bg-[#2AABEE] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-[#229ED9] transition-colors">
            ይግቡ
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

      {showOrderForm && renderOrderForm()}
      {showAdmin && renderAdmin()}

      <nav className="fixed bottom-0 w-full bg-black/95 backdrop-blur-md border-t border-zinc-900 flex justify-around pb-6 pt-3 px-1 z-40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if(activePost) window.history.back(); window.scrollTo(0,0); }}
              className={`flex flex-col items-center p-2 transition-colors ${isActive ? "text-amber-500" : "text-zinc-600 hover:text-zinc-400"}`}
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


