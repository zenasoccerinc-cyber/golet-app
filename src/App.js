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
  const [imageFiles, setImageFiles] = useState([]);
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
    setActivePost(null);
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

  const handleDelete = async (table, id) => {
    if (window.confirm("እርግጠኛ ነዎት? (Are you sure you want to delete this?)")) {
      await supabase.from(table).delete().eq("id", id);
      fetchData();
      setActivePost(null);
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
    
    setImageFiles([]);
    setShowAdmin(true);
  };

  const openNewPost = (type) => {
    setAdminTab(type);
    setEditId(null);
    setFormData({ options: [] });
    setImageFiles([]);
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const options = prev.options || [];
      if (options.includes(value)) return { ...prev, options: options.filter((s) => s !== value) };
      return { ...prev, options: [...options, value] };
    });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let uploadedUrls = [];

    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file);
        if (!uploadError) {
          const { data } = supabase.storage.from("images").getPublicUrl(fileName);
          uploadedUrls.push(data.publicUrl);
        }
      }
    }

    if (adminTab === "posts") {
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
    setImageFiles([]);
    setEditId(null);
    setUploading(false);
    setShowAdmin(false);
    setShowSizeDropdown(false);
    fetchData();
    alert("በተሳካ ሁኔታ ተጠናቋል! (Success!)");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("am-ET", { year: "numeric", month: "long", day: "numeric" }).toUpperCase();
  };

  const renderContactBanner = () => (
    <a href="https://t.me/goleth_app_bot" target="_blank" rel="noreferrer" className="block bg-emerald-600 hover:bg-emerald-500 rounded-xl p-3 flex justify-center items-center text-white font-bold text-sm shadow-lg border border-emerald-500">
      <MessageCircle size={18} className="mr-2" /> ያግኙን (Contact Us)
    </a>
  );

  const renderOrderBanner = () => (
    <a href="https://t.me/goleth_orders_bot" target="_blank" rel="noreferrer" className="block bg-blue-700 rounded-xl p-4 flex justify-between items-center shadow-lg border border-blue-600">
      <div>
        <h3 className="text-white font-bold text-sm">ልዩ ዕቃ ማዘዝ ይፈልጋሉ?</h3>
        <p className="text-blue-200 text-xs mt-1">ከአማዞን ወይም ከየትኛውም ቦታ፡ እኛ እናመጣሎታለን!</p>
      </div>
      <PlusCircle className="text-blue-300" size={24} />
    </a>
  );

  const renderBanners = (isShop = false) => (
    <div className="mb-6 space-y-3">
      {isShop && renderContactBanner()}
      {renderOrderBanner()}
      {!isShop && renderContactBanner()}
    </div>
  );

  const renderImageGallery = (urls) => {
    if (!urls || urls.length === 0) return null;
    return (
      <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar snap-x">
        {urls.map((url, i) => (
          <img key={i} src={url} alt="Gallery" className="w-full h-64 object-cover rounded-xl shadow-lg flex-shrink-0 snap-center" />
        ))}
      </div>
    );
  };

  // Smart Body Renderer for Inline Images
  const renderBodyWithImages = (text, urls) => {
    if (!urls || urls.length === 0 || !text.includes('[IMAGE]')) {
       return <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{text}</div>;
    }
    
    const parts = text.split('[IMAGE]');
    return (
      <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && urls[i] && (
              <img src={urls[i]} alt="Inline content" className="w-full h-auto rounded-xl my-4 shadow-lg object-cover" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderSinglePost = () => (
    <div className="pb-24 animate-in fade-in zoom-in-95 duration-200">
      <button onClick={() => setActivePost(null)} className="flex items-center text-zinc-400 mb-4 hover:text-white">
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

      {/* Only show top gallery if [IMAGE] tags aren't used in the text */}
      {(!activePost.body || !activePost.body.includes('[IMAGE]')) && (
        <div className="mb-6">{renderImageGallery(activePost.image_urls)}</div>
      )}
      
      <h1 className="text-3xl font-black text-amber-500 mb-2 leading-tight">{activePost.title}</h1>
      {activePost.subtitle && <h2 className="text-xl text-zinc-300 font-bold mb-4">{activePost.subtitle}</h2>}
      
      <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">
        {activePost.author} • {formatDate(activePost.created_at)}
      </div>

      {activePost.excerpt && <p className="text-lg text-white font-medium mb-6 italic border-l-2 border-amber-500 pl-4">{activePost.excerpt}</p>}
      
      {/* Smart body render handles [IMAGE] tags */}
      {renderBodyWithImages(activePost.body, activePost.image_urls)}
    </div>
  );

  const renderPostFeed = () => {
    const filteredPosts = activeTab === "ዋና" ? posts : posts.filter(p => p.category === activeTab);

    if (filteredPosts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center mt-20 text-zinc-500">
          <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center mb-4">!</div>
          <p>ምንም አልተገኘም</p>
          <p className="text-xs mt-1">እባክዎትን ትንሽ ቆይተው እንደገና ይሞክሩ።</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 pb-24">
        {["ዋና", "ስፖርት", "ሹክሹክታ", "ማህበራዊ"].includes(activeTab) && renderBanners(false)}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post, index) => {
            const firstImg = post.image_urls && post.image_urls.length > 0 ? post.image_urls[0] : null;

            if (index === 0) {
              return (
                <div key={post.id} onClick={() => setActivePost(post)} className="col-span-1 md:col-span-2 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer shadow-lg mb-2">
                  {firstImg && <img src={firstImg} alt={post.title} className="w-full h-60 object-cover" />}
                  <div className="p-5">
                    <h2 className="text-2xl font-black text-amber-500 mb-2 leading-tight">{post.title}</h2>
                    <div className="text-zinc-500 text-[10px] font-bold tracking-wider mb-3">{post.author} • {formatDate(post.created_at)}</div>
                    <p className="text-zinc-400 text-sm line-clamp-2">{post.excerpt || post.body.replace(/\[IMAGE\]/g, '')}</p>
                  </div>
                </div>
              );
            }
            if (index > 0 && index <= 4) {
              return (
                <div key={post.id} onClick={() => setActivePost(post)} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer flex flex-col">
                  {firstImg && <img src={firstImg} alt={post.title} className="w-full h-36 object-cover" />}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-md font-bold text-white mb-2 line-clamp-2 leading-snug">{post.title}</h3>
                    <div className="mt-auto text-zinc-500 text-[10px] font-bold">{formatDate(post.created_at)}</div>
                  </div>
                </div>
              );
            }
            return (
              <div key={post.id} onClick={() => setActivePost(post)} className="col-span-1 md:col-span-2 flex items-center bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer p-2">
                {firstImg && <img src={firstImg} alt={post.title} className="w-24 h-24 object-cover rounded-lg" />}
                <div className="pl-4 pr-2 flex flex-col justify-center py-1">
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{post.title}</h3>
                  <div className="text-zinc-500 text-[10px] font-bold">{formatDate(post.created_at)}</div>
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

        {renderBanners(true)}

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
      {renderBanners(false)}
      <div className="flex flex-col items-center justify-center pt-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl">
          <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700">
            <Users className="text-blue-400" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">እንኳን በደህና መጡ!</h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">አዲስ መለያ ለመፍጠር ወይም ለመግባት የቴሌግራም ቁልፉን ይጫኑ::</p>
          <a href="https://t.me/goleth_app_bot" target="_blank" rel="noreferrer" className="w-full bg-[#2AABEE] text-white font-bold py-3.5 rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors">
             <MessageCircle size={20} className="mr-2 fill-current" /> በቴሌግራም ይግቡ
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
              <textarea required value={formData.body || ""} rows="6" placeholder="ሙሉ ጽሑፍ (Body). Type [IMAGE] wherever you want an uploaded picture to appear!" onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500"></textarea>
              <p className="text-[10px] text-amber-500 mt-1 pl-2">Tip: Type <b>[IMAGE]</b> inside the text to insert a picture there.</p>
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
          </>
        )}
        
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
           <label className="block text-zinc-400 text-sm mb-2">ምስሎች (ብዙ መምረጥ ይቻላል / Select Multiple Images):</label>
           <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files))} className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:bg-zinc-800 file:text-white file:border-0" />
           {editId && <p className="text-xs text-amber-500 mt-2">ማስታወሻ፡ አዲስ ምስል ከመረጡ የድሮው ምስል ይቀየራል። (Note: Selecting new files will replace the old images).</p>}
        </div>
        
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
