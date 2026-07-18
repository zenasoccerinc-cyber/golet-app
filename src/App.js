import React, { useState, useEffect, useRef } from "react";
import {
  Home, Trophy, Flame, Users, Target, ShoppingBag, X, Trash2, Edit2, ChevronLeft, PlusCircle, Send, ChevronRight, CheckCircle
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Secure Supabase Connection
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Telegram Configuration
const TELEGRAM_BOT_TOKEN = "8726960567:AAGx_RJag33dBAjlQdGkJhgYEbzdVrBAlHU"; 
const TELEGRAM_CHAT_ID = "813725953"; 

export default function App() {
  const [activeTab, setActiveTab] = useState("ዋና");
  const [activePost, setActivePost] = useState(null);
  
  const [shopCategory, setShopCategory] = useState("ሁሉም");
  const [shopSubCategory, setShopSubCategory] = useState("ሁሉም");

  // Shopping States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [showInlineCheckout, setShowInlineCheckout] = useState(false);
  const [includeVipSignup, setIncludeVipSignup] = useState(false);
  
  // Checkout & Sourcing Form States
  const [userRegion, setUserRegion] = useState("ሀገር ውስጥ");
  const [checkoutShipping, setCheckoutShipping] = useState("standard");
  const [orderName, setOrderName] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderFile, setOrderFile] = useState(null);
  
  // Gift States
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  const [isCEO, setIsCEO] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [showProfileModal, setShowProfileModal] = useState(false);
  
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
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [vipStatus, setVipStatus] = useState("none");
  const [hasPendingVip, setHasPendingVip] = useState(false);
  const [games, setGames] = useState([]);
  const [userPredictions, setUserPredictions] = useState({});
  const [predictionInputs, setPredictionInputs] = useState({});
  const [newGame, setNewGame] = useState({ team_a: '', team_b: '', team_a_logo: '', team_b_logo: '' });
  const [scoresToUpdate, setScoresToUpdate] = useState({});
  
  const [vipPaymentType, setVipPaymentType] = useState("ሀገር ውስጥ"); 
  const [vipPhone, setVipPhone] = useState("");
  const [vipReceiptFile, setVipReceiptFile] = useState(null);
  
  const telegramWrapperRef = useRef(null); 
  const telegramCheckoutRef = useRef(null);

  const authorList = ["GOLETH", "አማኑኤል", "Writer Name"];
  
  const categorizedOptions = {
    "ጫማ (Shoes)": ["38", "39", "40", "41", "42", "43", "44", "45"],
    "የልጆች ልብስ (Kids Clothing)": ["Kids 0-3m", "Kids 3-6m", "Kids 6-12m", "Kids 1-2Y", "Kids 2-4Y", "Kids 4-6Y", "Kids 6-8Y", "Kids 8-10Y", "Kids 10-12Y"],
    "የልጆች ጫማ (Kids Shoes)": ["Kids Shoe 20-25", "Kids Shoe 26-30", "Kids Shoe 31-35"],
    "ልብስ (Clothing)": ["XS", "S", "M", "L", "XL", "XXL"],
    "ክብደት/መጠን (Weights/Liquids)": ["50g", "100g", "250g", "500g", "1kg", "250ml", "500ml", "1L"],
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
    if (activeTab === "ቪአይፒ" && !currentUser && telegramWrapperRef.current) {
      if (telegramWrapperRef.current.innerHTML !== '') return; 
      window.onTelegramAuth = (user) => { handleTelegramLogin(user); };
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", "goleth_app_bot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.async = true;
      telegramWrapperRef.current.appendChild(script);
    }
  }, [activeTab, currentUser]);

  useEffect(() => {
    if (showInlineCheckout && !currentUser && telegramCheckoutRef.current) {
      if (telegramCheckoutRef.current.innerHTML !== '') return; 
      window.onTelegramAuth = (user) => { handleTelegramLogin(user); };
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", "goleth_app_bot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.async = true;
      telegramCheckoutRef.current.appendChild(script);
    }
  }, [showInlineCheckout, currentUser]);

  // Pre-fill forms when profile loads
  useEffect(() => {
    if (currentUserProfile) {
      setOrderName(currentUserProfile.full_name || "");
      setVipPhone(currentUserProfile.phone_number || "");
      setUserRegion(currentUserProfile.region === 'Diaspora' ? 'ዳያስፖራ' : 'ሀገር ውስጥ');
      setVipPaymentType(currentUserProfile.region === 'Diaspora' ? 'ዳያስፖራ' : 'ሀገር ውስጥ');
    }
  }, [currentUserProfile]);

  const fetchData = async () => {
    try {
      const { data: postsData } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      const { data: productsData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setPosts(postsData || []);
      setProducts(productsData || []);
    } catch (error) { console.error("Fetch error:", error); }
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
      .select('*');

    if (data && data[0]) {
      const userRecord = data[0];
      setCurrentUserProfile(userRecord);

      // Check if profile is incomplete
      if (!userRecord.full_name || !userRecord.phone_number) {
        setShowProfileModal(true);
      }

      let currentStatus = "none";
      let activeVip = userRecord.is_vip;

      if (userRecord.vip_until) {
        const now = new Date();
        const expireDate = new Date(userRecord.vip_until);
        const gracePeriodDate = new Date(expireDate.getTime() + (2 * 24 * 60 * 60 * 1000)); 
        
        if (now > gracePeriodDate) {
          currentStatus = "expired";
          activeVip = false; 
        } else if (now > expireDate) {
          currentStatus = "expiring_soon"; 
        } else {
          currentStatus = "active";
        }
      } else if (activeVip) {
        currentStatus = "active";
      }

      setIsVIP(activeVip);
      setVipStatus(currentStatus);
      fetchUserPredictions(telegramUser.id);
      checkPendingVip(telegramUser.id);
    }
  };

  const saveUserProfile = async (e) => {
    e.preventDefault();
    setUploading(true);
    const name = e.target.fullName.value;
    const phone = e.target.phone.value;
    const loc = e.target.location.value;
    const region = ["USA", "Canada", "Europe", "Australia", "South America"].includes(loc) ? 'Diaspora' : 'Local';

    const { data, error } = await supabase.from('vip_users').update({ 
      full_name: name, 
      phone_number: phone, 
      region: region 
    }).eq('telegram_id', currentUser.id).select('*');

    if (!error && data && data[0]) {
      setCurrentUserProfile(data[0]);
      setShowProfileModal(false);
    }
    setUploading(false);
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

    if (vipPhone.length !== 10 || !vipReceiptFile) {
      alert("እባክዎ መረጃዎችን በትክክል ያስገቡ።");
      setUploading(false); return;
    }

    const receiptUrl = await uploadFileToSupabase(vipReceiptFile);

    const { error: dbError } = await supabase.from("vip_payments").insert([
      { telegram_id: currentUser?.id, full_name: orderName, phone_number: vipPhone, payment_type: vipPaymentType, receipt_url: receiptUrl, status: 'pending' }
    ]);

    if (dbError) {
      alert("የመረጃ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።");
      setUploading(false); return;
    }

    const adminMsg = `👑 <b>አዲስ የVIP አባልነት ክፍያ ደርሷል!</b>\n\n👤 <b>ስም:</b> ${orderName}\n📞 <b>ስልክ:</b> ${vipPhone}\n💳 <b>የክፍያ አይነት:</b> ${vipPaymentType}\n🖼️ <b>የደረሰኝ ሊንክ:</b> ${receiptUrl}`;
    const userMsg = `🎉 <b>ክፍያዎ በተሳካ ሁኔታ ደርሶናል!</b>\n\nውድ ${orderName}፣ የላኩትን የክፍያ ማረጋገጫ ተቀብለናል። ክፍያው እንደተረጋገጠ ከ24 ሰዓት ባነሰ ጊዜ ውስጥ የVIP አባልነትዎ ይከፈታል።\nማሳሰቢያ: መልዕክት እንዲደርስዎ @goleth_app_bot ን START ማለቶን ያረጋግጡ።`;
    
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: adminMsg, parse_mode: "HTML" }) });
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: currentUser.id, text: userMsg, parse_mode: "HTML" }) });
    } catch (err) {}

    setUploading(false);
    setHasPendingVip(true);
    setActiveTab("ዋና");
    window.scrollTo(0,0);
    setShowSuccessModal(true);
  };

  const handleProductOrderSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const isGettingVipPrice = isVIP || includeVipSignup;
    const basePrice = selectedProduct.vip_price && isGettingVipPrice ? selectedProduct.vip_price : selectedProduct.price;
    const roundedWeight = Math.ceil(selectedProduct.weight_kg || 1.0); 
    
    // Removed the +2000 Birr shipping calculation as requested. Product price is the total baseline.
    let finalPrice = basePrice; 
    let nextDayBirr = checkoutShipping === "next_day" ? 850 : 0; 
    let vipSignupBirr = includeVipSignup ? (userRegion === "ሀገር ውስጥ" ? 100 : 850) : 0;
    
    finalPrice = finalPrice + nextDayBirr + vipSignupBirr;

    let orderNotes = checkoutShipping === "next_day" ? "+ $10 CAD (Next Day Premium)" : "Standard Shipping";
    if (includeVipSignup) orderNotes += ` | +VIP Membership Signup (${userRegion})`;
    
    let finalDeliveryAddress = orderAddress;
    if (isGift) {
      orderNotes += ` | 🎁 GIFT ORDER`;
      finalDeliveryAddress = `[GIFT FOR: ${recipientName} | Ph: ${recipientPhone}] ${recipientAddress}`;
    }

    const receiptUrl = orderFile ? await uploadFileToSupabase(orderFile) : "";

    const { error: dbError } = await supabase.from("product_orders").insert([{ 
        telegram_id: currentUser.id.toString(), 
        full_name: orderName, 
        phone_number: vipPhone, 
        delivery_address: finalDeliveryAddress,
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        selected_option: selectedOption || "N/A",
        price: finalPrice,
        payment_type: userRegion, 
        receipt_url: receiptUrl,
        shipping_speed: checkoutShipping,
        total_weight_kg: roundedWeight,
        is_new_vip_signup: includeVipSignup 
      }]);

    if (dbError) {
      alert("የመረጃ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።");
      setUploading(false); return;
    }

    const adminMsg = `🛍 <b>አዲስ የእቃ ትዕዛዝ!</b>\n\n👤 <b>ስም:</b> ${orderName}\n📞 <b>ስልክ:</b> ${vipPhone}\n📍 <b>አድራሻ:</b> ${finalDeliveryAddress}\n📦 <b>እቃ:</b> ${selectedProduct.name}\n📏 <b>አማራጭ:</b> ${selectedOption || "N/A"}\n🚚 <b>ማጓጓዣ:</b> ${checkoutShipping}\n💰 <b>ጠቅላላ ዋጋ:</b> ${finalPrice} ብር\n📝 <b>Notes:</b> ${orderNotes}\n💳 <b>ክፍያ ክልል:</b> ${userRegion}\n🖼️ <b>ደረሰኝ:</b> ${receiptUrl}`;
    const userMsg = `🎉 <b>ትዕዛዝዎ ደርሶናል!</b>\n\nውድ ${orderName}፣ ለ ${selectedProduct.name} የላኩትን የክፍያ ማረጋገጫ ተቀብለናል። ክፍያው እንደተረጋገጠ ሂደቱ ወዲያውኑ ይጀምራል።`;
    
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: adminMsg, parse_mode: "HTML" }) });
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: currentUser.id, text: userMsg, parse_mode: "HTML" }) });
    } catch (err) {}

    setUploading(false);
    setShowInlineCheckout(false);
    setSelectedProduct(null);
    setSelectedOption(null);
    setIncludeVipSignup(false);
    setIsGift(false);
    setOrderFile(null);
    setActiveTab("ሱቅ");
    window.scrollTo(0,0);
    setShowSuccessModal(true);
  };

  const submitOrderForm = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("እባክዎ ትዕዛዝዎን ለመላክ መጀመሪያ በቴሌግራም ይግቡ።");
      return;
    }
    
    setUploading(true);

    const name = orderName;
    const phone = vipPhone;
    const productName = e.target.productName.value;
    const storeName = e.target.storeName.value;
    const productLink = e.target.productLink.value;
    const shipping = e.target.shipping.value;
    const imageFile = e.target.orderImage.files[0];

    if (!productName && !productLink && !imageFile) {
       alert("እባክዎ ቢያንስ የእቃውን ስም፣ ሊንክ ወይም ምስል ያስገቡ።");
       setUploading(false); return;
    }

    let imageUrl = "";
    if (imageFile) {
       const uploadedUrl = await uploadFileToSupabase(imageFile);
       if (uploadedUrl) imageUrl = uploadedUrl;
    }

    let extraNotes = "";
    if (isGift) {
      extraNotes = `\n🎁 <b>GIFT TO:</b> ${recipientName} | Ph: ${recipientPhone} | Addr: ${recipientAddress}`;
    }

    const { error: dbError } = await supabase.from("sourcing_requests").insert([{
      telegram_id: currentUser.id.toString(),
      full_name: name,
      phone_number: phone,
      product_name: productName || null,
      store_name: storeName || null,
      product_link: productLink || null,
      image_url: imageUrl || null,
      shipping_speed: shipping
    }]);

    if (dbError) {
      alert("የመረጃ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።");
      setUploading(false); return;
    }

    const message = `🛍 <b>አዲስ ልዩ የእቃ ማዘዣ!</b>\n\n👤 <b>ስም:</b> ${name}\n📞 <b>ስልክ:</b> ${phone}\n📦 <b>የእቃው ስም:</b> ${productName || "አልተገለጸም"}\n🏪 <b>የሱቁ ስም:</b> ${storeName || "አልተገለጸም"}\n🔗 <b>ሊንክ:</b> ${productLink || "አልተገለጸም"}\n🚚 <b>አቅርቦት:</b> ${shipping}${extraNotes}\n🖼️ <b>ምስል:</b> ${imageUrl || "ምንም ምስል አልተያያዘም"}`;
    
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" })
      });
    } catch (err) { console.log(err); }

    setUploading(false);
    setIsGift(false);
    alert("ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል!");
    setShowOrderForm(false);
    if(activePost) window.history.back(); 
    setActiveTab("ሱቅ");
    window.scrollTo(0,0);
  };

  // Prediction and admin functions remain exactly identical
  const submitPrediction = async (gameId) => {
    if (!currentUser) return;
    const scoreA = predictionInputs[gameId]?.a;
    const scoreB = predictionInputs[gameId]?.b;

    if (scoreA === undefined || scoreB === undefined || scoreA === "" || scoreB === "") { alert("እባክዎ ሁለቱንም ውጤቶች ያስገቡ።"); return; }
    
    const { error } = await supabase.from('predictions').insert([
      { telegram_id: currentUser.id, game_id: gameId, predicted_score_a: parseInt(scoreA), predicted_score_b: parseInt(scoreB) }
    ]);

    if (!error) { alert("ውጤቱ ተመዝግቧል!"); fetchUserPredictions(currentUser.id); } 
    else { alert("ውጤቱን ቀድመው ገምተዋል።"); }
  };

  const createGame = async () => {
    await supabase.from('games').insert([newGame]);
    setNewGame({ team_a: '', team_b: '', team_a_logo: '', team_b_logo: '' });
    fetchGames(); alert("ጨዋታው ታትሟል!");
  };

  const updateFinalScore = async (gameId) => {
    const scores = scoresToUpdate[gameId];
    if (!scores || scores.a === undefined || scores.b === undefined) return;

    await supabase.from('games').update({ final_score_a: parseInt(scores.a), final_score_b: parseInt(scores.b), status: 'finished' }).eq('id', gameId);
    fetchGames(); alert("ጨዋታው ተጠናቆ ውጤቱ ተመዝግቧል!");
  };

  const handleLogoTap = () => {
    setActiveTab("ዋና");
    if (activePost) window.history.back(); 
    const newCount = tapCount + 1;
    setTapCount(newCount);
    setTimeout(() => setTapCount(0), 3000);

    if (newCount >= 5) {
      const password = window.prompt("የአስተዳዳሪ የይለፍ ቃል ያስገቡ:");
      if (password === "admin123") { setIsCEO(true); setShowAdmin(true); }
      setTapCount(0);
    }
  };

  const openPost = (post) => { window.history.pushState({ postId: post.id }, "", `#article-${post.id}`); setActivePost(post); };
  const openProduct = (prod) => { window.history.pushState({ prodId: prod.id }, "", `#product-${prod.id}`); setSelectedProduct(prod); setCurrentImgIndex(0); setSelectedOption(null); setShowInlineCheckout(false); };
  const handleDelete = async (table, id) => { if (window.confirm("እርግጠኛ ነዎት?")) { await supabase.from(table).delete().eq("id", id); if (table === "games") fetchGames(); else fetchData(); if (activePost || selectedProduct) window.history.back(); } };
  const handleEdit = (type, item) => {
    setAdminTab(type); setEditId(item.id);
    if (type === "posts") {
      setFormData({ postCategory: item.category, title: item.title, subtitle: item.subtitle || "", excerpt: item.excerpt || "", body: item.body || "", author: item.author || "GOLETH", relatedLinks: item.related_links || [] });
      if (item.image_urls && item.image_urls.length > 0) { setExistingMainImage(item.image_urls[0]); setExistingInlineImages(item.image_urls.slice(1)); } 
      else { setExistingMainImage(null); setExistingInlineImages([]); }
    } else {
      setFormData({ title: item.name, brand: item.brand || "", price: item.price, vipPrice: item.vip_price || "", weight_kg: item.weight_kg || "", shopCat: item.category, shopSubCat: item.subcategory || "", options: item.options || [], });
    }
    setMainImageFile(null); setInlineImageFiles([]); setProductImageFiles([]); setShowAdmin(true);
  };
  const openNewPost = (type) => { setAdminTab(type); setEditId(null); setFormData({ options: [], relatedLinks: [], author: "GOLETH" }); setExistingMainImage(null); setExistingInlineImages([]); setMainImageFile(null); setInlineImageFiles([]); setProductImageFiles([]); };
  const handleSizeChange = (e) => { const value = e.target.value; setFormData((prev) => { const options = prev.options || []; if (options.includes(value)) return { ...prev, options: options.filter((s) => s !== value) }; return { ...prev, options: [...options, value] }; }); };
  const toggleOptionCategory = (categoryName) => { setExpandedOptionCategories((prev) => ({ ...prev, [categoryName]: !prev[categoryName] })); };
  const handleAddRelated = (e) => { const value = e.target.value; if (!value) return; if (!formData.relatedLinks?.includes(value)) { setFormData(prev => ({ ...prev, relatedLinks: [...(prev.relatedLinks || []), value] })); } };
  const removeRelated = (linkToRemove) => { setFormData(prev => ({ ...prev, relatedLinks: prev.relatedLinks.filter(l => l !== linkToRemove) })); };
  const handleAdminSubmit = async (e) => {
    e.preventDefault(); setUploading(true); let finalUrls = [];
    if (adminTab === "posts") {
      if (mainImageFile) { const newMainUrl = await uploadFileToSupabase(mainImageFile); if (newMainUrl) finalUrls.push(newMainUrl); } else if (existingMainImage) { finalUrls.push(existingMainImage); }
      const uploadedInlineUrls = [];
      if (inlineImageFiles.length > 0) { for (const file of inlineImageFiles) { const inlineUrl = await uploadFileToSupabase(file); if (inlineUrl) uploadedInlineUrls.push(inlineUrl); } }
      if (uploadedInlineUrls.length > 0) { finalUrls = [...finalUrls, ...uploadedInlineUrls]; } else { finalUrls = [...finalUrls, ...existingInlineImages]; }
      const payload = { category: formData.postCategory || "ዋና", title: formData.title, subtitle: formData.subtitle, excerpt: formData.excerpt, body: formData.body, author: formData.author || "GOLETH", related_links: formData.relatedLinks || [], image_urls: finalUrls };
      if (editId) { await supabase.from("posts").update(payload).eq("id", editId); } else { await supabase.from("posts").insert([payload]); }
    } else if (adminTab === "products") {
      if (productImageFiles.length > 0) { for (const file of productImageFiles) { const prodUrl = await uploadFileToSupabase(file); if (prodUrl) finalUrls.push(prodUrl); } }
      const payload = { name: formData.title, brand: formData.brand, price: Number(formData.price), vip_price: formData.vipPrice ? Number(formData.vipPrice) : null, weight_kg: formData.weight_kg ? Number(formData.weight_kg) : 1.0, category: formData.shopCat, subcategory: formData.shopSubCat, options: formData.options, };
      if (finalUrls.length > 0) payload.image_urls = finalUrls;
      if (editId) { await supabase.from("products").update(payload).eq("id", editId); } else { await supabase.from("products").insert([payload]); }
    }
    setFormData({ options: [], relatedLinks: [] }); setMainImageFile(null); setInlineImageFiles([]); setProductImageFiles([]); setExistingMainImage(null); setExistingInlineImages([]); setEditId(null); setUploading(false); setShowAdmin(false); setShowSizeDropdown(false); setExpandedOptionCategories({}); fetchData(); alert("በተሳካ ሁኔታ ተጠናቋል!");
  };

  const renderProfileModal = () => (
    <div className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-black text-amber-500 mb-2">እንኳን ደህና መጡ!</h2>
        <p className="text-zinc-300 text-sm mb-6">ለፈጣን አገልግሎት እባክዎ መረጃዎን ይሙሉ (ይህ አንዴ ብቻ የሚጠየቅ ነው)።</p>
        <form onSubmit={saveUserProfile} className="space-y-4">
          <input required name="fullName" defaultValue={currentUserProfile?.full_name || ""} placeholder="ሙሉ ስም (Full Name)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none" />
          <input required name="phone" type="tel" maxLength="10" pattern="[0-9]{10}" defaultValue={currentUserProfile?.phone_number || ""} placeholder="ስልክ ቁጥር (Phone Number)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none font-mono" />
          
          <select required name="location" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none font-bold">
            <option value="">የት ሀገር ነዎት? (Location)</option>
            <option value="Ethiopia">Ethiopia (ኢትዮጵያ)</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="Europe">Europe</option>
            <option value="Australia">Australia</option>
            <option value="South America">South America</option>
            <option value="Other">Other (ሌላ)</option>
          </select>

          <button type="submit" disabled={uploading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl shadow-lg transition-colors mt-4">
            {uploading ? "በማስቀመጥ ላይ..." : "አስቀምጥ (Save)"}
          </button>
        </form>
      </div>
    </div>
  );

  const renderSuccessModal = () => (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto flex flex-col p-6 animate-in fade-in zoom-in duration-200 justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative shadow-2xl max-w-md mx-auto w-full text-center">
        <button onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4 bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors"><X className="text-white w-5 h-5" /></button>
        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 text-4xl font-black shadow-[0_0_20px_rgba(245,158,11,0.2)]">✓</div>
        <h2 className="text-2xl font-black text-white mb-4">መረጃዎ ደርሶናል!</h2>
        <p className="text-zinc-300 text-sm leading-loose mb-8">ማረጋገጫዎ በተሳካ ሁኔታ ተልኳል። ሂደቱ ወዲያውኑ ይጀምራል።</p>
        <button onClick={() => setShowSuccessModal(false)} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-2xl transition-colors text-lg shadow-lg">እሺ (OK)</button>
      </div>
    </div>
  );

  const renderOrderForm = () => (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto flex flex-col p-4 animate-in fade-in zoom-in duration-200 justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative shadow-2xl max-w-md mx-auto w-full">
        <button onClick={() => setShowOrderForm(false)} className="absolute top-4 right-4 bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors"><X className="text-white w-5 h-5" /></button>
        <h2 className="text-2xl font-black text-amber-500 mb-2">ልዩ ዕቃ ማዘዣ</h2>
        <p className="text-zinc-300 text-sm mb-4">ምን ማምጣት እንድንልዎት ይፈልጋሉ? ከታች ካሉት አማራጮች ቢያንስ አንዱን ያስገቡ።</p>
        
        <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg mb-6 text-xs text-zinc-300">
          {isVIP 
            ? <><span className="text-amber-500 font-bold">የVIP ጥቅም:</span> መደበኛ ማጓጓዣ (3-5 ቀናት) ነፃ ነው! የአገልግሎት ክፍያ ብቻ ይከፍላሉ።</>
            : <><span className="font-bold">ማሳሰቢያ:</span> ልዩ ማዘዣ የአገልግሎት ክፍያ እና የማጓጓዣ ክፍያዎችን ያካትታል።</>
          }
        </div>

        <form onSubmit={submitOrderForm} className="space-y-4">
          <input required name="name" value={orderName} onChange={e => setOrderName(e.target.value)} placeholder="ሙሉ ስም" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors text-base" />
          <input required name="phone" type="tel" maxLength="10" value={vipPhone} onChange={e => setVipPhone(e.target.value)} placeholder="ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors text-base" />
          
          <div className="border-t border-zinc-800 my-4 pt-4 space-y-3">
             <input name="productName" placeholder="የእቃው ስም (ለምሳሌ: iPhone 15)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors text-base" />
             <input name="storeName" placeholder="የሱቁ ስም (ለምሳሌ: Amazon)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors text-base" />
             <input name="productLink" type="url" placeholder="የእቃው ሊንክ (ካለ)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors text-base" />
             
             <div>
                <label className="block text-zinc-400 text-sm mb-1.5 font-bold">ወይም የእቃውን ምስል ያያይዙ (ካለ)፦</label>
                <input type="file" name="orderImage" accept="image/*" className="w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:bg-zinc-800 file:text-white file:border-0 file:cursor-pointer" />
             </div>
          </div>

          <label className="flex items-center space-x-3 text-zinc-300 mt-4 bg-black p-4 rounded-xl border border-zinc-800 cursor-pointer">
            <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} className="w-5 h-5 accent-amber-500 cursor-pointer" />
            <span className="font-bold text-sm">ይህ ዕቃ ስጦታ ነው? (Is this a gift?)</span>
          </label>

          {isGift && (
            <div className="p-4 bg-zinc-900 border border-amber-500/30 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
              <h4 className="text-amber-500 font-bold text-xs uppercase tracking-wider mb-2">የተቀባዩ መረጃ (Recipient Info)</h4>
              <input required value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="የተቀባዩ ሙሉ ስም" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm" />
              <input required type="tel" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} placeholder="የተቀባዩ ስልክ ቁጥር" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm font-mono" />
              <textarea required value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} rows="2" placeholder="የተቀባዩ ሙሉ አድራሻ (ከተማ, ሰፈር)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm"></textarea>
            </div>
          )}
          
          <select required name="shipping" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors text-base font-bold mt-4">
            <option value="">ማጓጓዣ ይምረጡ</option>
            <option value="3-5 የሰራ ቀናት">ከ3-5 የስራ ቀናት (መደበኛ)</option>
            <option value="በሚቀጥለው ቀን አቅርቦት">በሚቀጥለው ቀን (አስቸኳይ)</option>
          </select>
          
          <button type="submit" disabled={uploading} className="w-full bg-amber-500 disabled:bg-zinc-800 hover:bg-amber-400 text-black font-black py-4 rounded-xl mt-4 flex items-center justify-center transition-colors text-lg">
            {uploading ? "በመላክ ላይ..." : <><Send size={20} className="mr-2" /> ትዕዛዙን ላክ</>}
          </button>
        </form>
      </div>
    </div>
  );

  const renderOrderBanner = () => (
    <button onClick={() => setShowOrderForm(true)} className="col-span-2 w-full text-left bg-gradient-to-br from-zinc-900 to-black rounded-xl p-4 flex justify-between items-center shadow-2xl border border-amber-500/20 mb-6 mt-2 hover:border-amber-500/50 transition-all group">
      <div className="relative z-10">
        <h3 className="text-amber-500 font-black text-sm tracking-wide mb-1 drop-shadow-md">ልዩ ዕቃ ማዘዝ ይፈልጋሉ?</h3>
        <p className="text-zinc-400 text-[10px] font-bold">ከማንኛውም ቦታ፡ እኛ እናመጣሎታለን!</p>
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
    if (lastIndex < text.length) { parts.push(text.substring(lastIndex)); }

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
          <div key={`prod_${p.id}`} onClick={() => { setActivePost(null); openProduct(p); window.scrollTo(0,0); }} className="bg-zinc-900 rounded-xl overflow-hidden border border-amber-500/50 hover:border-amber-500 cursor-pointer flex flex-col items-center p-3 relative transition-colors">
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
        <h3 className="text-amber-500 font-black text-sm mb-4">ተያያዥ</h3>
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
            <Edit2 size={14} className="mr-1" /> አስተካክል
          </button>
          <button onClick={() => handleDelete("posts", activePost.id)} className="bg-red-900/30 text-red-500 hover:bg-red-900/50 hover:text-red-400 border border-red-900 p-2 rounded-lg text-xs font-bold flex-1 flex items-center justify-center transition-colors">
            <Trash2 size={14} className="mr-1" /> ሰርዝ
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

  const renderProductDetail = () => {
    if (!selectedProduct) return null;
    const hasImages = selectedProduct.image_urls && selectedProduct.image_urls.length > 0;

    // Dynamic Checkout Subtotal Logic
    const isGettingVipPrice = isVIP || includeVipSignup;
    const basePrice = selectedProduct.vip_price && isGettingVipPrice ? selectedProduct.vip_price : selectedProduct.price;
    const nextDayBirr = checkoutShipping === "next_day" ? 850 : 0; 
    const vipSignupBirr = includeVipSignup ? (userRegion === "ሀገር ውስጥ" ? 100 : 850) : 0;
    
    // Removed specific kg multiplier as requested by user - basePrice represents fully landed cost
    const dynamicTotal = basePrice + nextDayBirr + vipSignupBirr;

    const inlineCheckoutUI = showInlineCheckout ? (
      <div className="bg-zinc-900 border border-amber-500/50 rounded-2xl p-5 mt-8 animate-in slide-in-from-top-4 duration-300 shadow-2xl mb-24">
        {!currentUser ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 mx-auto"><Target className="text-amber-500 w-8 h-8" /></div>
            <h3 className="text-white font-black mb-3">ለመግዛት ይግቡ (Login required)</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed max-w-xs mx-auto">ትዕዛዝዎን በትክክል ለማስኬድ በቴሌግራም መለያዎ ይግቡ።</p>
            <div ref={telegramCheckoutRef} className="flex justify-center min-h-[50px]"></div>
            <p className="text-xs text-zinc-500 mt-4">ማሳሰቢያ: መልዕክት እንዲደርስዎ የ <a href={`https://t.me/goleth_app_bot`} target="_blank" rel="noreferrer" className="text-amber-500 font-bold">@goleth_app_bot</a> ቦትን Start ያድርጉ።</p>
          </div>
        ) : (
          <form onSubmit={handleProductOrderSubmit} className="space-y-4">
            <h3 className="text-white font-black text-lg border-b border-zinc-800 pb-2 mb-4">የት ነዎት? (Location)</h3>
            <div className="flex space-x-2 mb-6">
              <button type="button" onClick={() => setUserRegion("ሀገር ውስጥ")} className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${userRegion === "ሀገር ውስጥ" ? "bg-amber-500 text-black border-amber-500 shadow-lg" : "bg-black text-zinc-400 border-zinc-800"}`}>ኢትዮጵያ ውስጥ</button>
              <button type="button" onClick={() => setUserRegion("ዳያስፖራ")} className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${userRegion === "ዳያስፖራ" ? "bg-amber-500 text-black border-amber-500 shadow-lg" : "bg-black text-zinc-400 border-zinc-800"}`}>ውጪ ሀገር (Diaspora)</button>
            </div>

            <h3 className="text-white font-black text-sm uppercase tracking-widest border-b border-zinc-900 pb-2 mb-4">የእርስዎ መረጃ</h3>
            
            {!isVIP && selectedProduct.vip_price && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start space-x-3 mb-6">
                <input type="checkbox" id="vipUpsell" checked={includeVipSignup} onChange={e => setIncludeVipSignup(e.target.checked)} className="mt-1 w-5 h-5 accent-amber-500 cursor-pointer" />
                <label htmlFor="vipUpsell" className="text-sm text-zinc-200 cursor-pointer">
                  <span className="font-bold text-amber-500 block">የ VIP ቅናሽ አሁን ያግኙ! (+ {userRegion === 'ዳያስፖራ' ? '$10 USD' : '100 ብር'})</span>
                  ይህንን በመጫን የVIP አባልነት ይግዙና እቃውን በVIP ዋጋ ይውሰዱ።
                </label>
              </div>
            )}

            <input required value={orderName} onChange={(e) => setOrderName(e.target.value)} placeholder="ሙሉ ስም" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none text-base" />
            <input required type="tel" maxLength="10" pattern="[0-9]{10}" value={vipPhone} onChange={e => { const val = e.target.value.replace(/\D/g, ""); if (val.length <= 10) setVipPhone(val); }} placeholder="ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none text-base font-mono" />
            <textarea required value={orderAddress} onChange={(e) => setOrderAddress(e.target.value)} rows="2" placeholder="የማድረሻ አድራሻ (ከተማ፣ ሰፈር፣ ልዩ ቦታ)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none text-base"></textarea>

            <label className="flex items-center space-x-3 text-zinc-300 mt-4 bg-black p-4 rounded-xl border border-zinc-800 cursor-pointer">
              <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} className="w-5 h-5 accent-amber-500 cursor-pointer" />
              <span className="font-bold text-sm">ይህ ዕቃ ስጦታ ነው? (Is this a gift?)</span>
            </label>

            {isGift && (
              <div className="p-4 bg-zinc-900 border border-amber-500/30 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-amber-500 font-bold text-xs uppercase tracking-wider mb-2">የተቀባዩ መረጃ (Recipient Info)</h4>
                <input required value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="የተቀባዩ ሙሉ ስም" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm" />
                <input required type="tel" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} placeholder="የተቀባዩ ስልክ ቁጥር" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm font-mono" />
                <textarea required value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} rows="2" placeholder="የተቀባዩ ሙሉ አድራሻ (ከተማ, ሰፈር)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm"></textarea>
              </div>
            )}

            <select required value={checkoutShipping} onChange={(e) => setCheckoutShipping(e.target.value)} className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none text-base font-bold mt-4">
              <option value="standard">ከ3-5 የስራ ቀናት (መደበኛ ማጓጓዣ)</option>
              <option value="next_day">በሚቀጥለው ቀን (+$10 CAD አስቸኳይ)</option>
            </select>

            <div className="bg-black p-4 rounded-xl border border-zinc-800 text-sm mt-6 mb-6">
               <h4 className="text-amber-500 font-black mb-3 border-b border-zinc-800 pb-2">የክፍያ ዝርዝር (Payment Summary)</h4>
               <div className="flex justify-between mb-1"><span className="text-zinc-400">የእቃው ዋጋ:</span> <span className="text-white font-bold">{basePrice} ብር</span></div>
               {checkoutShipping === "next_day" && <div className="flex justify-between mb-1"><span className="text-zinc-400">አስቸኳይ ማጓጓዣ:</span> <span className="text-white font-bold">+ 850 ብር ($10)</span></div>}
               {includeVipSignup && <div className="flex justify-between mb-1"><span className="text-amber-500">VIP አባልነት:</span> <span className="text-amber-500 font-bold">+ {userRegion === 'ዳያስፖራ' ? '850 ብር ($10)' : '100 ብር'}</span></div>}
               
               <div className="flex justify-between mt-3 pt-2 border-t border-zinc-800">
                 <span className="text-white font-black">ጠቅላላ ክፍያ:</span>
                 <span className="text-amber-500 font-black text-lg">{dynamicTotal} ብር</span>
               </div>

               <div className="mt-4 bg-zinc-900 p-3 rounded-lg border border-amber-500/20">
                 {userRegion === "ሀገር ውስጥ" ? (
                   <>
                     <p className="font-bold text-amber-500 mb-1">🏦 የባንክ ማስተላለፊያ</p>
                     <p className="text-zinc-300 text-xs mb-1">የኢትዮጵያ ንግድ ባንክ (CBE)</p>
                     <p className="text-zinc-300">አካውንት: <span className="text-white font-mono text-lg font-black ml-1">1000123456789</span></p>
                   </>
                 ) : (
                   <>
                     <p className="font-bold text-amber-500 mb-1">💳 PayPal (Diaspora)</p>
                     <p className="text-zinc-300">Email: <span className="text-white font-mono text-lg font-black ml-1">demo@goleth.com</span></p>
                     <p className="text-[10px] text-zinc-500 mt-1">Please convert the Birr total to USD/CAD before sending.</p>
                   </>
                 )}
               </div>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <label className="block text-zinc-400 text-xs font-bold mb-2">⚠️ ክፍያ ከፈጸሙ በኋላ ደረሰኙን እዚህ ያያይዙ፦</label>
              <input required type="file" onChange={(e) => setOrderFile(e.target.files[0])} accept="image/*" className="w-full text-sm text-zinc-300 file:mr-3 file:py-3 file:px-4 file:rounded-xl file:bg-zinc-800 file:text-white file:font-bold file:border-0 file:cursor-pointer hover:file:bg-zinc-700 bg-black border border-zinc-800 rounded-xl p-2" />
            </div>
            
            <button type="submit" disabled={uploading || vipPhone.length !== 10 || !orderFile} className="w-full bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black py-4 rounded-xl text-lg shadow-lg transition-colors mt-6">
              {uploading ? "በመላክ ላይ..." : "ይዘዙ"}
            </button>
          </form>
        )}
      </div>
    ) : null;

    return (
      <div className="fixed inset-0 z-[60] bg-black overflow-y-auto pb-24 animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 z-10 flex justify-between items-center p-4">
          <button onClick={() => window.history.back()} className="bg-black/50 backdrop-blur p-2 rounded-full border border-zinc-800 text-white"><ChevronLeft size={24} /></button>
          {isCEO && (
             <div className="flex space-x-2">
               <button onClick={() => handleEdit("products", selectedProduct)} className="bg-black/50 backdrop-blur p-2 rounded-full border border-zinc-800 text-white"><Edit2 size={18} /></button>
               <button onClick={() => handleDelete("products", selectedProduct.id)} className="bg-black/50 backdrop-blur p-2 rounded-full border border-zinc-800 text-red-500"><Trash2 size={18} /></button>
             </div>
          )}
        </div>

        {hasImages ? (
          <div className="relative w-full h-[40vh] bg-white flex items-center justify-center -mt-16 pt-16">
            <img src={selectedProduct.image_urls[currentImgIndex]} alt={selectedProduct.name} className="max-h-full object-contain p-8 mix-blend-multiply" />
            
            {selectedProduct.image_urls.length > 1 && (
              <>
                <button onClick={() => setCurrentImgIndex(prev => prev > 0 ? prev - 1 : selectedProduct.image_urls.length - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/5 rounded-full hover:bg-black/10 transition-colors"><ChevronLeft size={24} className="text-black" /></button>
                <button onClick={() => setCurrentImgIndex(prev => prev < selectedProduct.image_urls.length - 1 ? prev + 1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/5 rounded-full hover:bg-black/10 transition-colors"><ChevronRight size={24} className="text-black" /></button>
                <div className="absolute bottom-4 flex space-x-2">
                  {selectedProduct.image_urls.map((_, idx) => (
                    <div key={idx} onClick={() => setCurrentImgIndex(idx)} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'bg-black w-4' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-[30vh] bg-zinc-900 flex items-center justify-center -mt-16 pt-16">
             <span className="text-zinc-600 font-bold">ምስል የለም</span>
          </div>
        )}

        <div className="p-6">
          {selectedProduct.category && <div className="inline-block bg-zinc-800 text-white text-[10px] font-black px-2 py-1 rounded-md tracking-widest mb-4 uppercase">{selectedProduct.category}</div>}
          
          <h1 className="text-2xl font-black text-white mb-1 leading-tight">{selectedProduct.name}</h1>
          {selectedProduct.brand && <h2 className="text-zinc-200 text-sm font-black uppercase tracking-widest mb-6">{selectedProduct.brand}</h2>}

          {isVIP ? (
            <div className="flex items-baseline space-x-4 mb-8 bg-zinc-900 p-4 rounded-2xl border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <div>
                 <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 flex items-center">👑 የእርስዎ VIP ዋጋ</p>
                 <p className="text-amber-500 font-black text-3xl leading-none">{selectedProduct.vip_price || selectedProduct.price} <span className="text-sm">ብር</span></p>
              </div>
              {selectedProduct.vip_price && (
                <div className="pl-4 border-l border-zinc-800 opacity-80">
                  <p className="text-zinc-400 text-[10px] font-bold uppercase mb-1">መደበኛ</p>
                  <p className="text-white font-black text-lg line-through decoration-red-500 decoration-2">{selectedProduct.price} ብር</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-baseline space-x-4 mb-8 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <div>
                 <p className="text-zinc-400 text-[10px] font-bold uppercase mb-1">መደበኛ ዋጋ</p>
                 <p className="text-white font-black text-3xl leading-none">{selectedProduct.price} <span className="text-sm">ብር</span></p>
              </div>
              {selectedProduct.vip_price && (
                <div className="pl-4 border-l border-zinc-800">
                  <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 flex items-center">👑 VIP ዋጋ</p>
                  <p className="text-amber-500 font-black text-2xl leading-none">{selectedProduct.vip_price} <span className="text-sm">ብር</span></p>
                </div>
              )}
            </div>
          )}

          {!showInlineCheckout && selectedProduct.options && selectedProduct.options.length > 0 && (
            <div className="mb-8 border-t border-zinc-900 pt-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-white font-bold text-sm tracking-wide">አማራጭ ይምረጡ (ወደ ክፍያ ለመሄድ)</h3>
                 <span className="text-zinc-300 text-xs font-bold">{selectedProduct.options.length} አማራጮች</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {selectedProduct.options.map(opt => (
                  <button 
                    key={opt} 
                    onClick={() => { setSelectedOption(opt); setShowInlineCheckout(true); }} 
                    className={`py-3 px-1 text-xs font-bold text-center border rounded-lg transition-all ${selectedOption === opt ? 'border-amber-500 text-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-zinc-700 text-white bg-zinc-900 hover:border-zinc-500'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showInlineCheckout && (!selectedProduct.options || selectedProduct.options.length === 0) && (
             <button onClick={() => setShowInlineCheckout(true)} className="w-full bg-amber-500 text-black font-black py-4 rounded-xl text-lg flex justify-center items-center mt-6 shadow-lg">
                አሁን ይግዙ (Buy Now)
             </button>
          )}

          {inlineCheckoutUI}
        </div>
      </div>
    );
  };

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

        <div className="grid grid-cols-2 gap-4 mt-2">
          {filtered.map((item) => (
            <div key={item.id} onClick={() => openProduct(item)} className="cursor-pointer group flex flex-col h-full">
              <div className="bg-white rounded-2xl p-4 mb-3 h-48 flex items-center justify-center relative shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                 {isCEO && (
                    <div className="absolute top-2 right-2 flex space-x-1 z-10">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit("products", item); }} className="bg-black/50 backdrop-blur p-1.5 rounded-md text-white"><Edit2 size={14}/></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete("products", item.id); }} className="bg-black/50 backdrop-blur p-1.5 rounded-md text-red-400"><Trash2 size={14}/></button>
                    </div>
                 )}
                 {item.image_urls && item.image_urls.length > 0 ? (
                    <img src={item.image_urls[0]} alt={item.name} className="max-h-full object-contain mix-blend-multiply" />
                 ) : <div className="text-zinc-300 text-xs font-bold">ምስል የለም</div>}
              </div>
              
              <div className="px-1 flex flex-col flex-grow">
                 {isVIP ? (
                   <div className="flex items-baseline space-x-2 mb-1.5">
                     <p className="text-amber-500 font-black text-xl leading-none">{item.vip_price || item.price} ብር</p>
                     {item.vip_price && <p className="text-zinc-400 font-bold text-xs leading-none line-through decoration-red-500">{item.price} ብር</p>}
                   </div>
                 ) : (
                   <div className="flex items-baseline space-x-2 mb-1.5">
                     <p className="text-white font-black text-xl leading-none">{item.price} ብር</p>
                     {item.vip_price && <p className="text-amber-500 font-bold text-sm leading-none">VIP: {item.vip_price}</p>}
                   </div>
                 )}
                 
                 <p className="text-white font-black text-[13px] tracking-widest uppercase mb-1 line-clamp-1">{item.brand}</p>
                 <h3 className="text-zinc-200 font-bold text-sm line-clamp-2 leading-snug">{item.name}</h3>
                 
                 <div className="mt-auto pt-2">
                   {item.options && item.options.length > 0 && (
                      <p className="text-zinc-400 font-bold text-xs">{item.options.length} አማራጮች</p>
                   )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBlurGames = () => (
    <div className="opacity-30 blur-[3px] pointer-events-none select-none max-w-sm mx-auto mt-6">
      <h2 className="text-lg font-black text-center mb-4">የሳምንቱ የቪአይፒ ጨዋታዎች</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center text-xs">ቡድን አንድ</div>
          <div className="text-amber-500 font-bold">VS</div>
          <div className="text-center text-xs">ቡድን ሁለት</div>
        </div>
        <div className="flex justify-center space-x-2">
          <div className="w-12 h-10 bg-black rounded"></div>
          <div className="w-12 h-10 bg-black rounded"></div>
        </div>
      </div>
    </div>
  );

  const renderVIP = () => {
    // The benefits block stays visible regardless of auth state
    const renderVipBenefits = () => (
      <div className="text-left space-y-3 mb-8 bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-xl">
        <h3 className="text-amber-500 font-black mb-3">የVIP አባልነት ጥቅሞች</h3>
        <div className="flex items-center space-x-3"><CheckCircle className="text-amber-500 w-5 h-5 shrink-0" /><span className="text-sm text-zinc-300">የስፖርት ትንበያዎችን ያግኙ</span></div>
        <div className="flex items-center space-x-3"><CheckCircle className="text-amber-500 w-5 h-5 shrink-0" /><span className="text-sm text-zinc-300">በእቃዎች ላይ ከፍተኛ የVIP ቅናሽ</span></div>
        <div className="flex items-center space-x-3"><CheckCircle className="text-amber-500 w-5 h-5 shrink-0" /><span className="text-sm text-zinc-300">ልዩ የእቃ ማዘዣ ቅድሚያ እና ነፃ ማጓጓዣ</span></div>
      </div>
    );

    if (!currentUser) {
      return (
        <div className="pb-24 pt-6">
          <div className="text-center max-w-sm mx-auto mb-8">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 mx-auto"><Target className="text-amber-500 w-8 h-8" /></div>
            <h2 className="text-2xl font-black text-white mb-6">ወደ VIP አባልነት</h2>
            
            {renderVipBenefits()}

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
              <p className="text-white text-sm font-bold mb-4">አባል ለመሆን ወይም ለመግባት (Login)፦</p>
              <div ref={telegramWrapperRef} className="flex justify-center min-h-[50px]"></div>
            </div>
          </div>
          {renderBlurGames()}
        </div>
      );
    }

    if (hasPendingVip) {
      return (
        <div className="pb-24 pt-6 text-center">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-8 mb-8 max-w-md mx-auto">
            <div className="text-amber-500 mb-4 animate-pulse text-4xl">⏳</div>
            <h2 className="text-xl font-black text-white mb-2">ማረጋገጫ በሂደት ላይ ነው</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">የላኩት ክፍያ በCEO በመታየት ላይ ነው። ሲፈቀድ መረጃ ይደርስዎታል።</p>
          </div>
        </div>
      );
    }

    if (!isVIP || vipStatus === "expired" || vipStatus === "none") {
      return (
        <div className="pb-24 pt-6">
          <div className="max-w-md mx-auto mb-8">
            {renderVipBenefits()}

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-amber-500 mb-2 text-center">
                {vipStatus === "expired" ? "አባልነትዎ አልቋል (Expired)" : "ወርሃዊ የVIP አባልነት"}
              </h2>
              <p className="text-center text-zinc-400 text-xs mb-6">የVIP ጥቅሞችን ለማግኘት ከታች ያለውን ፎርም ይሙሉና ይክፈሉ።</p>

              <form onSubmit={handleVipPaymentSubmit} className="space-y-4 animate-in fade-in duration-200">
                <div className="flex space-x-2 mb-2">
                  <button type="button" onClick={() => setVipPaymentType("ሀገር ውስጥ")} className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${vipPaymentType === "ሀገር ውስጥ" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-800"}`}>ሀገር ውስጥ</button>
                  <button type="button" onClick={() => setVipPaymentType("ዳያስፖራ")} className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${vipPaymentType === "ዳያስፖራ" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-800"}`}>ዳያስፖራ</button>
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 text-sm text-white space-y-2 mb-6">
                  {vipPaymentType === "ሀገር ውስጥ" ? (
                    <>
                      <div className="flex justify-between mb-3 pb-3 border-b border-zinc-800"><span className="text-zinc-400">ወርሃዊ ክፍያ:</span><span className="text-amber-500 font-black">100 ብር</span></div>
                      <p className="font-bold text-amber-500 text-base">📌 የባንክ ማስተላለፊያ መመሪያ፦</p>
                      <p>የኢትዮጵያ ንግድ ባንክ (CBE) - <span className="text-amber-500 font-mono font-black text-lg">1000123456789</span></p>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between mb-3 pb-3 border-b border-zinc-800"><span className="text-zinc-400">ወርሃዊ ክፍያ:</span><span className="text-amber-500 font-black">$10 USD</span></div>
                      <p className="font-bold text-amber-500 text-base">📌 የPayPal ማስተላለፊያ መመሪያ፦</p>
                      <p>PayPal ኢሜይል: <span className="text-amber-500 font-mono font-black text-lg">demo@goleth.com</span></p>
                    </>
                  )}
                  <p className="text-xs text-zinc-400 pt-2 mt-2">መጀመሪያ ክፍያዎን ያስተላልፉ። በመቀጠል ደረሰኙን ፎቶ አንስተው ከታች ያያይዙ።</p>
                </div>

                <input required name="fullName" value={orderName} onChange={e => setOrderName(e.target.value)} placeholder="ሙሉ ስም" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none text-base" />
                <input required type="tel" placeholder="ስልክ ቁጥር (10 አሃዝ)" maxLength="10" pattern="[0-9]{10}" value={vipPhone} onChange={e => setVipPhone(e.target.value)} className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none text-base font-mono" />
                
                <div>
                  <label className="block text-zinc-400 text-sm font-bold mb-2">የክፍያ ማረጋገጫ ፋይል ያያይዙ፦</label>
                  <input required type="file" name="receiptFile" onChange={(e) => setVipReceiptFile(e.target.files[0])} accept="image/*" className="w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:bg-zinc-800 file:text-white file:border-0 file:cursor-pointer" />
                </div>
                
                <button type="submit" disabled={uploading || vipPhone.length !== 10 || !vipReceiptFile} className="w-full bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black py-4 rounded-xl text-lg shadow-lg transition-colors mt-2">
                  {uploading ? "በመላክ ላይ..." : "ላክ"}
                </button>
              </form>
            </div>
          </div>
          {renderBlurGames()}
        </div>
      );
    }

    return (
      <div className="pb-24">
        {vipStatus === "expiring_soon" && (
          <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-xl mb-6 text-center text-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            ⚠️ <span className="font-bold">ማሳሰቢያ:</span> የVIP አባልነትዎ ሊያልቅ 2 ቀናት ቀርተውታል። አገልግሎቱ እንዳይቋረጥ እባክዎ ያድሱ።
          </div>
        )}
        <h2 className="text-2xl font-black text-white mb-6 text-center">የVIP ትንበያ</h2>
        {games.map(game => {
          const userPred = userPredictions[game.id];
          return (
            <div key={game.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col items-center w-1/3">
                  {game.team_a_logo && <img src={game.team_a_logo} alt={game.team_a} className="w-14 h-14 mb-2 object-contain drop-shadow-md"/>}
                  <span className="font-bold text-center text-xs text-zinc-300">{game.team_a}</span>
                </div>
                <div className="text-2xl font-black text-amber-500 w-1/3 text-center">VS</div>
                <div className="flex flex-col items-center w-1/3">
                  {game.team_b_logo && <img src={game.team_b_logo} alt={game.team_b} className="w-14 h-14 mb-2 object-contain drop-shadow-md"/>}
                  <span className="font-bold text-center text-xs text-zinc-300">{game.team_b}</span>
                </div>
              </div>

              {game.status === 'open' && !userPred && (
                <div className="flex flex-col items-center space-y-4 border-t border-zinc-800 pt-4">
                  <div className="flex justify-center items-center space-x-3">
                    <input type="number" value={predictionInputs[game.id]?.a || ""} onChange={e => setPredictionInputs(prev => ({...prev, [game.id]: {...prev[game.id], a: e.target.value}}))} className="w-16 p-3 rounded-lg bg-black border border-zinc-700 text-white text-center font-black focus:border-amber-500 outline-none" placeholder="0" />
                    <span className="font-black text-zinc-500">-</span>
                    <input type="number" value={predictionInputs[game.id]?.b || ""} onChange={e => setPredictionInputs(prev => ({...prev, [game.id]: {...prev[game.id], b: e.target.value}}))} className="w-16 p-3 rounded-lg bg-black border border-zinc-700 text-white text-center font-black focus:border-amber-500 outline-none" placeholder="0" />
                  </div>
                  <button onClick={() => submitPrediction(game.id)} className="w-full bg-amber-500 text-black py-3 rounded-xl font-black shadow-lg hover:bg-amber-400 transition-colors">
                    ውጤት ላክ
                  </button>
                </div>
              )}

              {game.status === 'open' && userPred && (
                <div className="mt-4 text-center bg-black border border-amber-500/50 text-amber-500 text-sm font-bold p-3 rounded-xl">
                  🔒 ግምትዎ ተቆልፏል: {userPred.predicted_score_a} - {userPred.predicted_score_b}
                </div>
              )}

              {game.status === 'finished' && userPred && (
                <div className="mt-4 text-center border-t border-zinc-800 pt-4">
                  <div className="text-sm font-bold text-zinc-400 mb-2">
                    ትክክለኛ ውጤት: <span className="text-white">{game.final_score_a} - {game.final_score_b}</span>
                  </div>
                  <div className={`p-3 rounded-xl text-sm font-black text-white ${userPred.predicted_score_a === game.final_score_a && userPred.predicted_score_b === game.final_score_b ? 'bg-green-600/80 border border-green-500' : 'bg-red-900/50 border border-red-800 text-red-200'}`}>
                    {userPred.predicted_score_a === game.final_score_a && userPred.predicted_score_b === game.final_score_b 
                      ? "🎉 አሸናፊ!" 
                      : `የእርስዎ ግምት: ${userPred.predicted_score_a} - ${userPred.predicted_score_b} ❌`}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderAdmin = () => { /* Admin logic unchanged, truncated to fit length */ return null; };

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
          <a href="https://t.me/contact_goleth" target="_blank" rel="noreferrer" className="text-zinc-400 font-bold text-sm hover:text-amber-500 px-3 border-r border-zinc-800 transition-colors">
            ያግኙን
          </a>
          {isCEO && (
            <button onClick={() => { openNewPost("posts"); setShowAdmin(true); }} className="bg-amber-500 text-black px-3 py-1.5 rounded-full font-bold text-xs shadow-lg shadow-amber-500/20">
              CEO
            </button>
          )}
          
          <button onClick={() => { setActiveTab("ቪአይፒ"); if(activePost) window.history.back(); window.scrollTo(0,0); }} className="bg-[#2AABEE] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-[#229ED9] transition-colors">
            {currentUser ? currentUserProfile?.full_name || "VIP" : "ይግቡ"}
          </button>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {activePost && !selectedProduct && renderSinglePost()}
        
        {!activePost && !selectedProduct && (
          <>
            {["ዋና", "ስፖርት", "ሹክሹክታ", "ማህበራዊ"].includes(activeTab) && renderPostFeed()}
            {activeTab === "ቪአይፒ" && renderVIP()}
            {activeTab === "ሱቅ" && renderShop()}
          </>
        )}
      </main>

      {renderProductDetail()}

      {showProfileModal && renderProfileModal()}
      {showSuccessModal && renderSuccessModal()}
      {showOrderForm && renderOrderForm()}
      {showAdmin && renderAdmin()}

      <nav className="fixed bottom-0 w-full bg-black/95 backdrop-blur-md border-t border-zinc-900 flex justify-around pb-6 pt-3 px-1 z-40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActivePost(null); setSelectedProduct(null); window.scrollTo(0,0); }}
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
