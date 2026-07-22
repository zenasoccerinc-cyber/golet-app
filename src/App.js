import React, { useState, useEffect, useRef } from "react";
import {
  Home, Trophy, Flame, Users, Target, ShoppingBag, X, Trash2, Edit2, ChevronLeft, PlusCircle, Send, CheckCircle, LogOut, ArrowUp, ArrowDown, Edit3, User, Package
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Secure Supabase Connection
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Secure Telegram Configuration
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN; 
const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID; 

export default function App() {
  const [activeTab, setActiveTab] = useState("ዋና");
  const [activePost, setActivePost] = useState(null);
  
  const [shopCategory, setShopCategory] = useState("ሁሉም");
  const [shopSubCategory, setShopSubCategory] = useState("ሁሉም");

  // Shopping States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showInlineCheckout, setShowInlineCheckout] = useState(false);
  const [includeVipSignup, setIncludeVipSignup] = useState(false);
  
  // Checkout & Sourcing Form States
  const [userRegion, setUserRegion] = useState("ሀገር ውስጥ");
  const [checkoutShipping, setCheckoutShipping] = useState("standard");
  const [orderName, setOrderName] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderFile, setOrderFile] = useState(null);
  
  // Custom Sourcing Specific States
  const [reqProductName, setReqProductName] = useState("");
  const [reqStoreName, setReqStoreName] = useState("");
  const [reqProductLink, setReqProductLink] = useState("");
  const [reqImage, setReqImage] = useState(null);

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  
  const [adminTab, setAdminTab] = useState("posts");
  const [uploading, setUploading] = useState(false);
  
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ options: [], relatedLinks: [], isSale: false });
  const [existingMainImage, setExistingMainImage] = useState(null);
  const [existingInlineImages, setExistingInlineImages] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [inlineImageFiles, setInlineImageFiles] = useState([]);
  const [productImageFiles, setProductImageFiles] = useState([]);
  const [selectedMainImgIdx, setSelectedMainImgIdx] = useState(0);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [expandedOptionCategories, setExpandedOptionCategories] = useState({});

  // Dynamic CEO Configurations
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [newCatInput, setNewCatInput] = useState("");
  const [newSubCatInput, setNewSubCatInput] = useState("");
  const [selectedPrimaryForSub, setSelectedPrimaryForSub] = useState("");
  
  // Inline edit states for categories
  const [editCatIndex, setEditCatIndex] = useState(null);
  const [editCatValue, setEditCatValue] = useState("");
  const [editSubCatIndex, setEditSubCatIndex] = useState(null);
  const [editSubCatValue, setEditSubCatValue] = useState("");
  
  const [savedCustomSizes, setSavedCustomSizes] = useState(() => JSON.parse(localStorage.getItem('goleth_custom_sizes') || '[]'));
  const [customCategories, setCustomCategories] = useState(() => JSON.parse(localStorage.getItem('goleth_categories') || '["ወንድ", "ሴት", "ልጅ", "መድሀኒት", "ጤና እና ውበት"]'));
  const [customSubCats, setCustomSubCats] = useState(() => JSON.parse(localStorage.getItem('goleth_subcats_map') || '{"ወንድ":["ልብስ","ጫማ"],"ሴት":["ልብስ","ጫማ"]}'));

  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  // Admin Order Edit States
  const [orderUpdateData, setOrderUpdateData] = useState({});

  // --- VIP & GAMES STATE ---
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [vipStatus, setVipStatus] = useState("none");
  const [hasPendingVip, setHasPendingVip] = useState(false);
  const [games, setGames] = useState([]);
  const [userPredictions, setUserPredictions] = useState({});
  const [predictionInputs, setPredictionInputs] = useState({});
  
  // Games files
  const [newGame, setNewGame] = useState({ team_a: '', team_b: '' });
  const [teamAFile, setTeamAFile] = useState(null);
  const [teamBFile, setTeamBFile] = useState(null);
  const [scoresToUpdate, setScoresToUpdate] = useState({});
  
  const [vipPaymentType, setVipPaymentType] = useState("ሀገር ውስጥ"); 
  const [vipPhone, setVipPhone] = useState("");
  const [vipReceiptFile, setVipReceiptFile] = useState(null);
  
  const telegramWrapperRef = useRef(null); 
  const telegramCheckoutRef = useRef(null);
  const telegramSourcingRef = useRef(null);
  const telegramHeaderLoginRef = useRef(null);

  const authorList = ["GOLETH", "አማኑኤል", "Writer Name"];
  
  const categorizedOptions = {
    "የጫማ መጠን (Shoe Sizes)": ["15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47"],
    "የልብስ መጠን (Clothing Sizes)": ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "0-3m", "3-6m", "6-12m", "1-2Y", "2-4Y", "4-6Y", "6-8Y", "8-10Y", "10-12Y", "12-14Y"],
    "ቀለም (Colors)": ["Black (ጥቁር)", "White (ነጭ)", "Red (ቀይ)", "Blue (ሰማያዊ)", "Green (አረንጓዴ)", "Yellow (ቢጫ)", "Brown (ቡናማ)", "Grey (ግራጫ)", "Pink (ሮዝ)", "Purple (ሐምራዊ)", "Orange (ብርቱካናማ)", "Gold (ወርቃማ)", "Silver (ብር)", "Multi (የተለያየ)"],
    "መጠን/ክብደት (Measurements)": ["50g", "100g", "200g", "250g", "500g", "1kg", "2kg", "5kg", "100ml", "250ml", "500ml", "1L", "2L", "5L", "10L"],
    "የእርስዎ (Custom)": savedCustomSizes
  };

  useEffect(() => {
    fetchData();
    fetchGames(); 
    fetchGlobalCategories();
    
    if (!selectedPrimaryForSub && customCategories.length > 0) setSelectedPrimaryForSub(customCategories[0]);

    const savedUserStr = localStorage.getItem('goleth_user');
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser && savedUser.id) {
          setCurrentUser(savedUser);
          handleTelegramLogin(savedUser); 
        }
      } catch (e) { console.error("Error parsing saved user", e); }
    }

    const handlePopState = () => { setActivePost(null); setSelectedProduct(null); setShowInlineCheckout(false); setShowAccountMenu(false); };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const fetchGlobalCategories = async () => {
    try {
      const { data } = await supabase.from('app_settings').select('*').eq('id', 1).single();
      if (data) {
        if (data.primary_categories) { setCustomCategories(data.primary_categories); localStorage.setItem('goleth_categories', JSON.stringify(data.primary_categories)); }
        if (data.subcategories_map) { setCustomSubCats(data.subcategories_map); localStorage.setItem('goleth_subcats_map', JSON.stringify(data.subcategories_map)); }
      }
    } catch (err) { console.log("Settings table not found yet. Using local storage fallback."); }
  };

  const syncCategoriesToDB = async (primaries, subcats) => {
    try { await supabase.from('app_settings').upsert({ id: 1, primary_categories: primaries, subcategories_map: subcats }); } catch (e) { console.error("Failed to sync to DB."); }
  };

  const injectTelegramScript = (refElement, callback = () => {}) => {
    if (refElement && refElement.innerHTML === '') {
      window.onTelegramAuth = (user) => { handleTelegramLogin(user); callback(); };
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", "goleth_app_bot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.async = true;
      refElement.appendChild(script);
    }
  };

  useEffect(() => { if (activeTab === "ቪአይፒ" && !currentUser) injectTelegramScript(telegramWrapperRef.current); }, [activeTab, currentUser]);
  useEffect(() => { if (showInlineCheckout && !currentUser) injectTelegramScript(telegramCheckoutRef.current); }, [showInlineCheckout, currentUser]);
  useEffect(() => { if (showOrderForm && !currentUser) injectTelegramScript(telegramSourcingRef.current); }, [showOrderForm, currentUser]);
  useEffect(() => { if (showLoginModal && !currentUser) injectTelegramScript(telegramHeaderLoginRef.current, () => setShowLoginModal(false)); }, [showLoginModal, currentUser]);

  useEffect(() => {
    if (currentUserProfile) {
      setOrderName(currentUserProfile.full_name || "");
      setVipPhone(currentUserProfile.phone_number || "");
      if (currentUserProfile.region) {
        setUserRegion(currentUserProfile.region === 'Diaspora' ? 'ዳያስፖራ' : 'ሀገር ውስጥ');
        setVipPaymentType(currentUserProfile.region === 'Diaspora' ? 'ዳያስፖራ' : 'ሀገር ውስጥ');
      }
      fetchUserOrders(currentUserProfile.telegram_id);
    }
  }, [currentUserProfile]);

  const fetchData = async () => {
    try {
      const { data: postsData } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      const { data: productsData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setPosts(postsData || []); setProducts(productsData || []);
    } catch (error) { console.error("Fetch error:", error); }
  };

  const fetchGames = async () => {
    const { data } = await supabase.from('games').select('*').order('created_at', { ascending: false });
    if (data) setGames(data);
  };

  const fetchUserOrders = async (telegramId) => {
    if (!telegramId) return;
    try {
      const { data } = await supabase.from('product_orders').select('*').eq('telegram_id', telegramId).order('created_at', { ascending: false });
      if (data) setUserOrders(data);
    } catch (e) { console.error("Error fetching user orders"); }
  };

  const fetchAllOrders = async () => {
    try {
      const { data } = await supabase.from('product_orders').select('*').order('created_at', { ascending: false });
      if (data) setAllOrders(data);
    } catch (e) { console.error("Error fetching all orders"); }
  };

  const fetchUserPredictions = async (telegramId) => {
    if (!telegramId) return;
    const { data } = await supabase.from('predictions').select('*').eq('telegram_id', telegramId.toString());
    if (data) {
      const predictionsMap = {}; data.forEach(p => { predictionsMap[p.game_id] = p; });
      setUserPredictions(predictionsMap);
    }
  };

  const checkPendingVip = async (telegramId) => {
    if (!telegramId) return;
    const { data } = await supabase.from('vip_payments').select('status').eq('telegram_id', telegramId.toString()).eq('status', 'pending');
    if (data && data.length > 0) setHasPendingVip(true);
  };

  const handleTelegramLogin = async (telegramUser) => {
    if (!telegramUser || !telegramUser.id) return;
    setCurrentUser(telegramUser);
    localStorage.setItem('goleth_user', JSON.stringify(telegramUser));
    const { data } = await supabase.from('vip_users').upsert([ { telegram_id: telegramUser.id.toString(), username: telegramUser.username || telegramUser.first_name || 'User' } ], { onConflict: 'telegram_id' }).select('*');

    if (data && data[0]) {
      const userRecord = data[0];
      setCurrentUserProfile(userRecord);
      localStorage.setItem('goleth_profile', JSON.stringify(userRecord));
      setIsCEO(Boolean(userRecord.is_admin));

      if (!userRecord.full_name || !userRecord.phone_number) setShowProfileModal(true);

      let currentStatus = "none";
      let activeVip = Boolean(userRecord.is_vip);

      if (userRecord.vip_until) {
        const now = new Date(); const expireDate = new Date(userRecord.vip_until);
        if (!isNaN(expireDate.getTime())) {
          const gracePeriodDate = new Date(expireDate.getTime() + (2 * 24 * 60 * 60 * 1000)); 
          if (now > gracePeriodDate) { currentStatus = "expired"; activeVip = false; } 
          else if (now > expireDate) { currentStatus = "expiring_soon"; } 
          else { currentStatus = "active"; }
        } else { currentStatus = activeVip ? "active" : "none"; }
      } else if (activeVip) { currentStatus = "active"; }

      setIsVIP(activeVip); setVipStatus(currentStatus);
      fetchUserPredictions(telegramUser.id); checkPendingVip(telegramUser.id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('goleth_user'); localStorage.removeItem('goleth_profile');
    setCurrentUser(null); setCurrentUserProfile(null); setIsVIP(false); setVipStatus("none"); setUserPredictions({}); setHasPendingVip(false); setIsCEO(false); setShowAdmin(false); setShowAccountMenu(false); setUserOrders([]);
  };

  const saveUserProfile = async (e) => {
    e.preventDefault(); if (!currentUser?.id) return; setUploading(true);
    const name = e.target.fullName.value; const phone = e.target.phone.value; const loc = e.target.location.value;
    const region = ["USA", "Canada", "Europe", "Australia", "South America"].includes(loc) ? 'Diaspora' : 'Local';

    try {
      const { data, error } = await supabase.from('vip_users').update({ full_name: name, phone_number: phone, region: region }).eq('telegram_id', currentUser.id.toString()).select('*');
      if (error) throw error;
      if (data && data[0]) { setCurrentUserProfile(data[0]); localStorage.setItem('goleth_profile', JSON.stringify(data[0])); setShowProfileModal(false); }
    } catch (err) { alert("መረጃውን ማስቀመጥ አልተቻለም። እንደገና ይሞክሩ።"); } 
    finally { setUploading(false); }
  };

  const uploadFileToSupabase = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file);
    if (!uploadError) { const { data } = supabase.storage.from("images").getPublicUrl(fileName); return data.publicUrl; }
    return null;
  };

  const handleVipPaymentSubmit = async (e) => {
    e.preventDefault(); if (!currentUser?.id) return; setUploading(true);
    if (vipPhone.length !== 10 || !vipReceiptFile) { alert("እባክዎ መረጃዎችን በትክክል ያስገቡ።"); setUploading(false); return; }

    const receiptUrl = await uploadFileToSupabase(vipReceiptFile);
    const { error: dbError } = await supabase.from("vip_payments").insert([{ telegram_id: currentUser.id.toString(), full_name: orderName, phone_number: vipPhone, payment_type: vipPaymentType, receipt_url: receiptUrl, status: 'pending' }]);

    if (dbError) { alert("የመረጃ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።"); setUploading(false); return; }
    const adminMsg = `👑 <b>አዲስ የVIP አባልነት ክፍያ ደርሷል!</b>\n\n👤 <b>ስም:</b> ${orderName}\n📞 <b>ስልክ:</b> ${vipPhone}\n💳 <b>የክፍያ አይነት:</b> ${vipPaymentType}\n🖼️ <b>የደረሰኝ ሊንክ:</b> ${receiptUrl}`;
    const userMsg = `🎉 <b>ክፍያዎ በተሳካ ሁኔታ ደርሶናል!</b>\n\nውድ ${orderName}፣ የላኩትን የክፍያ ማረጋገጫ ተቀብለናል። ክፍያው እንደተረጋገጠ በጥቂት ሰዓታት ውስጥ የVIP አባልነትዎ ይከፈታል።`;
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: adminMsg, parse_mode: "HTML" }) });
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: currentUser.id, text: userMsg, parse_mode: "HTML" }) });
    } catch (err) {}
    setUploading(false); setHasPendingVip(true); setActiveTab("ዋና"); window.scrollTo(0,0); setShowSuccessModal(true);
  };

  const handleProductOrderSubmit = async (e) => {
    e.preventDefault(); if (!currentUser?.id) return; setUploading(true);

    const isGettingVipPrice = isVIP || isCEO || includeVipSignup;
    const basePrice = selectedProduct.vip_price && isGettingVipPrice ? selectedProduct.vip_price : selectedProduct.price;
    let finalPrice = basePrice + (checkoutShipping === "next_day" ? 850 : 0) + (includeVipSignup ? (userRegion === "ሀገር ውስጥ" ? 100 : 850) : 0);

    let orderNotes = checkoutShipping === "next_day" ? "+ $10 CAD (Next Day Premium)" : "Standard Shipping";
    if (includeVipSignup) orderNotes += ` | +VIP Membership Signup (${userRegion})`;
    
    let finalDeliveryAddress = orderAddress;
    if (isGift) { orderNotes += ` | 🎁 GIFT ORDER`; finalDeliveryAddress = `[GIFT FOR: ${recipientName} | Ph: ${recipientPhone}] ${recipientAddress}`; }

    const receiptUrl = orderFile ? await uploadFileToSupabase(orderFile) : "";
    const { error: dbError } = await supabase.from("product_orders").insert([{ 
        telegram_id: currentUser.id.toString(), full_name: orderName, phone_number: vipPhone, delivery_address: finalDeliveryAddress,
        product_id: selectedProduct.id, product_name: selectedProduct.name, selected_option: selectedOption || "N/A", price: finalPrice,
        payment_type: userRegion, receipt_url: receiptUrl, shipping_speed: checkoutShipping, is_new_vip_signup: includeVipSignup, status: 'pending' 
      }]);

    if (dbError) { alert("የመረጃ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።"); setUploading(false); return; }

    const adminMsg = `🛍 <b>አዲስ የእቃ ትዕዛዝ!</b>\n\n👤 <b>ስም:</b> ${orderName}\n📞 <b>ስልክ:</b> ${vipPhone}\n📍 <b>አድራሻ:</b> ${finalDeliveryAddress}\n📦 <b>እቃ:</b> ${selectedProduct.name}\n📏 <b>አማራጭ:</b> ${selectedOption || "N/A"}\n🚚 <b>ማጓጓዣ:</b> ${checkoutShipping}\n💰 <b>ጠቅላላ ዋጋ:</b> ${finalPrice} ብር\n📝 <b>Notes:</b> ${orderNotes}\n💳 <b>ክፍያ ክልል:</b> ${userRegion}\n🖼️ <b>ደረሰኝ:</b> ${receiptUrl}`;
    const userMsg = `🎉 <b>ትዕዛዝዎ ደርሶናል!</b>\n\nውድ ${orderName}፣ ለ ${selectedProduct.name} የላኩትን የክፍያ ማረጋገጫ ተቀብለናል። ክፍያው እንደተረጋገጠ ሂደቱ በጥቂት ሰዓታት ውስጥ ይጀምራል።`;
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: adminMsg, parse_mode: "HTML" }) });
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: currentUser.id, text: userMsg, parse_mode: "HTML" }) });
    } catch (err) {}

    fetchUserOrders(currentUser.id.toString());
    setUploading(false); setShowInlineCheckout(false); setSelectedProduct(null); setSelectedOption(null); setIncludeVipSignup(false); setIsGift(false); setOrderFile(null); setActiveTab("ሱቅ"); window.scrollTo(0,0); setShowSuccessModal(true);
  };

  const handleOpenSourcing = () => { setReqProductName(""); setReqStoreName(""); setReqProductLink(""); setReqImage(null); setShowOrderForm(true); };

  const submitOrderForm = async (e) => {
    e.preventDefault(); if (!currentUser?.id) { alert("እባክዎ ትዕዛዝዎን ለመላክ መጀመሪያ በቴሌግራም ይግቡ።"); return; }
    setUploading(true);

    const imageUrl = reqImage ? await uploadFileToSupabase(reqImage) : "";
    const extraNotes = isGift ? `\n🎁 <b>GIFT TO:</b> ${recipientName} | Ph: ${recipientPhone} | Addr: ${recipientAddress}` : "";

    const { error: dbError } = await supabase.from("sourcing_requests").insert([{
      telegram_id: currentUser.id.toString(), full_name: orderName, phone_number: vipPhone, product_name: reqProductName || null, store_name: reqStoreName || null, product_link: reqProductLink || null, image_url: imageUrl || null, shipping_speed: e.target.shipping.value
    }]);

    if (dbError) { alert("የመረጃ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።"); setUploading(false); return; }
    const message = `🛍 <b>አዲስ ልዩ የእቃ ማዘዣ!</b>\n\n👤 <b>ስም:</b> ${orderName}\n📞 <b>ስልክ:</b> ${vipPhone}\n📦 <b>የእቃው ስም:</b> ${reqProductName || "አልተገለጸም"}\n🏪 <b>የሱቁ ስም:</b> ${reqStoreName || "አልተገለጸም"}\n🔗 <b>ሊንክ:</b> ${reqProductLink || "አልተገለጸም"}\n🚚 <b>አቅርቦት:</b> ${e.target.shipping.value}${extraNotes}\n🖼️ <b>ምስል:</b> ${imageUrl || "ምንም ምስል አልተያያዘም"}`;
    try { await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" }) }); } catch (err) {}
    setUploading(false); setIsGift(false); alert("ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል!"); setShowOrderForm(false); if(activePost) window.history.back(); setActiveTab("ሱቅ"); window.scrollTo(0,0);
  };

  const submitPrediction = async (gameId) => {
    if (!currentUser?.id) return;
    const scoreA = predictionInputs[gameId]?.a; const scoreB = predictionInputs[gameId]?.b;
    if (scoreA === undefined || scoreB === undefined || scoreA === "" || scoreB === "") { alert("እባክዎ ሁለቱንም ውጤቶች ያስገቡ።"); return; }
    const { error } = await supabase.from('predictions').insert([{ telegram_id: currentUser.id.toString(), game_id: gameId, predicted_score_a: parseInt(scoreA), predicted_score_b: parseInt(scoreB) }]);
    if (!error) { alert("ውጤቱ ተመዝግቧል!"); fetchUserPredictions(currentUser.id); } else { alert("ውጤቱን ቀድመው ገምተዋል።"); }
  };

  const createGame = async () => {
    setUploading(true);
    const a_url = teamAFile ? await uploadFileToSupabase(teamAFile) : '';
    const b_url = teamBFile ? await uploadFileToSupabase(teamBFile) : '';
    await supabase.from('games').insert([{...newGame, team_a_logo: a_url, team_b_logo: b_url}]);
    setNewGame({ team_a: '', team_b: '' }); setTeamAFile(null); setTeamBFile(null); setUploading(false); fetchGames(); alert("ጨዋታው ታትሟል!");
  };

  const updateFinalScore = async (gameId) => {
    const scores = scoresToUpdate[gameId];
    if (!scores || scores.a === undefined || scores.b === undefined) return;
    await supabase.from('games').update({ final_score_a: parseInt(scores.a), final_score_b: parseInt(scores.b), status: 'finished' }).eq('id', gameId);
    fetchGames(); alert("ጨዋታው ተጠናቆ ውጤቱ ተመዝግቧል!");
  };

  const handleUpdateAdminOrder = async (orderId, telegramId, productName) => {
    const update = orderUpdateData[orderId];
    if (!update) return;

    setUploading(true);
    const payload = {};
    if (update.status) payload.status = update.status;
    if (update.tracking) payload.tracking_number = update.tracking;

    const { error } = await supabase.from('product_orders').update(payload).eq('id', orderId);
    if (!error) {
      alert("Order updated successfully!");
      
      // Send Telegram notification if status or tracking changed
      let statusAmharic = "";
      if (update.status === 'approved') statusAmharic = "ተቀባይነት አግኝቷል (Approved) ✅";
      if (update.status === 'shipped') statusAmharic = "በመንገድ ላይ ነው (Shipped) 🚚";
      if (update.status === 'arrived') statusAmharic = "እጅዎ ላይ ደርሷል (Arrived/Delivered) 🎉";

      if (statusAmharic || update.tracking) {
         let msg = `📦 <b>የትዕዛዝ መረጃ (Order Update)</b>\n\n<b>እቃ:</b> ${productName}`;
         if (statusAmharic) msg += `\n<b>ሁኔታ:</b> ${statusAmharic}`;
         if (update.tracking) msg += `\n<b>ትራኪንግ (Tracking #):</b> <code>${update.tracking}</code>`;
         
         try { await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: telegramId, text: msg, parse_mode: "HTML" }) }); } catch (err) {}
      }
      fetchAllOrders();
    } else { alert("Failed to update order."); }
    setUploading(false);
  };

  const handleLogoTap = () => { setActiveTab("ዋና"); if (activePost) window.history.back(); window.scrollTo(0,0); };

  const handleAddCustomSize = () => {
    if(!customSizeInput.trim()) return;
    if(!formData.options.includes(customSizeInput)) setFormData(prev => ({ ...prev, options: [...(prev.options || []), customSizeInput] }));
    if(!savedCustomSizes.includes(customSizeInput)) {
      const newSaved = [...savedCustomSizes, customSizeInput];
      setSavedCustomSizes(newSaved); localStorage.setItem('goleth_custom_sizes', JSON.stringify(newSaved));
    }
    setCustomSizeInput("");
  };

  const addCategory = (type) => {
    if (type === 'primary' && newCatInput.trim() && !customCategories.includes(newCatInput)) {
      const updated = [...customCategories, newCatInput.trim()]; 
      setCustomCategories(updated); 
      localStorage.setItem('goleth_categories', JSON.stringify(updated)); 
      syncCategoriesToDB(updated, customSubCats);
      setNewCatInput("");
      if (!selectedPrimaryForSub) setSelectedPrimaryForSub(newCatInput.trim());
    } else if (type === 'secondary' && newSubCatInput.trim() && selectedPrimaryForSub) {
      const currentArr = customSubCats[selectedPrimaryForSub] || [];
      if (!currentArr.includes(newSubCatInput.trim())) {
        const updated = { ...customSubCats, [selectedPrimaryForSub]: [...currentArr, newSubCatInput.trim()] };
        setCustomSubCats(updated); 
        localStorage.setItem('goleth_subcats_map', JSON.stringify(updated)); 
        syncCategoriesToDB(customCategories, updated);
        setNewSubCatInput("");
      }
    }
  };
  
  const removeCategory = (type, val) => {
    if (type === 'primary') { 
      const updated = customCategories.filter(c => c !== val); 
      setCustomCategories(updated); 
      localStorage.setItem('goleth_categories', JSON.stringify(updated)); 
      syncCategoriesToDB(updated, customSubCats);
      if (selectedPrimaryForSub === val) setSelectedPrimaryForSub(updated[0] || "");
    } 
    else { 
      const currentArr = customSubCats[selectedPrimaryForSub] || [];
      const filtered = currentArr.filter(c => c !== val);
      const updated = { ...customSubCats, [selectedPrimaryForSub]: filtered };
      setCustomSubCats(updated); 
      localStorage.setItem('goleth_subcats_map', JSON.stringify(updated)); 
      syncCategoriesToDB(customCategories, updated);
    }
  };

  const moveCategory = (type, index, direction) => {
    const arr = type === 'primary' ? [...customCategories] : [...(customSubCats[selectedPrimaryForSub] || [])];
    if (direction === -1 && index > 0) { [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]; } 
    else if (direction === 1 && index < arr.length - 1) { [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]; }
    
    if (type === 'primary') { 
      setCustomCategories(arr); 
      localStorage.setItem('goleth_categories', JSON.stringify(arr)); 
      syncCategoriesToDB(arr, customSubCats);
    } else { 
      const updated = { ...customSubCats, [selectedPrimaryForSub]: arr };
      setCustomSubCats(updated); 
      localStorage.setItem('goleth_subcats_map', JSON.stringify(updated)); 
      syncCategoriesToDB(customCategories, updated);
    }
  };

  const saveCategoryEdit = (type) => {
    const arr = type === 'primary' ? [...customCategories] : [...(customSubCats[selectedPrimaryForSub] || [])];
    if (type === 'primary') {
      if (editCatValue.trim()) arr[editCatIndex] = editCatValue.trim();
      setCustomCategories(arr); 
      localStorage.setItem('goleth_categories', JSON.stringify(arr)); 
      syncCategoriesToDB(arr, customSubCats);
      setEditCatIndex(null); setEditCatValue("");
    } else {
      if (editSubCatValue.trim()) arr[editSubCatIndex] = editSubCatValue.trim();
      const updated = { ...customSubCats, [selectedPrimaryForSub]: arr };
      setCustomSubCats(updated); 
      localStorage.setItem('goleth_subcats_map', JSON.stringify(updated)); 
      syncCategoriesToDB(customCategories, updated);
      setEditSubCatIndex(null); setEditSubCatValue("");
    }
  };

  const openPost = (post) => { window.history.pushState({ postId: post.id }, "", `#article-${post.id}`); setActivePost(post); };
  
  const openProduct = (prod) => { 
    window.history.pushState({ prodId: prod.id }, "", `#product-${prod.id}`); 
    setSelectedProduct(prod); setCurrentImgIndex(0); setSelectedOption(null); 
    setShowInlineCheckout(!prod.options || prod.options.length === 0); 
  };
  
  const handleDelete = async (table, id) => { if (window.confirm("እርግጠኛ ነዎት?")) { await supabase.from(table).delete().eq("id", id); if (table === "games") fetchGames(); else fetchData(); if (activePost || selectedProduct) window.history.back(); } };
  
  const handleEdit = (type, item) => {
    setAdminTab(type); setEditId(item.id);
    if (type === "posts") {
      setFormData({ postCategory: item.category, title: item.title, subtitle: item.subtitle || "", excerpt: item.excerpt || "", body: item.body || "", author: item.author || "GOLETH", relatedLinks: item.related_links || [] });
      if (item.image_urls && item.image_urls.length > 0) { setExistingMainImage(item.image_urls[0]); setExistingInlineImages(item.image_urls.slice(1)); } else { setExistingMainImage(null); setExistingInlineImages([]); }
    } else {
      setFormData({ title: item.name, price: item.price, vipPrice: item.vip_price || "", shopCat: item.category, shopSubCat: item.subcategory || "", options: item.options || [], sourceUrl: item.source_link || "", description: item.description || "", isSale: item.is_sale || false });
    }
    setMainImageFile(null); setInlineImageFiles([]); setProductImageFiles([]); setSelectedMainImgIdx(0); setShowAdmin(true);
  };
  
  const openNewPost = (type) => { 
    setAdminTab(type); setEditId(null); setFormData({ options: [], relatedLinks: [], author: "GOLETH", isSale: false }); setExistingMainImage(null); setExistingInlineImages([]); setMainImageFile(null); setInlineImageFiles([]); setProductImageFiles([]); setSelectedMainImgIdx(0); 
    if (type === 'orders') fetchAllOrders();
  };
  
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
      
      if (editId) { 
        const { error } = await supabase.from("posts").update(payload).eq("id", editId); 
        if (error) { alert("Database Error: " + error.message); setUploading(false); return; }
      } else { 
        const { error } = await supabase.from("posts").insert([payload]); 
        if (error) { alert("Database Error: " + error.message); setUploading(false); return; }
      }
    } else if (adminTab === "products") {
      let filesToUpload = [...productImageFiles];
      if (filesToUpload.length > 1 && selectedMainImgIdx > 0 && selectedMainImgIdx < filesToUpload.length) { const main = filesToUpload.splice(selectedMainImgIdx, 1)[0]; filesToUpload.unshift(main); }
      if (filesToUpload.length > 0) { for (const file of filesToUpload) { const prodUrl = await uploadFileToSupabase(file); if (prodUrl) finalUrls.push(prodUrl); } }
      const payload = { 
        name: formData.title, price: Number(formData.price), vip_price: formData.vipPrice ? Number(formData.vipPrice) : null, 
        category: formData.shopCat, subcategory: formData.shopSubCat, options: formData.options, 
        source_link: formData.sourceUrl || null, description: formData.description || null, is_sale: formData.isSale || false
      };
      if (finalUrls.length > 0) payload.image_urls = finalUrls;
      
      if (editId) { 
        const { error } = await supabase.from("products").update(payload).eq("id", editId); 
        if (error) { alert("Database Error: " + error.message + " (Check 'description', 'source_link', and 'is_sale' columns)"); setUploading(false); return; }
      } else { 
        const { error } = await supabase.from("products").insert([payload]); 
        if (error) { alert("Database Error: " + error.message + " (Check 'description', 'source_link', and 'is_sale' columns)"); setUploading(false); return; }
      }
    }
    setFormData({ options: [], relatedLinks: [], isSale: false }); setMainImageFile(null); setInlineImageFiles([]); setProductImageFiles([]); setExistingMainImage(null); setExistingInlineImages([]); setEditId(null); setSelectedMainImgIdx(0); setUploading(false); setShowAdmin(false); setShowSizeDropdown(false); setExpandedOptionCategories({}); fetchData(); alert("በተሳካ ሁኔታ ተጠናቋል!");
  };

  const formatOptionDisplay = (optionString) => {
    if (!optionString.includes(":")) return optionString;
    const [label, values] = optionString.split(":");
    return (
      <div className="flex flex-col space-y-0.5">
        <span className="text-[10px] uppercase font-black text-zinc-500">{label.trim()}</span>
        <span className="text-zinc-300 font-bold text-xs">{values.trim()}</span>
      </div>
    );
  };

  const renderProfileModal = () => (
    <div className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-black text-amber-500 mb-2">እንኳን ደህና መጡ!</h2>
        <p className="text-zinc-300 text-sm mb-6">ለፈጣን አገልግሎት እባክዎ መረጃዎን ይሙሉ (ይህ አንዴ ብቻ የሚጠየቅ ነው)።</p>
        <form onSubmit={saveUserProfile} className="space-y-4">
          <input required name="fullName" defaultValue={currentUserProfile?.full_name || ""} placeholder="ሙሉ ስም (Full Name)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none" />
          <input required name="phone" type="tel" maxLength="10" pattern="[0-9]{10}" defaultValue={currentUserProfile?.phone_number || ""} placeholder="ስልክ ቁጥር (Phone Number)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none font-mono" />
          <select required name="location" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none font-bold">
            <option value="">የት ሀገር ነዎት? (Location)</option>
            <option value="Ethiopia">Ethiopia (ኢትዮጵያ)</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="Europe">Europe</option>
            <option value="Australia">Australia</option>
            <option value="South America">South America</option>
            <option value="Other">Other (ሌላ)</option>
          </select>
          <button type="submit" disabled={uploading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3 rounded-xl shadow-lg transition-colors mt-4">
            {uploading ? "በማስቀመጥ ላይ..." : "አስቀምጥ (Save)"}
          </button>
        </form>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    switch (status) {
       case 'pending': return <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-[10px] font-black uppercase">Pending</span>;
       case 'approved': return <span className="bg-blue-900/50 text-blue-400 border border-blue-900 px-2 py-1 rounded text-[10px] font-black uppercase">Approved</span>;
       case 'shipped': return <span className="bg-amber-500/20 text-amber-500 border border-amber-500/50 px-2 py-1 rounded text-[10px] font-black uppercase">Shipped</span>;
       case 'arrived': return <span className="bg-green-900/50 text-green-400 border border-green-900 px-2 py-1 rounded text-[10px] font-black uppercase">Arrived</span>;
       default: return <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-[10px] font-black uppercase">{status || 'Pending'}</span>;
    }
  };

  const renderAccountSlideOver = () => (
    <div className="fixed inset-0 z-[80] flex justify-end">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAccountMenu(false)}></div>
       <div className="relative w-full max-w-sm bg-zinc-950 h-full overflow-y-auto border-l border-zinc-800 animate-in slide-in-from-right duration-300 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-black text-white flex items-center"><User className="mr-2 text-amber-500" size={24}/> የእኔ አካውንት (My Account)</h2>
             <button onClick={() => setShowAccountMenu(false)} className="bg-zinc-900 p-2 rounded-full hover:bg-zinc-800 transition-colors"><X size={20}/></button>
          </div>

          {/* Digital VIP Card */}
          {isVIP && (
             <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 p-5 rounded-2xl mb-8 shadow-[0_0_30px_rgba(245,158,11,0.2)] text-black relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Target size={80}/></div>
                <h3 className="font-black text-lg uppercase tracking-widest mb-1 relative z-10">Goleth VIP Member</h3>
                <p className="font-bold text-sm opacity-90 mb-6 relative z-10">{currentUserProfile?.full_name}</p>
                
                <div className="flex justify-between items-end relative z-10">
                   <div>
                      <p className="text-[10px] uppercase font-black opacity-70">Status</p>
                      <p className="font-bold text-sm">Active</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-black opacity-70">Expires</p>
                      <p className="font-bold font-mono text-sm">{currentUserProfile?.vip_until ? new Date(currentUserProfile.vip_until).toLocaleDateString() : 'Lifetime'}</p>
                   </div>
                </div>
             </div>
          )}

          {/* Profile Details Edit */}
          <div className="mb-8">
             <div className="flex justify-between items-center mb-3">
               <h3 className="font-bold text-amber-500 text-sm uppercase tracking-wider">የግል መረጃ (Details)</h3>
               <button onClick={() => setShowProfileModal(true)} className="text-xs font-bold text-zinc-400 hover:text-white flex items-center"><Edit2 size={12} className="mr-1"/> አድስ (Edit)</button>
             </div>
             <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm text-zinc-300 space-y-2">
                <p><span className="text-zinc-500 mr-2">ስም:</span> {currentUserProfile?.full_name}</p>
                <p><span className="text-zinc-500 mr-2">ስልክ:</span> {currentUserProfile?.phone_number}</p>
                <p><span className="text-zinc-500 mr-2">አድራሻ:</span> {currentUserProfile?.region}</p>
             </div>
          </div>

          {/* Order History */}
          <div className="flex-1">
             <h3 className="font-bold text-amber-500 text-sm uppercase tracking-wider mb-4 flex items-center"><Package className="mr-2" size={16}/> የትዕዛዝ ታሪክ (Order History)</h3>
             {userOrders.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8">ምንም ትዕዛዝ የለም (No orders yet).</p>
             ) : (
                <div className="space-y-3">
                   {userOrders.map(order => (
                      <div key={order.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                         <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white text-sm line-clamp-1 flex-1 pr-2">{order.product_name}</h4>
                            {getStatusBadge(order.status)}
                         </div>
                         <p className="text-xs text-zinc-500 mb-2">{new Date(order.created_at).toLocaleDateString()}</p>
                         
                         {order.tracking_number && (
                            <div className="mt-3 bg-black border border-amber-500/20 p-2.5 rounded-lg">
                               <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">Tracking Number</p>
                               <p className="font-mono text-white text-xs font-bold">{order.tracking_number}</p>
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             )}
          </div>

          <button onClick={handleLogout} className="mt-8 w-full py-4 bg-red-900/20 text-red-500 border border-red-900/50 rounded-xl font-bold flex items-center justify-center hover:bg-red-900/40 transition-colors">
             <LogOut size={18} className="mr-2"/> ዘግተህ ውጣ (Sign Out)
          </button>
       </div>
    </div>
  );

  const renderSuccessModal = () => (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto flex flex-col p-6 animate-in fade-in zoom-in duration-200 justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative shadow-2xl max-w-md mx-auto w-full text-center">
        <button onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4 bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors"><X className="text-white w-5 h-5" /></button>
        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 text-4xl font-black shadow-[0_0_20px_rgba(245,158,11,0.2)]">✓</div>
        <h2 className="text-2xl font-black text-white mb-4">መረጃዎ ደርሶናል!</h2>
        <p className="text-zinc-300 text-sm leading-loose mb-8">ማረጋገጫዎ በጥሩ ሁኔታ ተልኳል። ሂደቱ በጥቂት ሰዓታት ውስጥ ይጀምራል።</p>
        <button onClick={() => setShowSuccessModal(false)} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl transition-colors text-lg shadow-lg">እሺ (OK)</button>
      </div>
    </div>
  );

  const renderOrderForm = () => {
    const isSourcingValid = ((reqProductName.trim() ? 1 : 0) + (reqStoreName.trim() ? 1 : 0) + (reqProductLink.trim() ? 1 : 0) + (reqImage ? 1 : 0)) >= 2;

    return (
      <div className="fixed inset-0 bg-zinc-900 z-[60] overflow-y-auto flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative w-full min-h-full flex flex-col px-6 pt-12 pb-24 max-w-lg mx-auto shadow-2xl">
          <button onClick={() => setShowOrderForm(false)} className="absolute top-4 right-4 bg-black/50 backdrop-blur p-2.5 rounded-full border border-zinc-800 hover:bg-zinc-800 transition-colors z-10">
            <X className="text-white w-6 h-6" />
          </button>
          
          {!currentUser ? (
            <div className="text-center py-20 flex-1 flex flex-col justify-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 mx-auto"><Target className="text-amber-500 w-8 h-8" /></div>
              <h3 className="text-white font-black mb-3">ለማዘዝ ይግቡ (Login required)</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed max-w-xs mx-auto">ልዩ ትዕዛዝዎን ለመላክ በቴሌግራም መለያዎ ይግቡ。</p>
              <div ref={telegramSourcingRef} className="flex justify-center min-h-[50px]"></div>
            </div>
          ) : (
            <div className="flex-1 w-full flex flex-col">
              <h2 className="text-2xl font-black text-amber-500 mb-2 text-center">ልዩ እቃ ማዘዣ</h2>
              <p className="text-zinc-300 text-sm text-center mb-2">ምን እቃ እንድንገዛ እና እንድንልክሎት ይፈልጋሉ? ከታች ካሉት የእቃው አማራጮች ቢያንስ <span className="font-bold text-white">ሁለቱን</span> ያስገቡ።</p>
              
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg mb-6 text-center">
                <span className="text-amber-500 font-bold text-xs">የVIP አባል ከሆኑ የነጻ አገልግሎት! የማጓጓዣ ብቻ ይከፍላሉ።</span>
              </div>

              <form onSubmit={submitOrderForm} className="space-y-3">
                <input required name="name" value={orderName} onChange={e => setOrderName(e.target.value)} placeholder="ሙሉ ስም" className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none transition-colors text-sm" />
                <input required name="phone" type="tel" maxLength="10" value={vipPhone} onChange={e => setVipPhone(e.target.value)} placeholder="ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none transition-colors text-sm font-mono" />
                
                <div className="border-t border-zinc-800 my-2 pt-3 space-y-2">
                   <input value={reqProductName} onChange={e => setReqProductName(e.target.value)} placeholder="የእቃው ስም (ለምሳሌ: iPhone 15)" className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none transition-colors text-sm" />
                   <input value={reqStoreName} onChange={e => setReqStoreName(e.target.value)} placeholder="የሱቁ ስም (ለምሳሌ: Amazon)" className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none transition-colors text-sm" />
                   <input value={reqProductLink} onChange={e => setReqProductLink(e.target.value)} type="url" placeholder="የእቃው ሊንክ (ካለ)" className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none transition-colors text-sm" />
                   
                   <div>
                      <label className="block text-zinc-400 text-xs mb-1 font-bold">ወይም የእቃውን ምስል ያያይዙ (ካለ)</label>
                      <input type="file" onChange={e => setReqImage(e.target.files[0])} accept="image/*" className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:bg-zinc-800 file:text-white file:border-0 file:cursor-pointer" />
                   </div>
                </div>

                <label className="flex items-center space-x-3 text-zinc-300 mt-2 bg-black p-3 rounded-xl border border-zinc-800 cursor-pointer">
                  <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} className="w-5 h-5 accent-amber-500 cursor-pointer" />
                  <span className="font-bold text-sm">ይህ ዕቃ ስጦታ ነው?</span>
                </label>

                {isGift && (
                  <div className="p-3 bg-black border border-amber-500/30 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-amber-500 font-bold text-[10px] uppercase tracking-wider mb-1">የተቀባዩ መረጃ</h4>
                    <input required value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="የተቀባዩ ሙሉ ስም" className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none text-sm" />
                    <input required type="tel" maxLength="10" value={recipientPhone} onChange={e => { const val = e.target.value.replace(/\D/g, ""); if (val.length <= 10) setRecipientPhone(val); }} placeholder="የተቀባዩ ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none text-sm font-mono" />
                    <textarea required value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} rows="2" placeholder="የተቀባዩ ሙሉ አድራሻ (ከተማ, ሰፈር)" className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none text-sm"></textarea>
                  </div>
                )}
                
                <select required name="shipping" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none transition-colors text-sm font-bold mt-2">
                  <option value="">ማጓጓዣ ይምረጡ</option>
                  <option value="3-5 የሰራ ቀናት">ከ3-5 የስራ ቀናት (መደበኛ)</option>
                  <option value="በሚቀጥለው ቀን አቅርቦት">በሚቀጥለው ቀን (አስቸኳይ)</option>
                </select>
                
                <button type="submit" disabled={uploading || !isSourcingValid} className={`w-full font-black py-3 rounded-xl mt-4 flex items-center justify-center transition-colors text-base ${(!isSourcingValid || uploading) ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none' : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg'}`}>
                  {uploading ? "በመላክ ላይ..." : <><Send size={18} className="mr-2" /> ትዕዛዙን ላክ</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOrderBanner = () => (
    <button onClick={handleOpenSourcing} className="col-span-2 w-full bg-gradient-to-br from-zinc-900 to-black rounded-lg p-2 flex justify-between items-center shadow-lg border border-amber-500/20 mb-2 mt-0 hover:border-amber-500/50 transition-all group">
      <div className="flex-1 flex flex-col items-center text-center">
        <h3 className="text-amber-500 font-black text-sm tracking-wide drop-shadow-md leading-tight mb-0.5">ልዩ እቃ ማዘዝ ይፈልጋሉ?</h3>
        <p className="text-zinc-400 text-[10px] font-bold">ከየትም ቦታ : የፈለጉበት ቦታ እናመጣሎታለን!</p>
      </div>
      <div className="bg-amber-500/10 p-1.5 rounded-full shadow-inner border border-amber-500/30 group-hover:bg-amber-500/20 transition-colors shrink-0 ml-2">
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
      if (match.index > lastIndex) { parts.push(text.substring(lastIndex, match.index)); }
      const imgNumber = parseInt(match[1], 10);
      if (urls && urls[imgNumber]) { parts.push(<img key={match.index} src={urls[imgNumber]} alt="Article Content" className="w-full h-auto rounded-xl my-6 shadow-lg object-cover border border-zinc-800" />); }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) { parts.push(text.substring(lastIndex)); }
    return <div className="text-zinc-300 text-sm leading-loose whitespace-pre-wrap">{parts.length > 0 ? parts : text}</div>;
  };

  const renderRelatedItems = () => {
    if (!activePost || !activePost.related_links || activePost.related_links.length === 0) return null;
    const relatedCards = activePost.related_links.map(link => {
      const [type, idStr] = link.split('_'); const id = parseInt(idStr, 10);
      if (type === 'post') {
        const p = posts.find(post => post.id === id); if (!p) return null;
        const img = p.image_urls && p.image_urls.length > 0 ? p.image_urls[0] : null;
        return (
          <div key={`post_${p.id}`} onClick={() => { setActiveTab(p.category); openPost(p); window.scrollTo(0,0); }} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer flex flex-col hover:border-amber-500/30 transition-colors">
            {img && <img src={img} alt={p.title} className="w-full aspect-[1.91/1] object-cover" />}
            <div className="p-3"><h4 className="text-white text-xs font-bold line-clamp-2">{p.title}</h4></div>
          </div>
        );
      } else if (type === 'product') {
        const p = products.find(prod => prod.id === id); if (!p) return null;
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
        <div className="grid grid-cols-2 gap-3">{relatedCards}</div>
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
          <button onClick={() => handleEdit("posts", activePost)} className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg text-xs font-bold flex-1 flex items-center justify-center transition-colors border border-zinc-700"><Edit2 size={14} className="mr-1" /> አስተካክል</button>
          <button onClick={() => handleDelete("posts", activePost.id)} className="bg-red-900/30 text-red-500 hover:bg-red-900/50 hover:text-red-400 border border-red-900 p-2 rounded-lg text-xs font-bold flex-1 flex items-center justify-center transition-colors"><Trash2 size={14} className="mr-1" /> ሰርዝ</button>
        </div>
      )}

      {(!activePost.body || !/\[image\s*\d+\]/i.test(activePost.body)) && activePost.image_urls && activePost.image_urls[0] && (
        <img src={activePost.image_urls[0]} alt={activePost.title} className="w-full aspect-[1.91/1] object-cover rounded-xl mb-6 shadow-2xl border border-zinc-800" />
      )}
      
      <h1 className="text-2xl font-black text-white mb-2 leading-tight">{activePost.title}</h1>
      {activePost.subtitle && <h2 className="text-base text-amber-500 font-bold mb-4">{activePost.subtitle}</h2>}
      <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8 border-b border-zinc-800 pb-4">{activePost.author}</div>
      {activePost.excerpt && <p className="text-sm text-white font-medium mb-8 italic border-l-2 border-amber-500 pl-4">{activePost.excerpt}</p>}
      {renderBodyWithImages(activePost.body, activePost.image_urls)}
      {renderRelatedItems()}
      <div className="mt-10">{renderOrderBanner()}</div>
    </div>
  );

  const renderProductDetail = () => {
    if (!selectedProduct) return null;
    const hasImages = selectedProduct.image_urls && selectedProduct.image_urls.length > 0;

    const hasVipAccess = isVIP || isCEO;
    const isGettingVipPrice = hasVipAccess || includeVipSignup;
    const basePrice = selectedProduct.vip_price && isGettingVipPrice ? selectedProduct.vip_price : selectedProduct.price;
    const nextDayBirr = checkoutShipping === "next_day" ? 850 : 0; 
    const vipSignupBirr = includeVipSignup ? (userRegion === "ሀገር ውስጥ" ? 100 : 850) : 0;
    const dynamicTotal = basePrice + nextDayBirr + vipSignupBirr;

    const inlineCheckoutUI = showInlineCheckout ? (
      <div className="bg-zinc-900 border border-amber-500/50 rounded-2xl p-4 mt-4 animate-in slide-in-from-top-4 duration-300 shadow-2xl mb-24">
        {!currentUser ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 mx-auto"><Target className="text-amber-500 w-8 h-8" /></div>
            <h3 className="text-white font-black mb-3">ለመግዛት ይግቡ (Login required)</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed max-w-xs mx-auto">ትዕዛዝዎን በትክክል ለማስኬድ በቴሌግራም መለያዎ ይግቡ。</p>
            <div ref={telegramCheckoutRef} className="flex justify-center min-h-[50px]"></div>
          </div>
        ) : (
          <form onSubmit={handleProductOrderSubmit} className="space-y-3">
            <h3 className="text-white font-black text-sm uppercase tracking-widest border-b border-zinc-900 pb-2 mb-2">የእርስዎ መረጃ</h3>
            
            {!hasVipAccess && selectedProduct.vip_price && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-start space-x-3 mb-4">
                <input type="checkbox" id="vipUpsell" checked={includeVipSignup} onChange={e => setIncludeVipSignup(e.target.checked)} className="mt-1 w-5 h-5 accent-amber-500 cursor-pointer" />
                <label htmlFor="vipUpsell" className="text-sm text-zinc-200 cursor-pointer">
                  <span className="font-bold text-amber-500 block">የ VIP ቅናሽ አሁን ያግኙ! (+ {userRegion === 'ዳያስፖራ' ? '$10 USD' : '100 ብር'})</span>
                  ይህንን በመጫን የVIP አባልነት ይግዙና እቃውን በVIP ዋጋ ይውሰዱ።
                </label>
              </div>
            )}

            <input required value={orderName} onChange={(e) => setOrderName(e.target.value)} placeholder="ሙሉ ስም" className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none text-sm" />
            <input required type="tel" maxLength="10" pattern="[0-9]{10}" value={vipPhone} onChange={e => { const val = e.target.value.replace(/\D/g, ""); if (val.length <= 10) setVipPhone(val); }} placeholder="ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none text-sm font-mono" />
            <textarea required value={orderAddress} onChange={(e) => setOrderAddress(e.target.value)} rows="2" placeholder="የማድረሻ አድራሻ (ከተማ፣ ሰፈር፣ ልዩ ቦታ)" className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none text-sm"></textarea>

            <label className="flex items-center space-x-3 text-zinc-300 mt-2 bg-black p-3 rounded-xl border border-zinc-800 cursor-pointer">
              <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} className="w-5 h-5 accent-amber-500 cursor-pointer" />
              <span className="font-bold text-sm">ይህ ዕቃ ስጦታ ነው?</span>
            </label>

            {isGift && (
              <div className="p-3 bg-zinc-900 border border-amber-500/30 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-amber-500 font-bold text-[10px] uppercase tracking-wider mb-1">የተቀባዩ መረጃ</h4>
                <input required value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="የተቀባዩ ሙሉ ስም" className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none text-sm" />
                <input required type="tel" maxLength="10" value={recipientPhone} onChange={e => { const val = e.target.value.replace(/\D/g, ""); if (val.length <= 10) setRecipientPhone(val); }} placeholder="የተቀባዩ ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none text-sm font-mono" />
                <textarea required value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} rows="2" placeholder="የተቀባዩ ሙሉ አድራሻ (ከተማ, ሰፈር)" className="w-full bg-black border border-zinc-800 text-white p-2.5 rounded-xl focus:border-amber-500 outline-none text-sm"></textarea>
              </div>
            )}

            <select required value={checkoutShipping} onChange={(e) => setCheckoutShipping(e.target.value)} className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm font-bold mt-2">
              <option value="standard">ከ3-5 የስራ ቀናት (መደበኛ ማጓጓዣ)</option>
              <option value="next_day">በሚቀጥለው ቀን (+$10 CAD አስቸኳይ)</option>
            </select>

            <div className="bg-black p-3 rounded-xl border border-zinc-800 text-sm mt-4 mb-4">
               <h4 className="text-amber-500 font-black mb-2 border-b border-zinc-800 pb-2">የክፍያ ዝርዝር</h4>
               <div className="flex justify-between mb-1"><span className="text-zinc-400">የእቃው ዋጋ:</span> <span className="text-white font-bold">{basePrice} ብር</span></div>
               {checkoutShipping === "next_day" && <div className="flex justify-between mb-1"><span className="text-zinc-400">አስቸኳይ ማጓጓዣ:</span> <span className="text-white font-bold">+ 850 ብር ($10)</span></div>}
               {includeVipSignup && <div className="flex justify-between mb-1"><span className="text-amber-500">VIP አባልነት:</span> <span className="text-amber-500 font-bold">+ {userRegion === 'ዳያስፖራ' ? '850 ብር ($10)' : '100 ብር'}</span></div>}
               
               <div className="flex justify-between mt-2 pt-2 border-t border-zinc-800">
                 <span className="text-white font-black">ጠቅላላ ክፍያ:</span>
                 <span className="text-amber-500 font-black text-lg">{dynamicTotal} ብር</span>
               </div>

               <div className="mt-3 bg-zinc-900 p-3 rounded-lg border border-amber-500/20">
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
              <input required type="file" onChange={(e) => setOrderFile(e.target.files[0])} accept="image/*" className="w-full text-xs text-zinc-300 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:bg-zinc-800 file:text-white file:font-bold file:border-0 file:cursor-pointer hover:file:bg-zinc-700 bg-black border border-zinc-800 rounded-xl p-2" />
            </div>
            
            <button type="submit" disabled={uploading || vipPhone.length !== 10 || !orderFile} className="w-full bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black py-4 rounded-xl text-base shadow-lg transition-colors mt-4">
              {uploading ? "በመላክ ላይ..." : "ይዘዙ"}
            </button>
          </form>
        )}
      </div>
    ) : null;

    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto animate-in slide-in-from-bottom-full duration-300 pb-24">
        <div className="relative">
          <button onClick={() => window.history.back()} className="absolute top-4 left-4 bg-black/50 backdrop-blur p-2.5 rounded-full border border-zinc-800 hover:bg-zinc-800 transition-colors z-20">
            <ChevronLeft className="text-white w-6 h-6" />
          </button>
          {isCEO && (
             <div className="absolute top-4 left-16 flex space-x-2 z-20">
                <button onClick={() => handleEdit("products", selectedProduct)} className="bg-black/50 backdrop-blur p-2.5 rounded-full border border-zinc-800 text-white"><Edit2 size={20}/></button>
                <button onClick={() => handleDelete("products", selectedProduct.id)} className="bg-black/50 backdrop-blur p-2.5 rounded-full border border-zinc-800 text-red-500"><Trash2 size={20}/></button>
             </div>
          )}

          {hasImages ? (
            <div className="relative w-full bg-white mb-4 border-b border-zinc-800 overflow-hidden">
               {selectedProduct.image_urls.length > 1 && <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white z-20 flex items-center">← Swipe →</div>}
               {selectedProduct.is_sale && <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 z-20 rounded-br-xl shadow-lg">ቅናሽ</div>}
               <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-64 w-full relative z-10">
                  {selectedProduct.image_urls.map((url, idx) => (
                    <img key={idx} src={url} alt={selectedProduct.name} className="w-full h-full object-contain shrink-0 snap-center mix-blend-multiply" />
                  ))}
               </div>
            </div>
          ) : (
            <div className="w-full h-64 bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800 relative">
              {selectedProduct.is_sale && <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 z-20 rounded-br-xl shadow-lg">ቅናሽ</div>}
              <span className="text-zinc-500 font-bold text-sm">ምስል የለም</span>
            </div>
          )}
        </div>

        <div className="p-4 pt-0">
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-lg font-black text-white leading-tight">{selectedProduct.name}</h1>
          </div>

          <div className="mt-3 border-b border-zinc-800 pb-4">
            {hasVipAccess ? (
               <div className="flex flex-col space-y-1">
                 <p className="text-zinc-400 font-black text-lg line-through decoration-red-500">መደበኛ: {selectedProduct.price} <span className="text-sm">ብር</span></p>
                 <p className="text-amber-500 font-black text-lg">VIP: {selectedProduct.vip_price || selectedProduct.price} <span className="text-sm">ብር</span></p>
               </div>
            ) : (
               <div className="flex flex-col space-y-1">
                 <p className="text-white font-black text-lg">{selectedProduct.price} <span className="text-sm text-zinc-400">ብር</span></p>
                 {selectedProduct.vip_price && <p className="text-amber-500 font-black text-lg mt-1">VIP: {selectedProduct.vip_price} <span className="text-sm">ብር</span></p>}
               </div>
            )}
          </div>

          {selectedProduct.description && (
             <div className="mt-4 border-b border-zinc-800 pb-4">
               <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-2">ስለ እቃው (Description)</h3>
               <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedProduct.description}</p>
             </div>
          )}

          {selectedProduct.options && selectedProduct.options.length > 0 && (
            <div className="mt-4 border-b border-zinc-800 pb-4">
              <h3 className="text-white font-black text-sm mb-3">ምርጫዎትን ይጫኑ (ወደ ማዘዣው ለመሄድ)</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.options.map((opt) => (
                  <button key={opt} onClick={() => { setSelectedOption(opt); setShowInlineCheckout(true); }} className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${selectedOption === opt ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-black text-zinc-300 border-zinc-700 hover:border-amber-500/50'}`}>
                    {formatOptionDisplay(opt)}
                  </button>
                ))}
              </div>
            </div>
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
      <div className="space-y-3 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {["ዋና", "ስፖርት", "ሹክሹክታ", "ማህበራዊ"].includes(activeTab) && renderOrderBanner()}
          
          {filteredPosts.map((post, index) => {
            const firstImg = post.image_urls && post.image_urls.length > 0 ? post.image_urls[0] : null;
            if (index === 0) {
              return (
                <div key={post.id} onClick={() => openPost(post)} className="col-span-2 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 cursor-pointer shadow-lg hover:border-zinc-700 transition-colors">
                  {firstImg && <img src={firstImg} alt={post.title} className="w-full aspect-[1.91/1] object-cover" />}
                  <div className="p-4">
                    <h2 className="text-lg font-black text-white mb-2 leading-tight line-clamp-2">{post.title}</h2>
                    <div className="text-amber-500 text-[10px] font-bold tracking-wider mb-2 uppercase">{post.author}</div>
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
              <div key={post.id} onClick={() => openPost(post)} className="col-span-2 flex items-center bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer p-2.5 hover:border-zinc-700 transition-colors">
                {firstImg && <img src={firstImg} alt={post.title} className="w-24 shrink-0 aspect-square object-cover rounded-lg border border-zinc-800" />}
                <div className="pl-3 flex flex-col flex-grow">
                  <h3 className="text-xs font-bold text-white mb-1 line-clamp-2 leading-snug">{post.title}</h3>
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
    // Strictly follow CEO mapped categories.
    const uniquePrimary = ["ሁሉም", ...customCategories];

    // Only fetch subcategories mapped to the currently selected primary category.
    const activeSubCats = shopCategory === "ሁሉም" ? [] : (customSubCats[shopCategory] || []);
    const uniqueSecondary = ["ሁሉም", ...activeSubCats];

    let filtered = products;
    if (shopCategory !== "ሁሉም") filtered = filtered.filter(p => p.category === shopCategory);
    if (shopCategory !== "ሁሉም" && shopSubCategory !== "ሁሉም") filtered = filtered.filter(p => p.subcategory === shopSubCategory);

    const hasVipAccess = isVIP || isCEO;

    return (
      <div className="pb-24">
        <div className="flex flex-wrap gap-2 pb-3 mb-1">
          {uniquePrimary.map(cat => (
            <button key={cat} onClick={() => { setShopCategory(cat); setShopSubCategory("ሁሉም"); }} 
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${shopCategory === cat ? "bg-amber-500 text-black shadow-lg" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {renderOrderBanner()}
        </div>

        {shopCategory !== "ሁሉም" && uniqueSecondary.length > 1 && (
           <div className="flex flex-wrap gap-2 pb-4 mb-2">
           {uniqueSecondary.map(cat => (
             <button key={cat} onClick={() => setShopSubCategory(cat)} 
               className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${shopSubCategory === cat ? "bg-zinc-300 text-black" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>
               {cat}
             </button>
           ))}
         </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-1">
          {filtered.map((item) => (
            <div key={item.id} onClick={() => openProduct(item)} className="cursor-pointer group flex flex-col h-full bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors shadow-lg overflow-hidden">
              <div className="bg-white w-full h-36 flex items-center justify-center relative shadow-sm overflow-hidden">
                 {isCEO && (
                    <div className="absolute bottom-2 right-2 flex space-x-1 z-20">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit("products", item); }} className="bg-black/50 backdrop-blur p-1.5 rounded-md text-white"><Edit2 size={12}/></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete("products", item.id); }} className="bg-black/50 backdrop-blur p-1.5 rounded-md text-red-400"><Trash2 size={12}/></button>
                    </div>
                 )}
                 {item.is_sale && <div className="absolute top-0 left-0 bg-red-600 text-white text-[9px] font-black px-2 py-1 z-10 rounded-br-lg shadow-sm">ቅናሽ</div>}
                 {item.image_urls && item.image_urls.length > 0 ? (
                    <img src={item.image_urls[0]} alt={item.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
                 ) : <div className="text-zinc-300 text-xs font-bold">ምስል የለም</div>}
              </div>

              <div className="p-3 flex flex-col flex-grow">
                 <h3 className="text-zinc-200 font-bold text-sm line-clamp-2 leading-tight mb-1">{item.name}</h3>
                 
                 <div className="mt-auto">
                    {hasVipAccess ? (
                      <>
                        <p className="text-zinc-400 font-bold text-sm line-through mt-0.5">መደበኛ: {item.price} <span className="text-[10px]">ብር</span></p>
                        <p className="text-amber-500 font-black text-sm leading-none">VIP: {item.vip_price || item.price} <span className="text-[10px]">ብር</span></p>
                      </>
                    ) : (
                      <>
                        <p className="text-white font-black text-sm leading-none">{item.price} <span className="text-[10px] text-zinc-400">ብር</span></p>
                        {item.vip_price && <p className="text-amber-500 font-black text-sm mt-1">VIP: {item.vip_price} <span className="text-[10px]">ብር</span></p>}
                      </>
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

    if (hasPendingVip && !isCEO) {
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

    if (!isCEO && (!isVIP || vipStatus === "expired" || vipStatus === "none")) {
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
                  <button type="button" disabled={!!currentUserProfile?.region} onClick={() => setVipPaymentType("ሀገር ውስጥ")} className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${vipPaymentType === "ሀገር ውስጥ" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-800"}`}>ሀገር ውስጥ</button>
                  <button type="button" disabled={!!currentUserProfile?.region} onClick={() => setVipPaymentType("ዳያስፖራ")} className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${vipPaymentType === "ዳያስፖራ" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-800"}`}>ዳያስፖራ</button>
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
      <div className="pb-24 pt-4">
        {isCEO && (
          <div className="bg-amber-500/10 border border-amber-500 text-amber-500 p-3 rounded-xl mb-6 text-center text-xs font-bold uppercase tracking-widest shadow-sm">
            🛡️ CEO Access Granted
          </div>
        )}
        {vipStatus === "expiring_soon" && !isCEO && (
          <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-xl mb-6 text-center text-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            ⚠️ <span className="font-bold">ማሳሰቢያ:</span> የVIP አባልነትዎ ሊያልቅ 2 ቀናት ቀርተውታል። አገልግሎቱ እንዳይቋረጥ እባክዎ ያድሱ።
          </div>
        )}
        <h2 className="text-2xl font-black text-white mb-6 text-center">የVIP ትንበያ</h2>
        {Array.isArray(games) && games.map(game => {
          if (!game || !game.id) return null;
          const userPred = userPredictions ? userPredictions[game.id] : null;
          return (
            <div key={game.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col items-center w-1/3">
                  {game.team_a_logo && typeof game.team_a_logo === 'string' && <img src={game.team_a_logo} alt="Team A" className="w-14 h-14 mb-2 object-contain drop-shadow-md"/>}
                  <span className="font-bold text-center text-xs text-zinc-300">{String(game.team_a || "")}</span>
                </div>
                <div className="text-2xl font-black text-amber-500 w-1/3 text-center">VS</div>
                <div className="flex flex-col items-center w-1/3">
                  {game.team_b_logo && typeof game.team_b_logo === 'string' && <img src={game.team_b_logo} alt="Team B" className="w-14 h-14 mb-2 object-contain drop-shadow-md"/>}
                  <span className="font-bold text-center text-xs text-zinc-300">{String(game.team_b || "")}</span>
                </div>
              </div>

              {game.status === 'open' && !userPred && (
                <div className="flex flex-col items-center space-y-4 border-t border-zinc-800 pt-4">
                  <div className="flex justify-center items-center space-x-3">
                    <input type="number" value={predictionInputs[game.id]?.a || ""} onChange={e => setPredictionInputs(prev => ({...prev, [game.id]: {...(prev[game.id] || {}), a: e.target.value}}))} className="w-16 p-3 rounded-lg bg-black border border-zinc-700 text-white text-center font-black focus:border-amber-500 outline-none" placeholder="0" />
                    <span className="font-black text-zinc-500">-</span>
                    <input type="number" value={predictionInputs[game.id]?.b || ""} onChange={e => setPredictionInputs(prev => ({...prev, [game.id]: {...(prev[game.id] || {}), b: e.target.value}}))} className="w-16 p-3 rounded-lg bg-black border border-zinc-700 text-white text-center font-black focus:border-amber-500 outline-none" placeholder="0" />
                  </div>
                  <button onClick={() => submitPrediction(game.id)} className="w-full bg-amber-500 text-black py-3 rounded-xl font-black shadow-lg hover:bg-amber-400 transition-colors">ውጤት ላክ</button>
                </div>
              )}

              {game.status === 'open' && userPred && (
                <div className="mt-4 text-center bg-black border border-amber-500/50 text-amber-500 text-sm font-bold p-3 rounded-xl">🔒 ግምትዎ ተቆልፏል: {String(userPred.predicted_score_a ?? '')} - {String(userPred.predicted_score_b ?? '')}</div>
              )}

              {game.status === 'finished' && userPred && (
                <div className="mt-4 text-center border-t border-zinc-800 pt-4">
                  <div className="text-sm font-bold text-zinc-400 mb-2">ትክክለኛ ውጤት: <span className="text-white">{String(game.final_score_a ?? '')} - {String(game.final_score_b ?? '')}</span></div>
                  <div className={`p-3 rounded-xl text-sm font-black text-white ${userPred.predicted_score_a === game.final_score_a && userPred.predicted_score_b === game.final_score_b ? 'bg-green-600/80 border border-green-500' : 'bg-red-900/50 border border-red-800 text-red-200'}`}>
                    {userPred.predicted_score_a === game.final_score_a && userPred.predicted_score_b === game.final_score_b ? "🎉 አሸናፊ!" : `የእርስዎ ግምት: ${String(userPred.predicted_score_a ?? '')} - ${String(userPred.predicted_score_b ?? '')} ❌`}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderAdmin = () => {
    const safePrimaryOptions = [...new Set([...customCategories, ...(formData.shopCat ? [formData.shopCat] : [])])].filter(Boolean);
    const safeSecondaryOptions = [...new Set([...(customSubCats[formData.shopCat] || []), ...(formData.shopSubCat ? [formData.shopSubCat] : [])])].filter(Boolean);

    return (
      <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto p-6 pt-16 animate-in fade-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-amber-500 font-black text-2xl tracking-wide">{editId ? "Edit Listing" : "CEO Dashboard"}</h2>
          <button onClick={() => { setShowAdmin(false); setEditId(null); setExpandedOptionCategories({}); }} className="bg-zinc-900 hover:bg-zinc-800 p-2 rounded-full transition-colors"><X className="text-white w-6 h-6" /></button>
        </div>

        {!editId && (
          <div className="flex space-x-2 mb-6 border-b border-zinc-800 pb-4 overflow-x-auto no-scrollbar">
            {["posts", "products", "games", "categories", "orders"].map((tab) => (
              <button key={tab} onClick={() => { setAdminTab(tab); openNewPost(tab); }} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors capitalize ${adminTab === tab ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}>
                {tab}
              </button>
            ))}
          </div>
        )}

        {adminTab === "orders" && (
           <div className="space-y-6 pb-20">
              <h3 className="text-amber-500 font-bold mb-2">Manage Store Orders</h3>
              {allOrders.length === 0 && <p className="text-zinc-500 text-sm">No orders found.</p>}
              {allOrders.map(order => {
                 const currentUpdate = orderUpdateData[order.id] || { status: order.status, tracking: order.tracking_number || "" };
                 
                 return (
                 <div key={order.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col space-y-3 shadow-lg">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-white font-bold text-sm">{order.full_name}</p>
                          <p className="text-amber-500 font-black text-sm">{order.product_name} <span className="text-zinc-500 font-normal text-xs">({order.selected_option})</span></p>
                       </div>
                       <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-[10px] text-zinc-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>
                    
                    <div className="bg-black p-3 rounded-lg border border-zinc-800 space-y-3">
                       <div>
                          <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Update Status</label>
                          <select value={currentUpdate.status} onChange={(e) => setOrderUpdateData({...orderUpdateData, [order.id]: {...currentUpdate, status: e.target.value}})} className="w-full bg-zinc-900 border border-zinc-700 text-white p-2 rounded-lg text-xs outline-none focus:border-amber-500">
                             <option value="pending">Pending (በሂደት ላይ)</option>
                             <option value="approved">Approved (ተቀባይነት አግኝቷል)</option>
                             <option value="shipped">Shipped (በመንገድ ላይ ነው)</option>
                             <option value="arrived">Arrived (ደርሷል)</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Tracking Number</label>
                          <input type="text" value={currentUpdate.tracking} onChange={(e) => setOrderUpdateData({...orderUpdateData, [order.id]: {...currentUpdate, tracking: e.target.value}})} placeholder="Optional tracking link/code" className="w-full bg-zinc-900 border border-zinc-700 text-white p-2 rounded-lg text-xs outline-none focus:border-amber-500" />
                       </div>
                       
                       <button onClick={() => handleUpdateAdminOrder(order.id, order.telegram_id, order.product_name)} disabled={uploading} className="w-full bg-amber-500 text-black font-bold py-2 rounded-lg text-xs hover:bg-amber-400 transition-colors">
                          Update & Notify User
                       </button>
                    </div>
                 </div>
              )})}
           </div>
        )}

        {adminTab === "categories" && (
          <div className="space-y-6 pb-20">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
               <h3 className="text-amber-500 font-bold mb-4">ዋና ምድቦች (Primary Categories)</h3>
               <div className="flex space-x-2 mb-4">
                 <input type="text" value={newCatInput} onChange={e => setNewCatInput(e.target.value)} placeholder="Add new primary..." className="flex-1 bg-black border border-zinc-700 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm" />
                 <button onClick={() => addCategory('primary')} className="bg-amber-500 text-black px-4 py-3 rounded-xl font-bold hover:bg-amber-400">Add</button>
               </div>
               <div className="flex flex-col gap-2">
                 {customCategories.map((c, index) => (
                   <div key={`prim_${c}`} className="bg-zinc-800 text-white px-3 py-2 rounded-lg flex items-center justify-between text-sm">
                     {editCatIndex === index ? (
                       <input autoFocus type="text" value={editCatValue} onChange={e => setEditCatValue(e.target.value)} onBlur={() => saveCategoryEdit('primary')} className="bg-black border border-amber-500 text-white px-2 py-1 rounded w-1/2 outline-none" />
                     ) : (
                       <span>{c}</span>
                     )}
                     <div className="flex items-center space-x-1">
                       <button onClick={() => { setEditCatIndex(index); setEditCatValue(c); }} className="p-1.5 text-zinc-400 hover:text-amber-500"><Edit3 size={16}/></button>
                       <button onClick={() => moveCategory('primary', index, -1)} className="p-1.5 text-zinc-400 hover:text-white"><ArrowUp size={16}/></button>
                       <button onClick={() => moveCategory('primary', index, 1)} className="p-1.5 text-zinc-400 hover:text-white"><ArrowDown size={16}/></button>
                       <button onClick={() => removeCategory('primary', c)} className="p-1.5 text-red-500 hover:text-red-400"><X size={16}/></button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-amber-500 font-bold">ንዑስ ምድቦች (Subcategories)</h3>
               </div>
               <p className="text-xs text-zinc-400 mb-3">1. ንዑስ ምድብ ለማን እንደሚገባ ይምረጡ፦</p>
               <select value={selectedPrimaryForSub} onChange={(e) => setSelectedPrimaryForSub(e.target.value)} className="w-full bg-black border border-zinc-700 text-amber-500 font-bold p-3 rounded-xl outline-none mb-4 focus:border-amber-500">
                  {customCategories.length === 0 && <option value="">No Primary Categories</option>}
                  {customCategories.map(c => <option key={`sub_opt_${c}`} value={c}>{c}</option>)}
               </select>

               {selectedPrimaryForSub && (
                 <>
                   <div className="flex space-x-2 mb-4">
                     <input type="text" value={newSubCatInput} onChange={e => setNewSubCatInput(e.target.value)} placeholder={`Add subcategory to ${selectedPrimaryForSub}...`} className="flex-1 bg-black border border-zinc-700 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm" />
                     <button onClick={() => addCategory('secondary')} className="bg-amber-500 text-black px-4 py-3 rounded-xl font-bold hover:bg-amber-400">Add</button>
                   </div>
                   <div className="flex flex-col gap-2">
                     {(customSubCats[selectedPrimaryForSub] || []).length === 0 && <span className="text-xs text-zinc-500 italic">ምንም የለም</span>}
                     {(customSubCats[selectedPrimaryForSub] || []).map((c, index) => (
                       <div key={`sec_${c}`} className="bg-zinc-800 text-white px-3 py-2 rounded-lg flex items-center justify-between text-sm">
                         {editSubCatIndex === index ? (
                           <input autoFocus type="text" value={editSubCatValue} onChange={e => setEditSubCatValue(e.target.value)} onBlur={() => saveCategoryEdit('secondary')} className="bg-black border border-amber-500 text-white px-2 py-1 rounded w-1/2 outline-none" />
                         ) : (
                           <span>{c}</span>
                         )}
                         <div className="flex items-center space-x-1">
                           <button onClick={() => { setEditSubCatIndex(index); setEditSubCatValue(c); }} className="p-1.5 text-zinc-400 hover:text-amber-500"><Edit3 size={16}/></button>
                           <button onClick={() => moveCategory('secondary', index, -1)} className="p-1.5 text-zinc-400 hover:text-white"><ArrowUp size={16}/></button>
                           <button onClick={() => moveCategory('secondary', index, 1)} className="p-1.5 text-zinc-400 hover:text-white"><ArrowDown size={16}/></button>
                           <button onClick={() => removeCategory('secondary', c)} className="p-1.5 text-red-500 hover:text-red-400"><X size={16}/></button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </>
               )}
            </div>
          </div>
        )}

        {adminTab === "games" && (
          <div className="space-y-8 pb-20">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
              <h3 className="text-amber-500 font-bold mb-4">Post New Game</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Team A Name" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none" value={newGame.team_a} onChange={e => setNewGame({...newGame, team_a: e.target.value})} />
                <div>
                   <label className="block text-zinc-400 text-xs font-bold mb-1">Team A Logo (Image File)</label>
                   <input type="file" accept="image/*" onChange={(e) => setTeamAFile(e.target.files[0])} className="w-full text-sm text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:bg-zinc-800 file:text-white file:border-0 file:cursor-pointer" />
                </div>
                <div className="border-b border-zinc-800 my-4"></div>
                <input type="text" placeholder="Team B Name" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none" value={newGame.team_b} onChange={e => setNewGame({...newGame, team_b: e.target.value})} />
                <div>
                   <label className="block text-zinc-400 text-xs font-bold mb-1">Team B Logo (Image File)</label>
                   <input type="file" accept="image/*" onChange={(e) => setTeamBFile(e.target.files[0])} className="w-full text-sm text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:bg-zinc-800 file:text-white file:border-0 file:cursor-pointer" />
                </div>
                <button onClick={createGame} disabled={uploading || !newGame.team_a || !newGame.team_b} className="w-full bg-amber-500 disabled:bg-zinc-800 text-black p-4 rounded-xl mt-4 font-black hover:bg-amber-400">Publish Game</button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
              <h3 className="text-amber-500 font-bold mb-4">Active Games (Set Final Scores)</h3>
              {games.map(game => (
                <div key={game.id} className="border-t border-zinc-800 py-4 flex flex-col space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold text-white">
                    <span className="flex items-center space-x-2">
                       {game.team_a_logo && <img src={game.team_a_logo} className="w-6 h-6 object-contain" alt="A" />}
                       <span>{game.team_a} vs {game.team_b}</span>
                       {game.team_b_logo && <img src={game.team_b_logo} className="w-6 h-6 object-contain" alt="B" />}
                    </span>
                    <button onClick={() => handleDelete("games", game.id)} className="text-red-500 p-1"><Trash2 size={16}/></button>
                  </div>
                  {game.status !== 'finished' ? (
                    <div className="flex items-center space-x-2">
                      <input type="number" placeholder="0" className="bg-black border border-zinc-700 text-white p-2 w-16 rounded-lg text-center" onChange={e => setScoresToUpdate({...scoresToUpdate, [game.id]: {...scoresToUpdate[game.id], a: e.target.value}})} />
                      <span className="font-black text-zinc-500">-</span>
                      <input type="number" placeholder="0" className="bg-black border border-zinc-700 text-white p-2 w-16 rounded-lg text-center" onChange={e => setScoresToUpdate({...scoresToUpdate, [game.id]: {...scoresToUpdate[game.id], b: e.target.value}})} />
                      <button onClick={() => updateFinalScore(game.id)} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 text-xs">End Game</button>
                    </div>
                  ) : (
                    <span className="text-zinc-500 text-xs">Finished ({game.final_score_a} - {game.final_score_b})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab !== "games" && adminTab !== "categories" && adminTab !== "orders" && (
          <form onSubmit={handleAdminSubmit} className="space-y-4 pb-20">
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
                  <option value="">GOLETH</option>
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
                        {posts.filter(p => p.id !== editId).map(p => <option key={`post_${p.id}`} value={`post_${p.id}`}>{p.title}</option>)}
                      </optgroup>
                      <optgroup label="Shop Items (ሱቅ)">
                        {products.map(p => <option key={`product_${p.id}`} value={`product_${p.id}`}>{p.name}</option>)}
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
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-4 flex items-center justify-between">
                  <span className="text-white font-bold text-sm">ይህ እቃ ቅናሽ ላይ ነው? (Is it on Sale?)</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.isSale || false} onChange={e => setFormData({...formData, isSale: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <input required value={formData.title || ""} placeholder="የእቃው ስም" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none transition-colors" />
                
                <div className="grid grid-cols-2 gap-4">
                  <input required value={formData.price || ""} type="number" placeholder="ዋጋ" onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl outline-none focus:border-amber-500" />
                  <input value={formData.vipPrice || ""} type="number" placeholder="የ VIP ዋጋ" onChange={(e) => setFormData({ ...formData, vipPrice: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl outline-none focus:border-amber-500" />
                </div>

                <div className="grid grid-cols-1 gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <div className="relative">
                    <label className="block text-zinc-400 text-xs font-bold mb-2">ዋና ምድብ (Primary Category)</label>
                    <select required value={formData.shopCat || ""} onChange={(e) => setFormData({ ...formData, shopCat: e.target.value, shopSubCat: "" })} className="w-full bg-black border border-zinc-700 text-white p-3 rounded-lg focus:border-amber-500 outline-none transition-colors">
                       <option value="">ምረጥ (Select...)</option>
                       {safePrimaryOptions.map(c => <option key={`p_opt_${c}`} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="relative border-t border-zinc-800 pt-4 mt-2">
                    <label className="block text-zinc-400 text-xs font-bold mb-2">ንዑስ ምድብ (Subcategory)</label>
                    <select value={formData.shopSubCat || ""} onChange={(e) => setFormData({ ...formData, shopSubCat: e.target.value })} className="w-full bg-black border border-zinc-700 text-white p-3 rounded-lg focus:border-amber-500 outline-none transition-colors">
                       <option value="">ምንም (None)</option>
                       {safeSecondaryOptions.map(c => <option key={`s_opt_${c}`} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="relative">
                  <button type="button" onClick={() => setShowSizeDropdown(!showSizeDropdown)} className="w-full bg-zinc-900 border border-zinc-800 text-left p-4 rounded-xl focus:border-amber-500 text-zinc-400 flex justify-between items-center transition-colors">
                    <span>መጠኖች ይምረጡ {formData.options?.length > 0 && <span className="text-amber-500 font-bold ml-1">({formData.options.length})</span>}</span>
                    <span>{showSizeDropdown ? "▲" : "▼"}</span>
                  </button>
                  
                  {showSizeDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl max-h-[400px] overflow-y-auto p-4 shadow-2xl">
                      <div className="mb-4 bg-black p-3 rounded-xl border border-amber-500/30">
                         <label className="block text-amber-500 text-xs font-bold mb-2">አዲስ መጠን / ቀለም ያስገቡ (Add Custom Size/Option)</label>
                         <div className="flex space-x-2">
                           <input type="text" value={customSizeInput} onChange={(e) => setCustomSizeInput(e.target.value)} placeholder="e.g. Red, 4XL, 100ml..." className="flex-1 bg-zinc-900 border border-zinc-700 text-white p-2 rounded-lg text-sm focus:border-amber-500 outline-none" />
                           <button type="button" onClick={handleAddCustomSize} className="bg-amber-500 text-black px-3 py-2 rounded-lg font-bold text-sm hover:bg-amber-400">Add</button>
                         </div>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(categorizedOptions).map(([categoryName, sizes]) => (
                          <div key={categoryName} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-700">
                            <button type="button" onClick={() => toggleOptionCategory(categoryName)} className="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-bold text-amber-500 hover:bg-zinc-800 transition-colors">
                              <span>{categoryName}</span><span>{expandedOptionCategories[categoryName] ? "▲" : "▼"}</span>
                            </button>
                            {expandedOptionCategories[categoryName] && (
                              <div className="p-4 flex flex-wrap gap-2 bg-black border-t border-zinc-700">
                                {sizes.length === 0 && <p className="text-xs text-zinc-500">ምንም የለም</p>}
                                {sizes.map(size => (
                                  <label key={size} className="flex items-center space-x-2 text-white cursor-pointer bg-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-800">
                                    <input type="checkbox" value={size} checked={formData.options?.includes(size)} onChange={handleSizeChange} className="accent-amber-500 w-4 h-4" />
                                    <span className="text-xs font-bold">{size}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => setShowSizeDropdown(false)} className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-lg transition-colors sticky bottom-0">አረጋግጥ (Done)</button>
                    </div>
                  )}
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                   <label className="block text-white font-bold text-sm mb-2">ስለ እቃው (Product Description) - Optional</label>
                   <textarea value={formData.description || ""} rows="3" placeholder="Write details about the product here..." onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-black border border-zinc-700 text-white p-3 rounded-lg focus:border-amber-500 outline-none transition-colors text-sm"></textarea>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                   <label className="block text-zinc-400 font-bold text-xs mb-2">Private Source URL (Backend Only)</label>
                   <input type="url" value={formData.sourceUrl || ""} placeholder="https://..." onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })} className="w-full bg-black border border-zinc-700 text-white p-3 rounded-lg focus:border-amber-500 outline-none transition-colors text-sm" />
                   <p className="text-[10px] text-zinc-500 mt-2">This link is saved to Supabase but never shown to users.</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                   <label className="block text-white font-bold text-sm mb-2">የእቃው ምስሎች (Image Upload)</label>
                   <input type="file" multiple accept="image/*" onChange={(e) => { setProductImageFiles(Array.from(e.target.files)); setSelectedMainImgIdx(0); }} className="w-full text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:bg-zinc-800 file:text-white file:border-0 file:cursor-pointer hover:file:bg-zinc-700" />
                   {productImageFiles.length > 0 && (
                     <div className="mt-4 border-t border-zinc-800 pt-3">
                       <p className="text-xs text-amber-500 font-bold mb-2">Tap an image to set it as MAIN (Front):</p>
                       <div className="flex space-x-2 overflow-x-auto pb-2">
                         {productImageFiles.map((file, idx) => (
                           <div key={idx} onClick={() => setSelectedMainImgIdx(idx)} className={`relative p-1 shrink-0 rounded-lg cursor-pointer transition-all border-2 ${selectedMainImgIdx === idx ? 'border-amber-500 bg-amber-500/10' : 'border-transparent hover:bg-zinc-800'}`}>
                             <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-16 h-16 object-cover rounded-md" />
                             {selectedMainImgIdx === idx && <span className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black px-1 rounded-bl-md z-10">MAIN</span>}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                </div>
              </>
            )}
            
            <button disabled={uploading} type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl mt-4 transition-colors">
              {uploading ? "በመጫን ላይ..." : (editId ? "አስተካክል (Update)" : "አትም (Publish)")}
            </button>
          </form>
        )}
      </div>
    );
  };

  const tabs = [
    { id: "ዋና", icon: Home },
    { id: "ስፖርት", icon: Trophy },
    { id: "ሹክሹክታ", icon: Flame },
    { id: "ማህበራዊ", icon: Users },
    { id: "ቪአይፒ", icon: Target },
    { id: "ሱቅ", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans text-white">
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
          
          <div className="flex items-center space-x-2">
            {!currentUser ? (
               <button onClick={() => setShowLoginModal(true)} className="bg-[#2AABEE] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-[#229ED9] transition-colors">
                 ይግቡ
               </button>
            ) : (
               <button onClick={() => setShowAccountMenu(true)} className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-white px-3 py-1.5 rounded-full flex items-center transition-colors shadow-sm">
                  <User size={14} className="text-amber-500 mr-2" />
                  <span className="text-xs font-bold max-w-[80px] truncate">{currentUserProfile?.full_name || "Account"}</span>
               </button>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && !currentUser && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-sm relative shadow-2xl">
             <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors"><X className="text-white w-5 h-5" /></button>
             <div className="w-16 h-16 bg-[#2AABEE]/10 rounded-full flex items-center justify-center mb-4 mx-auto"><Users className="text-[#2AABEE] w-8 h-8" /></div>
             <h3 className="text-center font-black text-white text-xl mb-2">ወደ Goleth ይግቡ</h3>
             <p className="text-center text-zinc-400 text-sm mb-6">በቴሌግራም መለያዎ በቀላሉ ይግቡ።</p>
             <div ref={telegramHeaderLoginRef} className="flex justify-center min-h-[50px]"></div>
          </div>
        </div>
      )}

      {showAccountMenu && renderAccountSlideOver()}

      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
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

      <nav className="fixed bottom-0 inset-x-0 w-full bg-black/95 backdrop-blur-md border-t border-zinc-900 flex justify-around pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 px-1 z-[100]">
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
