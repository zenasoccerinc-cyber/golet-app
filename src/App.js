import React, { useState, useEffect, useRef } from "react";
import {
  Home, Trophy, Flame, Users, Target, ShoppingBag, X, Trash2, Edit2, ChevronLeft, PlusCircle, Send, ChevronRight
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Secure Supabase Connection
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Telegram Configuration
const TELEGRAM_BOT_TOKEN = "8726960567:AAGx_RJag33dBAjlQdGkJhgYEbzdVrBAlHU"; 
const TELEGRAM_CHAT_ID = "813725953"; 
const BOT_USERNAME = "goleth_app_bot";

export default function App() {
  const [activeTab, setActiveTab] = useState("ዋና");
  const [activePost, setActivePost] = useState(null);
  
  const [shopCategory, setShopCategory] = useState("ሁሉም");
  const [shopSubCategory, setShopSubCategory] = useState("ሁሉም");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [showInlineCheckout, setShowInlineCheckout] = useState(false);
  
  const [orderName, setOrderName] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderFile, setOrderFile] = useState(null);
  const [includeVipSignup, setIncludeVipSignup] = useState(false);

  const [isCEO, setIsCEO] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  
  const [adminTab, setAdminTab] = useState("posts");
  const [uploading, setUploading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ options: [], relatedLinks: [] });
  const [existingMainImage, setExistingMainImage] = useState(null);
  const [existingInlineImages, setExistingInlineImages] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [inlineImageFiles, setInlineImageFiles] = useState([]);
  const [productImageFiles, setProductImageFiles] = useState([]);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [expandedOptionCategories, setExpandedOptionCategories] = useState({});

  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);

  // --- VIP & GAMES STATE ---
  const [currentUser, setCurrentUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [hasPendingVip, setHasPendingVip] = useState(false);
  const [games, setGames] = useState([]);
  const [userPredictions, setUserPredictions] = useState({});
  const [predictionInputs, setPredictionInputs] = useState({});
  const [newGame, setNewGame] = useState({ team_a: '', team_b: '', team_a_logo: '', team_b_logo: '' });
  const [scoresToUpdate, setScoresToUpdate] = useState({});
  
  const [checkoutStep, setCheckoutStep] = useState("ክፍያ"); 
  const [paymentType, setPaymentType] = useState("ሀገር ውስጥ"); 
  const [vipPhone, setVipPhone] = useState("");
  const [vipReceiptFile, setVipReceiptFile] = useState(null);
  
  const telegramWrapperRef = useRef(null); 
  const telegramCheckoutRef = useRef(null);

  const authorList = ["GOLETH", "አማኑኤል", "Writer Name"];
  const categorizedOptions = {
    "ጫማ (Shoes)": ["38", "39", "40", "41", "42", "43", "44", "45"],
    "የልጆች ልብስ (Kids Clothing)": ["Kids 0-3m", "Kids 3-6m", "Kids 6-12m", "Kids 1-2Y", "Kids 2-4Y"],
    "ልብስ (Clothing)": ["XS", "S", "M", "L", "XL", "XXL"],
    "ክብደት/መጠን (Weights/Liquids)": ["50g", "100g", "250g", "500g", "1kg"],
    "ስልክ/ኤሌክትሮኒክስ (Electronics)": ["64GB", "128GB", "256GB", "512GB", "1TB"]
  };

  useEffect(() => {
    fetchData();
    fetchGames(); 
    const handlePopState = () => {
       setActivePost(null);
       setSelectedProduct(null);
       setShowInlineCheckout(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (activeTab === "ቪአይፒ" && !currentUser && telegramWrapperRef.current && telegramWrapperRef.current.innerHTML === '') {
      window.onTelegramAuth = (user) => handleTelegramLogin(user);
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", BOT_USERNAME);
      script.setAttribute("data-size", "large");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.async = true;
      telegramWrapperRef.current.appendChild(script);
    }
  }, [activeTab, currentUser]);

  useEffect(() => {
    if (showInlineCheckout && !currentUser && telegramCheckoutRef.current && telegramCheckoutRef.current.innerHTML === '') {
      window.onTelegramAuth = (user) => handleTelegramLogin(user);
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", BOT_USERNAME);
      script.setAttribute("data-size", "large");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.async = true;
      telegramCheckoutRef.current.appendChild(script);
    }
  }, [showInlineCheckout, currentUser]);

  const fetchData = async () => {
    const { data: postsData } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    const { data: productsData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if(postsData) setPosts(postsData);
    if(productsData) setProducts(productsData);
  };

  const fetchGames = async () => {
    const { data } = await supabase.from('games').select('*').order('created_at', { ascending: false });
    if (data) setGames(data);
  };

  const fetchUserPredictions = async (telegramId) => {
    const { data } = await supabase.from('predictions').select('*').eq('telegram_id', telegramId);
    if (data) {
      const predictionsMap = {};
      data.forEach(p => { predictionsMap[p.game_id] = p; });
      setUserPredictions(predictionsMap);
    }
  };

  const checkPendingVip = async (telegramId) => {
    const { data } = await supabase.from('vip_payments').select('status').eq('telegram_id', telegramId).eq('status', 'pending');
    if (data && data.length > 0) setHasPendingVip(true);
  };

  const handleTelegramLogin = async (telegramUser) => {
    setCurrentUser(telegramUser);
    const { data } = await supabase
      .from('vip_users')
      .upsert([ { telegram_id: telegramUser.id, username: telegramUser.username || telegramUser.first_name } ], { onConflict: 'telegram_id' })
      .select();

    if (data && data[0]) {
      setIsVIP(data[0].is_vip);
      fetchUserPredictions(telegramUser.id);
      checkPendingVip(telegramUser.id);
      if (!data[0].is_vip) setCheckoutStep("ክፍያ");
    }
  };

  const uploadFileToSupabase = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file);
    if (!uploadError) {
      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      return data.publicUrl;
    }
    return null;
  };

  const handleVipPaymentSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const fullName = e.target.fullName.value;
    if (vipPhone.length !== 10 || !vipReceiptFile) {
      alert("እባክዎ መረጃዎችን በትክክል ያስገቡ።");
      setUploading(false);
      return;
    }

    const receiptUrl = await uploadFileToSupabase(vipReceiptFile);

    const { error } = await supabase.from("vip_payments").insert([
      { telegram_id: currentUser?.id, full_name: fullName, phone_number: vipPhone, payment_type: paymentType, receipt_url: receiptUrl, status: 'pending' }
    ]);

    if (error) {
      alert("የመረጃ ስህተት አጋጥሟል።");
      setUploading(false); return;
    }

    const adminMsg = `👑 <b>አዲስ የVIP ጥያቄ!</b>\n👤 ${fullName}\n📞 ${vipPhone}\n💳 ${paymentType}\n🖼️ ${receiptUrl}`;
    const userMsg = `🎉 <b>ክፍያዎ ደርሶናል!</b>\n\nውድ ${fullName}፣ የVIP ክፍያዎ በመጣራት ላይ ነው።\nማሳሰቢያ: መልዕክት እንዲደርስዎ @${BOT_USERNAME} ን START ማለቶን ያረጋግጡ።`;
    
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: adminMsg, parse_mode: "HTML" }) });
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: currentUser.id, text: userMsg, parse_mode: "HTML" }) });
    } catch (err) {}

    setUploading(false);
    setHasPendingVip(true);
    setShowSuccessModal(true);
  };

  const handleProductOrderSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const shippingSpeed = e.target.shippingSpeed.value;
    const isGettingVipPrice = isVIP || includeVipSignup;
    const basePrice = selectedProduct.vip_price && isGettingVipPrice ? selectedProduct.vip_price : selectedProduct.price;
    
    const roundedWeight = Math.ceil(selectedProduct.weight_kg || 1.0); 
    const shippingCostBirr = roundedWeight * 2000;
    
    let finalPrice = basePrice + shippingCostBirr; 
    if (includeVipSignup) finalPrice += (paymentType === "ሀገር ውስጥ" ? 100 : 10);
    
    let orderNotes = shippingSpeed === "next_day" ? "+ $10 CAD (Next Day)" : "Standard";
    if (includeVipSignup) orderNotes += " | +VIP Membership Signup";

    const receiptUrl = orderFile ? await uploadFileToSupabase(orderFile) : "";

    const { error: dbError } = await supabase.from("product_orders").insert([{ 
        telegram_id: currentUser.id.toString(), 
        full_name: orderName, 
        phone_number: vipPhone, 
        delivery_address: orderAddress,
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        selected_option: selectedOption || "N/A",
        price: finalPrice,
        payment_type: paymentType, 
        receipt_url: receiptUrl,
        shipping_speed: shippingSpeed,
        total_weight_kg: roundedWeight,
        is_new_vip_signup: includeVipSignup
      }]);

    if (dbError) { alert("ስህተት አጋጥሟል።"); setUploading(false); return; }

    const adminMsg = `🛍 <b>አዲስ የእቃ ትዕዛዝ!</b>\n👤 ${orderName}\n📞 ${vipPhone}\n📍 ${orderAddress}\n📦 ${selectedProduct.name}\n📏 ${selectedOption}\n🚚 ${shippingSpeed}\n💰 ${finalPrice} ብር\n📝 Notes: ${orderNotes}\n🖼️ ${receiptUrl}`;
    const userMsg = `🎉 <b>ትዕዛዝዎ ደርሶናል!</b>\n\nለ ${selectedProduct.name} ክፍያዎ ደርሷል።\nማሳሰቢያ: መልዕክት እንዲደርስዎ @${BOT_USERNAME} ን START ማለቶን ያረጋግጡ።`;
    
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: adminMsg, parse_mode: "HTML" }) });
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: currentUser.id, text: userMsg, parse_mode: "HTML" }) });
    } catch (err) {}

    setUploading(false);
    setShowInlineCheckout(false);
    setSelectedProduct(null);
    setIncludeVipSignup(false);
    setShowSuccessModal(true);
    window.scrollTo(0,0);
  };

  const submitOrderForm = async (e) => {
    e.preventDefault();
    if (!currentUser) { alert("እባክዎ በቴሌግራም ይግቡ።"); return; }
    setUploading(true);

    const name = e.target.name.value;
    const phone = e.target.phone.value;
    const productName = e.target.productName.value;
    const productLink = e.target.productLink.value;
    const imageFile = e.target.orderImage.files[0];

    if (!productName && !productLink && !imageFile) { alert("ቢያንስ አንዱን ያስገቡ።"); setUploading(false); return; }

    const imageUrl = imageFile ? await uploadFileToSupabase(imageFile) : "";

    await supabase.from("sourcing_requests").insert([{
      telegram_id: currentUser.id.toString(), full_name: name, phone_number: phone, product_name: productName, product_link: productLink, image_url: imageUrl, shipping_speed: e.target.shipping.value
    }]);

    const msg = `🛍 <b>ልዩ ዕቃ ማዘዣ!</b>\n👤 ${name}\n📞 ${phone}\n📦 ${productName}\n🔗 ${productLink}\n🖼️ ${imageUrl}`;
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "HTML" }) });

    setUploading(false); setShowOrderForm(false); alert("ተልኳል!");
  };

  const handleLogoTap = () => {
    setActiveTab("ዋና");
    const newCount = tapCount + 1;
    setTapCount(newCount);
    setTimeout(() => setTapCount(0), 3000);
    if (newCount >= 5) {
      if (window.prompt("የአስተዳዳሪ የይለፍ ቃል ያስገቡ:") === "admin123") { setIsCEO(true); setShowAdmin(true); }
      setTapCount(0);
    }
  };

  const openPost = (post) => { window.history.pushState({}, "", `#article-${post.id}`); setActivePost(post); };
  const openProduct = (prod) => { window.history.pushState({}, "", `#product-${prod.id}`); setSelectedProduct(prod); setCurrentImgIndex(0); setSelectedOption(null); setShowInlineCheckout(false); };

  const renderProductDetail = () => {
    if (!selectedProduct) return null;
    const hasImages = selectedProduct.image_urls && selectedProduct.image_urls.length > 0;
    
    // Inline Checkout Form UI
    const inlineCheckoutUI = showInlineCheckout ? (
      <div className="bg-zinc-900 border border-amber-500/50 rounded-2xl p-5 mt-8 animate-in slide-in-from-top-4 duration-300 shadow-2xl mb-24">
        {!currentUser ? (
          <div className="text-center">
            <h3 className="text-white font-black mb-3">ለመግዛት ይግቡ (Login required)</h3>
            <div ref={telegramCheckoutRef} className="flex justify-center min-h-[50px]"></div>
            <p className="text-xs text-zinc-500 mt-4">ማሳሰቢያ: መልዕክት እንዲደርስዎ የ <a href={`https://t.me/${BOT_USERNAME}`} target="_blank" rel="noreferrer" className="text-amber-500 font-bold">@${BOT_USERNAME}</a> ቦትን Start ያድርጉ።</p>
          </div>
        ) : (
          <form onSubmit={handleProductOrderSubmit} className="space-y-4">
            <h3 className="text-amber-500 font-black text-lg border-b border-zinc-800 pb-2">ክፍያ እና ማረጋገጫ</h3>
            
            {!isVIP && selectedProduct.vip_price && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start space-x-3">
                <input type="checkbox" id="vipUpsell" checked={includeVipSignup} onChange={e => setIncludeVipSignup(e.target.checked)} className="mt-1 w-5 h-5 accent-amber-500" />
                <label htmlFor="vipUpsell" className="text-sm text-zinc-200">
                  <span className="font-bold text-amber-500 block">የ VIP ቅናሽ አሁን ያግኙ! (+100 ብር)</span>
                  ይህንን በመጫን የVIP አባልነት ይግዙና እቃውን በVIP ዋጋ ({selectedProduct.vip_price} ብር) ይውሰዱ።
                </label>
              </div>
            )}

            <input required value={orderName} onChange={(e) => setOrderName(e.target.value)} placeholder="ሙሉ ስም" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none" />
            <input required type="tel" maxLength="10" value={vipPhone} onChange={e => { const val = e.target.value.replace(/\D/g, ""); if (val.length <= 10) setVipPhone(val); }} placeholder="ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none" />
            <textarea required value={orderAddress} onChange={(e) => setOrderAddress(e.target.value)} rows="2" placeholder="የማድረሻ አድራሻ (ከተማ፣ ሰፈር፣ ልዩ ቦታ)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none"></textarea>

            <select required name="shippingSpeed" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none font-bold">
              <option value="">ማጓጓዣ ይምረጡ</option>
              <option value="standard">ከ3-5 የስራ ቀናት (መደበኛ)</option>
              <option value="next_day">በሚቀጥለው ቀን (+$10 CAD አስቸኳይ)</option>
            </select>

            <div className="flex space-x-2 mt-4">
              <button type="button" onClick={() => setPaymentType("ሀገር ውስጥ")} className={`flex-1 py-2 text-sm font-bold rounded-xl border ${paymentType === "ሀገር ውስጥ" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-800"}`}>ሀገር ውስጥ</button>
              <button type="button" onClick={() => setPaymentType("ዳያስፖራ")} className={`flex-1 py-2 text-sm font-bold rounded-xl border ${paymentType === "ዳያስፖራ" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-800"}`}>ዳያስፖራ</button>
            </div>

            {paymentType === "ሀገር ውስጥ" ? (
              <div className="bg-black p-3 rounded-xl border border-zinc-800 text-sm"><p className="text-amber-500 font-bold">CBE Account: 1000123456789</p></div>
            ) : (
              <div className="bg-black p-3 rounded-xl border border-zinc-800 text-sm"><p className="text-amber-500 font-bold">PayPal: demo@goleth.com</p></div>
            )}

            <div className="pt-2 border-t border-zinc-800">
              <label className="block text-zinc-400 text-xs font-bold mb-2">⚠️ ክፍያ ከፈጸሙ በኋላ ደረሰኙን እዚህ ያያይዙ፦</label>
              <input required type="file" onChange={(e) => setOrderFile(e.target.files[0])} accept="image/*" className="w-full text-sm text-zinc-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:bg-zinc-800 file:text-white file:border-0 bg-black border border-zinc-800 rounded-xl p-2" />
            </div>
            
            <button type="submit" disabled={uploading || vipPhone.length !== 10 || !orderFile} className="w-full bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black py-4 rounded-xl mt-4">
              {uploading ? "በመላክ ላይ..." : "ትዕዛዝ አረጋግጥ"}
            </button>
          </form>
        )}
      </div>
    ) : null;

    return (
      <div className="fixed inset-0 z-50 bg-black overflow-y-auto pb-6 animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={() => window.history.back()} className="bg-black/50 backdrop-blur p-2 rounded-full border border-zinc-800 text-white"><ChevronLeft size={24} /></button>
        </div>

        {hasImages && (
          <div className="w-full h-[40vh] bg-white flex items-center justify-center -mt-16 pt-16 relative">
            <img src={selectedProduct.image_urls[currentImgIndex]} alt={selectedProduct.name} className="max-h-full object-contain p-8 mix-blend-multiply" />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-2xl font-black text-white mb-1 leading-tight">{selectedProduct.name}</h1>
          <h2 className="text-zinc-200 text-sm font-black uppercase tracking-widest mb-6">{selectedProduct.brand}</h2>

          <div className="flex items-baseline space-x-4 mb-8 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
            <div>
               <p className="text-zinc-400 text-[10px] font-bold uppercase mb-1">መደበኛ ዋጋ</p>
               <p className="text-white font-black text-2xl leading-none">{selectedProduct.price} <span className="text-sm">ብር</span></p>
            </div>
            {selectedProduct.vip_price && (
              <div className="pl-4 border-l border-zinc-800">
                <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 flex items-center">👑 VIP ዋጋ</p>
                <p className="text-amber-500 font-black text-2xl leading-none">{selectedProduct.vip_price} <span className="text-sm">ብር</span></p>
              </div>
            )}
          </div>

          {!showInlineCheckout && selectedProduct.options && (
            <div className="mb-8">
              <h3 className="text-white font-bold text-sm mb-4">አማራጭ ይምረጡ</h3>
              <div className="grid grid-cols-3 gap-3">
                {selectedProduct.options.map(opt => (
                  <button key={opt} onClick={() => setSelectedOption(opt)} className={`py-3 px-1 text-xs font-bold border rounded-lg ${selectedOption === opt ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-zinc-700 text-white bg-zinc-900'}`}>{opt}</button>
                ))}
              </div>
            </div>
          )}

          {!showInlineCheckout && (
            <button disabled={selectedProduct.options?.length > 0 && !selectedOption} onClick={() => setShowInlineCheckout(true)} className="w-full bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black py-4 rounded-xl text-lg mt-4">
               አሁን ይግዙ (Buy Now)
            </button>
          )}

          {inlineCheckoutUI}
        </div>
      </div>
    );
  };

  const renderVIP = () => {
    if (!currentUser) {
      return (
        <div className="pb-24 pt-6 text-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl mb-8">
            <h2 className="text-2xl font-black text-amber-500 mb-6">እንኳን ደህና መጡ!</h2>
            <p className="text-zinc-400 text-sm mb-6">ወደ አካውንትዎ ለመግባት ወይም አዲስ አባል ለመሆን በቴሌግራም ይግቡ።</p>
            <div ref={telegramWrapperRef} className="flex justify-center min-h-[50px]"></div>
          </div>
        </div>
      );
    }

    if (hasPendingVip) {
      return (
        <div className="pb-24 pt-6 text-center">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-8 mb-8">
            <div className="text-amber-500 mb-4 animate-pulse">⏳</div>
            <h2 className="text-xl font-black text-white mb-2">ማረጋገጫ በሂደት ላይ ነው</h2>
            <p className="text-zinc-400 text-sm">የላኩት ክፍያ በCEO በመታየት ላይ ነው። ሲፈቀድ መረጃ ይደርስዎታል።</p>
          </div>
        </div>
      );
    }

    if (!isVIP) {
      return (
        <div className="pb-24 pt-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl mb-8">
            <h2 className="text-xl font-black text-amber-500 mb-4 text-center">የVIP አባልነት ክፍያ</h2>
            
            <div className="flex space-x-2 mb-6">
              <button onClick={() => setPaymentType("ሀገር ውስጥ")} className={`flex-1 py-3 text-sm font-bold rounded-xl border ${paymentType === "ሀገር ውስጥ" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-800"}`}>ሀገር ውስጥ (100 ብር)</button>
              <button onClick={() => setPaymentType("ዳያስፖራ")} className={`flex-1 py-3 text-sm font-bold rounded-xl border ${paymentType === "ዳያስፖራ" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-800"}`}>ዳያስፖራ ($10)</button>
            </div>

            <div className="bg-black p-4 rounded-xl border border-zinc-800 mb-6">
              <p className="font-black text-amber-500 mb-2">⚠️ መመሪያ፦</p>
              <p className="text-sm text-white mb-2">መጀመሪያ ክፍያዎን ከታች ወዳለው አካውንት ያስተላልፉ። በመቀጠል ደረሰኙን ፎቶ አንስተው እዚህ ያያይዙ።</p>
              <p className="text-amber-500 font-mono font-black text-lg text-center mt-4">
                {paymentType === "ሀገር ውስጥ" ? "CBE: 1000123456789" : "PayPal: demo@goleth.com"}
              </p>
            </div>

            <form onSubmit={handleVipPaymentSubmit} className="space-y-4">
              <input required name="fullName" placeholder="ሙሉ ስም" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl" />
              <input required type="tel" maxLength="10" value={vipPhone} onChange={e => { const val = e.target.value.replace(/\D/g, ""); if (val.length <= 10) setVipPhone(val); }} placeholder="ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl font-mono" />
              
              <div className="border-t border-zinc-800 pt-4">
                <label className="block text-white font-bold text-sm mb-2">የክፍያ ማረጋገጫ ፋይል፦</label>
                <input required type="file" onChange={(e) => setVipReceiptFile(e.target.files[0])} accept="image/*" className="w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:bg-zinc-800 file:text-white file:border-0 bg-black border border-zinc-800 rounded-xl p-2" />
              </div>
              
              <button type="submit" disabled={uploading || vipPhone.length !== 10 || !vipReceiptFile} className="w-full bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black py-4 rounded-xl text-lg mt-2">
                {uploading ? "በመጫን ላይ..." : "መረጃ ላክ (Send)"}
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="pb-24">
        <h2 className="text-2xl font-black text-white mb-6 text-center">የVIP ትንበያ</h2>
        {games.map(game => (
            <div key={game.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4 shadow-xl">
               <div className="text-center font-bold text-amber-500">{game.team_a} vs {game.team_b}</div>
            </div>
        ))}
      </div>
    );
  };

  const renderSuccessModal = () => (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center max-w-md w-full">
        <div className="text-amber-500 text-4xl mb-4">✓</div>
        <h2 className="text-xl font-black text-white mb-4">ተሳክቷል!</h2>
        <p className="text-zinc-400 text-sm mb-6">መረጃዎ ደርሷል። በቴሌግራም መልዕክት እንዲደርስዎ የ <a href={`https://t.me/${BOT_USERNAME}`} target="_blank" rel="noreferrer" className="text-amber-500 font-bold">@${BOT_USERNAME}</a> ቦትን Start ማለቶን አይርሱ።</p>
        <button onClick={() => setShowSuccessModal(false)} className="w-full bg-amber-500 text-black font-black py-3 rounded-xl">እሺ</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-zinc-900 p-4 flex justify-between items-center">
        <h1 onClick={handleLogoTap} className="text-white font-black text-2xl tracking-widest cursor-pointer">GOL<span className="text-amber-500">ETH</span></h1>
        <div className="flex items-center space-x-3">
          <button onClick={() => { setActiveTab("ቪአይፒ"); window.scrollTo(0,0); }} className="bg-[#2AABEE] text-white px-4 py-1.5 rounded-full text-xs font-bold">
            {currentUser ? currentUser.first_name : "ይግቡ"}
          </button>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {selectedProduct ? renderProductDetail() : (
          <>
            {activeTab === "ቪአይፒ" ? renderVIP() : <div className="text-center mt-10 text-zinc-500">ይህ ገጽ በቅርቡ ይዘመናል</div>}
          </>
        )}
      </main>

      {showSuccessModal && renderSuccessModal()}

      <nav className="fixed bottom-0 w-full bg-black/95 backdrop-blur-md border-t border-zinc-900 flex justify-around pb-6 pt-3 px-1 z-40">
        {[ {id:"ዋና", icon:Home}, {id:"ቪአይፒ", icon:Target}, {id:"ሱቅ", icon:ShoppingBag} ].map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedProduct(null); }} className={`flex flex-col items-center p-2 ${activeTab === tab.id ? "text-amber-500" : "text-zinc-600"}`}>
            <tab.icon size={24} className="mb-1" />
            <span className="text-[10px] font-bold">{tab.id}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
