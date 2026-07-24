import React, { useState, useEffect, useRef } from "react";
import {
  Home, Trophy, Flame, Users, Target, ShoppingBag, X, Trash2, Edit2, ChevronLeft, PlusCircle, Send, CheckCircle, LogOut, ArrowUp, ArrowDown, Edit3, User, Package, Plus, Minus, Eye, EyeOff, DollarSign, ShoppingCart, Plane, List, LayoutDashboard, FileText, Settings, Archive
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Secure Supabase Connection
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN; 
const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID; 

export default function App() {
  const [activeTab, setActiveTab] = useState("ሱቅ");
  const [activePost, setActivePost] = useState(null);
  
  const [shopCategory, setShopCategory] = useState("ሁሉም");
  const [shopSubCategory, setShopSubCategory] = useState("ሁሉም");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const [includeVipSignup, setIncludeVipSignup] = useState(false);
  
  const [userRegion, setUserRegion] = useState("ሀገር ውስጥ");
  const [checkoutShipping, setCheckoutShipping] = useState("standard");
  const [orderName, setOrderName] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderFile, setOrderFile] = useState(null);
  
  const [reqProductName, setReqProductName] = useState("");
  const [reqStoreName, setReqStoreName] = useState("");
  const [reqProductLink, setReqProductLink] = useState("");
  const [reqImage, setReqImage] = useState(null);

  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  const [isCEO, setIsCEO] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [showOfflineSaleModal, setShowOfflineSaleModal] = useState(false);
  const [offlineSaleProduct, setOfflineSaleProduct] = useState(null);
  const [offlineSaleMode, setOfflineSaleMode] = useState("single");
  const [offlineSaleQty, setOfflineSaleQty] = useState(1);
  const [offlineSaleCustomPrice, setOfflineSaleCustomPrice] = useState("");

  const [adminTab, setAdminTab] = useState("overview");
  const [uploading, setUploading] = useState(false);
  const [startupExpenses, setStartupExpenses] = useState(() => Number(localStorage.getItem('goleth_expenses') || 0));
  const [showFinancialDetails, setShowFinancialDetails] = useState(false);
  
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ options: [], relatedLinks: [], isSale: false, shopCat: [], shopSubCat: [] });
  const [existingMainImage, setExistingMainImage] = useState(null);
  const [existingInlineImages, setExistingInlineImages] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [inlineImageFiles, setInlineImageFiles] = useState([]);
  const [productImageFiles, setProductImageFiles] = useState([]);
  const [selectedMainImgIdx, setSelectedMainImgIdx] = useState(0);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [expandedOptionCategories, setExpandedOptionCategories] = useState({});

  const [customSizeInput, setCustomSizeInput] = useState("");
  const [newCatInput, setNewCatInput] = useState("");
  const [newSubCatInput, setNewSubCatInput] = useState("");
  const [selectedPrimaryForSub, setSelectedPrimaryForSub] = useState("");
  
  const [editCatIndex, setEditCatIndex] = useState(null);
  const [editCatValue, setEditCatValue] = useState("");
  const [editSubCatIndex, setEditSubCatIndex] = useState(null);
  const [editSubCatValue, setEditSubCatValue] = useState("");
  
  const [savedCustomSizes, setSavedCustomSizes] = useState(() => JSON.parse(localStorage.getItem('goleth_custom_sizes') || '[]'));
  const [customCategories, setCustomCategories] = useState(() => JSON.parse(localStorage.getItem('goleth_categories') || '["ወንድ", "ሴት", "ልጅ", "መድሀኒት", "ጤና እና ውበት"]'));
  const [customSubCats, setCustomSubCats] = useState(() => JSON.parse(localStorage.getItem('goleth_subcats_map') || '{"ወንድ":["ልብስ","ጫማ"],"ሴት":["ልብስ","ጫማ"]}'));
  
  const [hiddenCategories, setHiddenCategories] = useState(() => JSON.parse(localStorage.getItem('goleth_hidden_cats') || '[]'));
  const [hiddenSubCategories, setHiddenSubCategories] = useState(() => JSON.parse(localStorage.getItem('goleth_hidden_subcats') || '[]'));

  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [userSourcing, setUserSourcing] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allSourcing, setAllSourcing] = useState([]);
  
  const [pendingVipRequests, setPendingVipRequests] = useState([]);
  const [approvedVipPayments, setApprovedVipPayments] = useState([]);

  const [orderUpdateData, setOrderUpdateData] = useState({});
  const [sourcingUpdateData, setSourcingUpdateData] = useState({});

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [vipStatus, setVipStatus] = useState("none");
  const [hasPendingVip, setHasPendingVip] = useState(() => localStorage.getItem('goleth_pending_vip') === 'true');
  const [games, setGames] = useState([]);
  const [userPredictions, setUserPredictions] = useState({});
  const [predictionInputs, setPredictionInputs] = useState({});
  
  const [newGame, setNewGame] = useState({ team_a: '', team_b: '' });
  const [teamAFile, setTeamAFile] = useState(null);
  const [teamBFile, setTeamBFile] = useState(null);
  const [scoresToUpdate, setScoresToUpdate] = useState({});
  
  const [vipPaymentType, setVipPaymentType] = useState("ሀገር ውስጥ"); 
  const [vipPhone, setVipPhone] = useState("");
  const [vipReceiptFile, setVipReceiptFile] = useState(null);
  
  const telegramCheckoutRef = useRef(null);
  const telegramSourcingRef = useRef(null);
  const telegramHeaderLoginRef = useRef(null);
  const telegramWrapperRef = useRef(null); 

  const authorList = ["GOLETH", "አማኑኤል", "Writer Name"];
  
  const categorizedOptions = {
    "የጫማ መጠን (Shoe Sizes)": [],
    "የልብስ መጠን (Clothing Sizes)": ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "0-3m", "3-6m", "6-12m", "1-2Y", "2-4Y", "4-6Y", "6-8Y", "8-10Y", "10-12Y", "12-14Y"],
    "ቀለም (Colors)": ["Black (ጥቁር)", "White (ነጭ)", "Red (ቀይ)", "Blue (ሰማያዊ)", "Green (አረንጓዴ)", "Yellow (ቢጫ)", "Brown (ቡናማ)", "Grey (ግራጫ)", "Pink (ሮዝ)", "Purple (ሐምራዊ)", "Orange (ብርቱካናማ)", "Gold (ወርቃማ)", "Silver (ብር)", "Multi (የተለያየ)"],
    "መጠን/ክብደት (Measurements)": ["g", "kg", "ml", "L"],
    "የእርስዎ (Custom)": savedCustomSizes
  };

  const isFullNameValid = (nameStr) => {
    if (!nameStr) return false;
    return nameStr.trim().split(/\s+/).length > 1;
  };

  const handleUpdateExpenses = (val) => {
    const num = Number(val);
    setStartupExpenses(num);
    localStorage.setItem('goleth_expenses', num);
  };

  const calculateAutomatedPrice = (cadCost, weightKg, specialFee) => {
    if (!cadCost || isNaN(cadCost)) return { regular: 0, vip: 0 };
    const costWithTax = Number(cadCost) * 1.13;
    const costWithMarkup = costWithTax * 1.18;
    const baseBirr = costWithMarkup * 130;
    
    let freightBirr = 0;
    if (specialFee && !isNaN(specialFee)) {
      freightBirr = Number(specialFee);
    } else {
      const weight = weightKg && !isNaN(weightKg) ? Math.max(Number(weightKg), 1) : 1;
      freightBirr = weight * 1500;
    }
    
    const totalRegular = Math.round(baseBirr + freightBirr);
    const totalVip = Math.round(totalRegular * 0.90); 
    
    return { regular: totalRegular, vip: totalVip };
  };

  const inventoryAssetValueCad = products.reduce((sum, p) => sum + (Math.max(0, p.stock_quantity || 0) * (p.cost_cad || 0)), 0);
  const activeLocalStock = products.reduce((sum, p) => sum + Math.max(0, p.stock_quantity || 0), 0);
  
  const onlineOrdersArr = allOrders.filter(o => o.status === 'arrived' && !o.is_offline_sale);
  const offlineOrdersArr = allOrders.filter(o => o.is_offline_sale);
  const onlineRevenue = onlineOrdersArr.reduce((sum, o) => sum + (o.price || 0), 0);
  const loggedOfflineRevenue = offlineOrdersArr.reduce((sum, o) => sum + (o.price || 0), 0);
  const totalRevenue = onlineRevenue + loggedOfflineRevenue;
  const prizePool = Math.round(totalRevenue * 0.03); 
  
  // VIP Revenue Math
  const localVipRevenue = approvedVipPayments.filter(v => v.payment_type === 'ሀገር ውስጥ').reduce((sum) => sum + 300, 0);
  const diasporaVipRevenue = approvedVipPayments.filter(v => v.payment_type === 'ዳያስፖራ').reduce((sum) => sum + 1950, 0);

  // Flight Batch Math Updates: Orders = APPROVED only. Sourcing = APPROVED only (using dynamic weight)
  const approvedOrdersWeight = allOrders.filter(o => o.status === 'approved' && !o.is_offline_sale).reduce((sum, o) => sum + (o.total_weight_kg || 0), 0);
  const approvedSourcingWeight = allSourcing.filter(o => o.status === 'approved').reduce((sum, o) => sum + (o.total_weight_kg || 0), 0); 
  const totalBatchWeight = approvedOrdersWeight + approvedSourcingWeight;
  const flightBatchPercentage = Math.min((totalBatchWeight / 1.0) * 100, 100);

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
      } catch (e) {}
    }

    const handlePopState = () => { setActivePost(null); setSelectedProduct(null); setShowCart(false); setQuantity(1); };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (isCEO) {
      fetchAllOrders();
      fetchAllSourcing();
      fetchAllVipData();
    }
  }, [isCEO]);

  useEffect(() => {
    if (adminTab === "products") {
      const prices = calculateAutomatedPrice(formData.cadCost, formData.weightKg, formData.specialFreightFee);
      setFormData(prev => ({ ...prev, price: prices.regular, vipPrice: prices.vip }));
    }
  }, [formData.cadCost, formData.weightKg, formData.specialFreightFee, adminTab]);

  const fetchGlobalCategories = async () => {
    try {
      const { data } = await supabase.from('app_settings').select('*').eq('id', 1).single();
      if (data) {
        if (data.primary_categories) { setCustomCategories(data.primary_categories); localStorage.setItem('goleth_categories', JSON.stringify(data.primary_categories)); }
        if (data.subcategories_map) { setCustomSubCats(data.subcategories_map); localStorage.setItem('goleth_subcats_map', JSON.stringify(data.subcategories_map)); }
      }
    } catch (err) {}
  };

  const syncCategoriesToDB = async (primaries, subcats) => {
    try { await supabase.from('app_settings').upsert({ id: 1, primary_categories: primaries, subcategories_map: subcats }); } catch (e) {}
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

  useEffect(() => { if (showCart && !currentUser) injectTelegramScript(telegramCheckoutRef.current); }, [showCart, currentUser]);
  useEffect(() => { if (showOrderForm && !currentUser) injectTelegramScript(telegramSourcingRef.current); }, [showOrderForm, currentUser]);
  useEffect(() => { if (showLoginModal && !currentUser) injectTelegramScript(telegramHeaderLoginRef.current, () => setShowLoginModal(false)); }, [showLoginModal, currentUser]);
  useEffect(() => { if (activeTab === "ቪአይፒ" && !currentUser) injectTelegramScript(telegramWrapperRef.current); }, [activeTab, currentUser]);

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
    } catch (error) {}
  };

  const fetchGames = async () => {
    const { data } = await supabase.from('games').select('*').order('created_at', { ascending: false });
    if (data) setGames(data);
  };

  const fetchUserOrders = async (telegramId) => {
    if (!telegramId) return;
    try {
      const { data: orders } = await supabase.from('product_orders').select('*').eq('telegram_id', telegramId).eq('is_offline_sale', false).order('created_at', { ascending: false });
      if (orders) setUserOrders(orders);

      const { data: sourcing } = await supabase.from('sourcing_requests').select('*').eq('telegram_id', telegramId).order('created_at', { ascending: false });
      if (sourcing) setUserSourcing(sourcing);
    } catch (e) {}
  };

  const fetchAllOrders = async () => {
    try {
      const { data } = await supabase.from('product_orders').select('*').order('created_at', { ascending: false });
      if (data) setAllOrders(data);
    } catch (e) {}
  };

  const fetchAllSourcing = async () => {
    try {
      const { data } = await supabase.from('sourcing_requests').select('*').order('created_at', { ascending: false });
      if (data) setAllSourcing(data);
    } catch (e) {}
  };

  const fetchAllVipData = async () => {
    try {
      const { data } = await supabase.from('vip_payments').select('*').order('created_at', { ascending: false });
      if (data) {
         setPendingVipRequests(data.filter(v => v.status === 'pending'));
         setApprovedVipPayments(data.filter(v => v.status === 'approved'));
      }
    } catch (e) {}
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
    if (data && data.length > 0) {
      setHasPendingVip(true);
      localStorage.setItem('goleth_pending_vip', 'true');
    } else {
      setHasPendingVip(false);
      localStorage.removeItem('goleth_pending_vip');
    }
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
      
      if (!userRecord.full_name || !userRecord.phone_number) {
         setActiveTab("ፕሮፋይል");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('goleth_user'); localStorage.removeItem('goleth_profile'); localStorage.removeItem('goleth_pending_vip');
    setCurrentUser(null); setCurrentUserProfile(null); setIsVIP(false); setVipStatus("none"); setUserPredictions({}); setHasPendingVip(false); setIsCEO(false); setShowAdmin(false); setUserOrders([]); setUserSourcing([]); setActiveTab("ሱቅ");
  };

  const saveUserProfile = async (e) => {
    e.preventDefault(); 
    const name = e.target.fullName.value; 
    
    if (!isFullNameValid(name)) {
      alert("እባክዎ ሙሉ ስም ያስገቡ (የመጀመሪያ እና የአባት ስም)");
      return;
    }
    
    if (!currentUser?.id) return; 
    setUploading(true);
    
    const phone = e.target.phone.value; 
    const loc = currentUserProfile?.region || (["USA", "Canada", "Europe", "Australia", "South America"].includes(e.target.location.value) ? 'Diaspora' : 'Local');

    try {
      const { data, error } = await supabase.from('vip_users').update({ full_name: name, phone_number: phone, region: loc }).eq('telegram_id', currentUser.id.toString()).select('*');
      if (error) throw error;
      if (data && data[0]) { 
        setCurrentUserProfile(data[0]); 
        localStorage.setItem('goleth_profile', JSON.stringify(data[0])); 
        setOrderName(name);
        setVipPhone(phone);
        alert("መረጃዎ ተስተካክሏል (Profile Updated)");
      } else {
        alert("Server validation failed. Close and try again.");
      }
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

  const addToCart = () => {
    if (!selectedProduct) return;
    const newItem = {
      product: selectedProduct,
      option: selectedOption || "N/A",
      quantity: quantity
    };
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === newItem.product.id && item.option === newItem.option);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + newItem.quantity } : item);
      }
      return [...prev, newItem];
    });
    
    setSelectedOption(null);
    setQuantity(1);
    setShowCart(true);
  };

  const updateCartItemQty = (index, delta) => {
    setCart(prev => {
      const newCart = [...prev];
      const newQty = newCart[index].quantity + delta;
      if (newQty <= 0) {
        return newCart.filter((_, idx) => idx !== index);
      }
      newCart[index].quantity = newQty;
      return newCart;
    });
  };

  const removeFromCart = (indexToRemove) => {
    setCart(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const getCartTotals = () => {
    const hasVipAccess = isVIP || includeVipSignup;
    
    let totalItemsPrice = 0;
    let vipItemsCost = 0;
    let regularItemsCost = 0;
    let vipItemsQty = 0;
    let regularItemsQty = 0;
    
    let totalItemsWeight = 0;
    const productQtyMap = {}; 
    
    cart.forEach(item => {
      const pid = item.product.id;
      if (!productQtyMap[pid]) productQtyMap[pid] = 0;
      
      const startQty = productQtyMap[pid];
      const endQty = startQty + item.quantity;
      
      for (let i = startQty + 1; i <= endQty; i++) {
        if (hasVipAccess && i <= 3) {
          const vPrice = item.product.vip_price || item.product.price;
          vipItemsCost += vPrice;
          totalItemsPrice += vPrice;
          vipItemsQty++;
        } else {
          regularItemsCost += item.product.price;
          totalItemsPrice += item.product.price;
          regularItemsQty++;
        }
      }
      
      productQtyMap[pid] = endQty;
      totalItemsWeight += (item.product.weight_kg || 1.0) * item.quantity;
    });

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const nextDayBirr = checkoutShipping === "next_day" ? 1300 : 0; 
    const vipSignupBirr = includeVipSignup ? (userRegion === "ሀገር ውስጥ" ? 300 : 1950) : 0; 
    
    return {
      itemsPrice: totalItemsPrice,
      vipItemsCost,
      regularItemsCost,
      vipItemsQty,
      regularItemsQty,
      totalWeight: totalItemsWeight,
      nextDayFee: nextDayBirr,
      vipFee: vipSignupBirr,
      finalTotal: totalItemsPrice + nextDayBirr + vipSignupBirr,
      totalQty
    };
  };

  const handleVipPaymentSubmit = async (e) => {
    e.preventDefault(); if (!currentUser?.id) return; setUploading(true);
    const receiptUrl = await uploadFileToSupabase(vipReceiptFile);
    const { error: dbError } = await supabase.from("vip_payments").insert([{ telegram_id: currentUser.id.toString(), full_name: orderName, phone_number: vipPhone, payment_type: vipPaymentType, receipt_url: receiptUrl, status: 'pending' }]);

    if (dbError) { alert("የመረጃ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።"); setUploading(false); return; }
    const adminMsg = `👑 <b>አዲስ የVIP አባልነት ክፍያ ደርሷል!</b>\n\n👤 <b>ስም:</b> ${orderName}\n📞 <b>ስልክ:</b> ${vipPhone}\n💳 <b>የክፍያ አይነት:</b> ${vipPaymentType}\n🖼️ <b>የደረሰኝ ሊንክ:</b> ${receiptUrl}`;
    const userMsg = `🎉 <b>ክፍያዎ በተሳካ ሁኔታ ደርሶናል!</b>\n\nውድ ${orderName}፣ የላኩትን የክፍያ ማረጋገጫ ተቀብለናል። ክፍያው እንደተረጋገጠ በጥቂት ሰዓታት ውስጥ የVIP አባልነትዎ ይከፈታል።`;
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: adminMsg, parse_mode: "HTML" }) });
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: currentUser.id, text: userMsg, parse_mode: "HTML" }) });
    } catch (err) {}
    setUploading(false); 
    setHasPendingVip(true); 
    localStorage.setItem('goleth_pending_vip', 'true');
    window.scrollTo(0,0); setShowSuccessModal(true);
  };

  const handleApproveVip = async (paymentId, telegramId) => {
     setUploading(true);
     const { error: pError } = await supabase.from('vip_payments').update({ status: 'approved', approved_at: new Date() }).eq('id', paymentId);
     
     const expireDate = new Date();
     expireDate.setMonth(expireDate.getMonth() + 1);

     const { error: uError } = await supabase.from('vip_users').update({ 
       is_vip: true, 
       vip_until: expireDate.toISOString() 
     }).eq('telegram_id', telegramId.toString());

     if (pError || uError) {
        alert("Error approving VIP. Please check Supabase policies.");
     } else {
        const userMsg = `🎉 <b>እንኳን ደስ አሎት!</b>\n\nየVIP አባልነትዎ አሁን ጀምሯል። ለቀጣይ አንድ ወር ልዩ ቅናሾችን ያገኛሉ። ወደ መተግበሪያው ገብተው ይጠቀሙ!`;
        try { await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: telegramId, text: userMsg, parse_mode: "HTML" }) }); } catch (err) {}
        fetchAllVipData();
        alert("VIP Approved successfully!");
     }
     setUploading(false);
  };

  const handleCartOrderSubmit = async (e) => {
    e.preventDefault(); if (!currentUser?.id || cart.length === 0) return; setUploading(true);

    const totals = getCartTotals();
    const batchIdStr = Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    let orderNotes = checkoutShipping === "next_day" ? `Next Day Shipping` : "Standard Shipping";
    if (includeVipSignup) orderNotes += ` | +VIP Signup`;
    
    let finalDeliveryAddress = orderAddress;
    if (isGift) { orderNotes += ` | 🎁 GIFT ORDER`; finalDeliveryAddress = `[GIFT FOR: ${recipientName} | Ph: ${recipientPhone}] ${recipientAddress}`; }

    const receiptUrl = orderFile ? await uploadFileToSupabase(orderFile) : "";
    const hasVipAccess = isVIP || includeVipSignup;
    const productQtyMap = {};

    const inserts = cart.map(item => {
      const pid = item.product.id;
      if (!productQtyMap[pid]) productQtyMap[pid] = 0;
      
      const startQty = productQtyMap[pid];
      const endQty = startQty + item.quantity;
      let lineItemPrice = 0;
      
      for (let i = startQty + 1; i <= endQty; i++) {
        if (hasVipAccess && i <= 3) {
          lineItemPrice += (item.product.vip_price || item.product.price);
        } else {
          lineItemPrice += item.product.price;
        }
      }
      productQtyMap[pid] = endQty;
      
      return { 
        telegram_id: currentUser.id.toString(), full_name: orderName, phone_number: vipPhone, delivery_address: finalDeliveryAddress,
        product_id: item.product.id, product_name: item.product.name, selected_option: item.option, price: lineItemPrice, 
        payment_type: userRegion, receipt_url: receiptUrl, shipping_speed: checkoutShipping, is_new_vip_signup: includeVipSignup, 
        status: 'pending', total_weight_kg: (item.product.weight_kg || 1.0) * item.quantity, order_batch_id: batchIdStr, is_offline_sale: false
      };
    });

    if (inserts.length > 0) {
       inserts[0].price += totals.nextDayFee + totals.vipFee;
    }

    const { error: dbError } = await supabase.from("product_orders").insert(inserts);

    if (dbError) { alert("የመረጃ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።"); setUploading(false); return; }

    const itemsListTxt = cart.map(i => `- ${i.product.name} (x${i.quantity}) [${i.option}]`).join("\n");
    const adminMsg = `🛍 <b>አዲስ የጋሪ ትዕዛዝ (Cart Order)!</b>\n\n👤 <b>ስም:</b> ${orderName}\n📞 <b>ስልክ:</b> ${vipPhone}\n📍 <b>አድራሻ:</b> ${finalDeliveryAddress}\n📦 <b>እቃዎች:</b>\n${itemsListTxt}\n🚚 <b>ማጓጓዣ:</b> ${checkoutShipping}\n⚖️ <b>ክብደት:</b> ${totals.totalWeight} kg\n💰 <b>ጠቅላላ ዋጋ:</b> ${totals.finalTotal} ብር\n📝 <b>Notes:</b> ${orderNotes}\n💳 <b>ክፍያ ክልል:</b> ${userRegion}\n🖼️ <b>ደረሰኝ:</b> ${receiptUrl}`;
    const userMsg = `🎉 <b>ትዕዛዝዎ ደርሶናል!</b>\n\nውድ ${orderName}፣ የላኩትን የክፍያ ማረጋገጫ ተቀብለናል። ክፍያው እንደተረጋገጠ ሂደቱ በጥቂት ሰዓታት ውስጥ ይጀምራል።`;
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: adminMsg, parse_mode: "HTML" }) });
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: currentUser.id, text: userMsg, parse_mode: "HTML" }) });
    } catch (err) {}

    if (includeVipSignup) {
       setHasPendingVip(true);
       localStorage.setItem('goleth_pending_vip', 'true');
    }

    fetchUserOrders(currentUser.id.toString());
    setUploading(false); setCart([]); setShowCart(false); setSelectedProduct(null); setIncludeVipSignup(false); setIsGift(false); setOrderFile(null); window.scrollTo(0,0); setShowSuccessModal(true);
  };

  const handleOpenOfflineSale = (product) => {
    if (product.stock_quantity < 1) return alert("ምንም እቃ የለም! (Out of stock)");
    setOfflineSaleProduct(product);
    setOfflineSaleMode("single");
    setOfflineSaleQty(1);
    setOfflineSaleCustomPrice(product.price);
    setShowOfflineSaleModal(true);
  };

  const submitOfflineSale = async () => {
    setUploading(true);
    const newStock = offlineSaleProduct.stock_quantity - offlineSaleQty;
    const finalPrice = offlineSaleMode === 'single' ? (offlineSaleProduct.price * offlineSaleQty) : Number(offlineSaleCustomPrice);
    
    const { error: stockError } = await supabase.from('products').update({ stock_quantity: newStock }).eq('id', offlineSaleProduct.id);
    if (stockError) { alert("Failed to update stock."); setUploading(false); return; }

    const { error: orderError } = await supabase.from("product_orders").insert([{
      telegram_id: currentUser?.id?.toString() || "ceo_offline", full_name: "Physical Store Sale",
      product_id: offlineSaleProduct.id, product_name: offlineSaleProduct.name,
      selected_option: offlineSaleMode === 'bulk' ? `Bulk Sale (x${offlineSaleQty})` : `Retail (x${offlineSaleQty})`,
      price: finalPrice, payment_type: "Offline/Cash", status: "arrived", is_offline_sale: true, total_weight_kg: 0
    }]);

    if (!orderError) {
      setProducts(products.map(p => p.id === offlineSaleProduct.id ? { ...p, stock_quantity: newStock } : p));
      fetchAllOrders(); 
      setShowOfflineSaleModal(false);
    } else { alert("Failed to log sale revenue."); }
    setUploading(false);
  };

  const handleOpenSourcing = () => { setReqProductName(""); setReqStoreName(""); setReqProductLink(""); setReqImage(null); setShowOrderForm(true); };

  const submitOrderForm = async (e) => {
    e.preventDefault(); if (!currentUser?.id) return;
    setUploading(true);

    const imageUrl = reqImage ? await uploadFileToSupabase(reqImage) : "";
    const extraNotes = isGift ? `\n🎁 <b>GIFT TO:</b> ${recipientName} | Ph: ${recipientPhone} | Addr: ${recipientAddress}` : "";

    const { error: dbError } = await supabase.from("sourcing_requests").insert([{
      telegram_id: currentUser.id.toString(), full_name: orderName, phone_number: vipPhone, product_name: reqProductName || null, store_name: reqStoreName || null, product_link: reqProductLink || null, image_url: imageUrl || null, shipping_speed: e.target.shipping.value, status: 'pending'
    }]);

    if (dbError) { alert("የመረጃ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።"); setUploading(false); return; }
    const message = `🛍 <b>አዲስ ልዩ የእቃ ማዘዣ!</b>\n\n👤 <b>ስም:</b> ${orderName}\n📞 <b>ስልክ:</b> ${vipPhone}\n📦 <b>የእቃው ስም:</b> ${reqProductName || "አልተገለጸም"}\n🏪 <b>የሱቁ ስም:</b> ${reqStoreName || "አልተገለጸም"}\n🔗 <b>ሊንክ:</b> ${reqProductLink || "አልተገለጸም"}\n🚚 <b>አቅርቦት:</b> ${e.target.shipping.value}${extraNotes}\n🖼️ <b>ምስል:</b> ${imageUrl || "ምንም ምስል አልተያያዘም"}`;
    try { await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" }) }); } catch (err) {}
    setUploading(false); setIsGift(false); alert("ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል!"); setShowOrderForm(false); if(activePost) window.history.back(); window.scrollTo(0,0);
  };

  const submitPrediction = async (gameId) => {
    if (!currentUser?.id) return;
    const scoreA = predictionInputs[gameId]?.a; const scoreB = predictionInputs[gameId]?.b;
    if (scoreA === undefined || scoreB === undefined || scoreA === "" || scoreB === "") return;
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
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const update = orderUpdateData[orderId] || { status: order.status, tracking: order.tracking_number || "" };

    setUploading(true);
    const payload = {};
    if (update.status) payload.status = update.status;
    if (update.tracking !== undefined) payload.tracking_number = update.tracking;

    const { data, error } = await supabase.from('product_orders').update(payload).eq('id', orderId).select();
    
    if (error) {
      alert("Database Error: " + error.message);
    } else if (!data || data.length === 0) {
      alert("Update failed! Supabase Row-Level Security (RLS) is blocking the update.");
    } else {
      alert("Order updated successfully!");
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...payload } : o));
      
      setOrderUpdateData(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
      
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
    }
    setUploading(false);
  };

  const handleUpdateSourcing = async (orderId, telegramId, productName) => {
    const order = allSourcing.find(o => o.id === orderId);
    if (!order) return;
    const update = sourcingUpdateData[orderId] || { status: order.status, weight: order.total_weight_kg || "" };
    
    setUploading(true);
    const payload = { status: update.status };
    if (update.weight !== undefined && update.weight !== "") {
       payload.total_weight_kg = Number(update.weight);
    }

    const { data, error } = await supabase.from('sourcing_requests').update(payload).eq('id', orderId).select();
    
    if (error || (!data || data.length === 0)) {
       alert("Update failed! Check RLS policies.");
    } else {
       alert("Sourcing order updated!");
       setAllSourcing(prev => prev.map(o => o.id === orderId ? { ...o, ...payload } : o));
       
       let statusAmharic = "";
       if (update.status === 'approved') statusAmharic = "ተቀባይነት አግኝቷል (Approved) ✅";
       if (update.status === 'shipped') statusAmharic = "በመንገድ ላይ ነው (Shipped) 🚚";
       if (update.status === 'arrived') statusAmharic = "እጅዎ ላይ ደርሷል (Arrived) 🎉";

       if (statusAmharic) {
          let msg = `📦 <b>የልዩ እቃ ትዕዛዝ መረጃ</b>\n\n<b>እቃ:</b> ${productName || "Custom Order"}\n<b>ሁኔታ:</b> ${statusAmharic}`;
          try { await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: telegramId, text: msg, parse_mode: "HTML" }) }); } catch (err) {}
       }
    }
    setUploading(false);
  };

  const handleLogoTap = () => { setActiveTab("ሱቅ"); if (activePost) window.history.back(); window.scrollTo(0,0); };

  const handleAddCustomSize = () => {
    if(!customSizeInput.trim()) return;
    if(!formData.options.includes(customSizeInput)) setFormData(prev => ({ ...prev, options: [...(prev.options || []), customSizeInput] }));
    if(!savedCustomSizes.includes(customSizeInput)) {
      const newSaved = [...savedCustomSizes, customSizeInput];
      setSavedCustomSizes(newSaved); localStorage.setItem('goleth_custom_sizes', JSON.stringify(newSaved));
    }
    setCustomSizeInput("");
  };

  const toggleHideCategory = (type, val) => {
    if (type === 'primary') {
      const updated = hiddenCategories.includes(val) ? hiddenCategories.filter(c => c !== val) : [...hiddenCategories, val];
      setHiddenCategories(updated); localStorage.setItem('goleth_hidden_cats', JSON.stringify(updated));
    } else {
      const updated = hiddenSubCategories.includes(val) ? hiddenSubCategories.filter(c => c !== val) : [...hiddenSubCategories, val];
      setHiddenSubCategories(updated); localStorage.setItem('goleth_hidden_subcats', JSON.stringify(updated));
    }
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

  const moveCategory = (type, index, direction) => {
    const arr = type === 'primary' ? [...customCategories] : [...(customSubCats[selectedPrimaryForSub] || [])];
    if (direction === -1 && index > 0) { [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]; } 
    else if (direction === 1 && index < arr.length - 1) { [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]; }
    
    if (type === 'primary') { 
      setCustomCategories(arr); localStorage.setItem('goleth_categories', JSON.stringify(arr)); syncCategoriesToDB(arr, customSubCats);
    } else { 
      const updated = { ...customSubCats, [selectedPrimaryForSub]: arr };
      setCustomSubCats(updated); localStorage.setItem('goleth_subcats_map', JSON.stringify(updated)); syncCategoriesToDB(customCategories, updated);
    }
  };

  const saveCategoryEdit = (type) => {
    const arr = type === 'primary' ? [...customCategories] : [...(customSubCats[selectedPrimaryForSub] || [])];
    if (type === 'primary') {
      if (editCatValue.trim()) arr[editCatIndex] = editCatValue.trim();
      setCustomCategories(arr); localStorage.setItem('goleth_categories', JSON.stringify(arr)); syncCategoriesToDB(arr, customSubCats);
      setEditCatIndex(null); setEditCatValue("");
    } else {
      if (editSubCatValue.trim()) arr[editSubCatIndex] = editSubCatValue.trim();
      const updated = { ...customSubCats, [selectedPrimaryForSub]: arr };
      setCustomSubCats(updated); localStorage.setItem('goleth_subcats_map', JSON.stringify(updated)); syncCategoriesToDB(customCategories, updated);
      setEditSubCatIndex(null); setEditSubCatValue("");
    }
  };

  const openPost = (post) => { window.history.pushState({ postId: post.id }, "", `#article-${post.id}`); setActivePost(post); };
  
  const openProduct = (prod) => { 
    window.history.pushState({ prodId: prod.id }, "", `#product-${prod.id}`); 
    setSelectedProduct(prod); setQuantity(1); setSelectedOption(null); 
  };
  
  const handleDelete = async (table, id) => { if (window.confirm("እርግጠኛ ነዎት?")) { await supabase.from(table).delete().eq("id", id); if (table === "games") fetchGames(); else fetchData(); if (activePost || selectedProduct) window.history.back(); } };
  
  const handleEdit = (type, item) => {
    setAdminTab(type); setEditId(item.id);
    if (type === "posts") {
      setFormData({ postCategory: item.category, title: item.title, subtitle: item.subtitle || "", excerpt: item.excerpt || "", body: item.body || "", author: item.author || "GOLETH", relatedLinks: item.related_links || [] });
      if (item.image_urls && item.image_urls.length > 0) { setExistingMainImage(item.image_urls[0]); setExistingInlineImages(item.image_urls.slice(1)); } else { setExistingMainImage(null); setExistingInlineImages([]); }
    } else {
      let parsedCat = []; let parsedSubCat = [];
      if (Array.isArray(item.category)) parsedCat = item.category; else if (item.category) parsedCat = [item.category];
      if (Array.isArray(item.subcategory)) parsedSubCat = item.subcategory; else if (item.subcategory) parsedSubCat = [item.subcategory];
      
      setFormData({ 
        title: item.name, price: item.price, vipPrice: item.vip_price || "", 
        shopCat: parsedCat, shopSubCat: parsedSubCat, options: item.options || [], 
        sourceUrl: item.source_link || "", description: item.description || "", isSale: item.is_sale || false,
        cadCost: item.cost_cad || 0, stockQty: item.stock_quantity || 0, weightKg: item.weight_kg || 1.0, specialFreightFee: item.special_freight_fee || ""
      });
    }
    setMainImageFile(null); setInlineImageFiles([]); setProductImageFiles([]); setSelectedMainImgIdx(0); setShowAdmin(true);
  };
  
  const openNewPost = (type) => { 
    setAdminTab(type); 
    setEditId(null); 
    setFormData({ 
      options: [], relatedLinks: [], author: "GOLETH", isSale: false, shopCat: [], shopSubCat: [], stockQty: 0, cadCost: 0
    }); 
    setExistingMainImage(null); setExistingInlineImages([]); setMainImageFile(null); setInlineImageFiles([]); setProductImageFiles([]); setSelectedMainImgIdx(0); 
    if (type === 'orders') fetchAllOrders();
    if (type === 'sourcing') fetchAllSourcing();
    if (type === 'vip') fetchAllVipData();
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
      
      if (editId) { await supabase.from("posts").update(payload).eq("id", editId); } 
      else { await supabase.from("posts").insert([payload]); }
    } else if (adminTab === "products") {
      let filesToUpload = [...productImageFiles];
      if (filesToUpload.length > 1 && selectedMainImgIdx > 0 && selectedMainImgIdx < filesToUpload.length) { const main = filesToUpload.splice(selectedMainImgIdx, 1)[0]; filesToUpload.unshift(main); }
      if (filesToUpload.length > 0) { for (const file of filesToUpload) { const prodUrl = await uploadFileToSupabase(file); if (prodUrl) finalUrls.push(prodUrl); } }
      
      const payload = { 
        name: formData.title, price: Number(formData.price), vip_price: formData.vipPrice ? Number(formData.vipPrice) : null, 
        category: formData.shopCat, subcategory: formData.shopSubCat, options: formData.options, 
        source_link: formData.sourceUrl || null, description: formData.description || null, is_sale: formData.isSale || false,
        cost_cad: Number(formData.cadCost), stock_quantity: Number(formData.stockQty), weight_kg: Number(formData.weightKg), special_freight_fee: formData.specialFreightFee ? Number(formData.specialFreightFee) : null
      };
      if (finalUrls.length > 0) payload.image_urls = finalUrls;
      
      if (editId) { await supabase.from("products").update(payload).eq("id", editId); } 
      else { await supabase.from("products").insert([payload]); }
    }
    setFormData({ options: [], relatedLinks: [], isSale: false, shopCat: [], shopSubCat: [] }); setMainImageFile(null); setInlineImageFiles([]); setProductImageFiles([]); setExistingMainImage(null); setExistingInlineImages([]); setEditId(null); setSelectedMainImgIdx(0); setUploading(false); setShowAdmin(false); setShowSizeDropdown(false); setExpandedOptionCategories({}); fetchData(); alert("በተሳካ ሁኔታ ተጠናቋል!");
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

  const getStatusBadge = (status) => {
    switch (status) {
       case 'pending': return <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-[10px] font-black uppercase">Pending</span>;
       case 'approved': return <span className="bg-blue-900/50 text-blue-400 border border-blue-900 px-2 py-1 rounded text-[10px] font-black uppercase">Approved</span>;
       case 'shipped': return <span className="bg-amber-500/20 text-amber-500 border border-amber-500/50 px-2 py-1 rounded text-[10px] font-black uppercase">Shipped</span>;
       case 'arrived': return <span className="bg-green-900/50 text-green-400 border border-green-900 px-2 py-1 rounded text-[10px] font-black uppercase">Arrived</span>;
       default: return <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-[10px] font-black uppercase">{status || 'Pending'}</span>;
    }
  };

  const renderProfilePage = () => {
    const isRegionLocked = !!currentUserProfile?.region;

    return (
      <div className="pb-24 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-3xl font-black text-amber-500 flex items-center"><User className="mr-3 text-amber-500" size={32}/> የኔ ፕሮፋይል (Profile)</h2>
        </div>

        {isCEO && (
           <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/30 p-5 rounded-2xl mb-8 shadow-lg text-white">
              <h3 className="font-black text-lg uppercase tracking-widest mb-1 text-amber-500">CEO Admin Badge</h3>
              <p className="font-bold text-sm opacity-90">{currentUserProfile?.full_name}</p>
           </div>
        )}

        {isVIP && !isCEO && (
           <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 p-6 rounded-2xl mb-8 shadow-[0_0_30px_rgba(245,158,11,0.2)] text-black relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20"><Target size={80}/></div>
              <h3 className="font-black text-xl uppercase tracking-widest mb-1 relative z-10">Goleth VIP Member</h3>
              <p className="font-bold text-base opacity-90 mb-6 relative z-10">{currentUserProfile?.full_name}</p>
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

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8 shadow-2xl relative">
          <h2 className="text-xl font-black text-white mb-2 mt-2">የግል መረጃ ማስተካከያ</h2>
          <p className="text-zinc-400 text-xs mb-6">ለፈጣን አገልግሎት እባክዎ መረጃዎን በትክክል ያስገቡ።</p>
          <form onSubmit={saveUserProfile} className="space-y-4">
            <input required name="fullName" defaultValue={currentUserProfile?.full_name || ""} placeholder="ሙሉ ስም (የመጀመሪያ እና የአባት ስም ክፍተት በማድረግ ይጻፉ)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none" onChange={(e) => { e.target.setCustomValidity(isFullNameValid(e.target.value) ? '' : 'እባክዎ ሙሉ ስም ያስገቡ (የመጀመሪያ እና የአባት ስም)') }} />
            <input required name="phone" type="tel" maxLength="10" pattern="[0-9]{10}" defaultValue={currentUserProfile?.phone_number || ""} placeholder="ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none font-mono" />
            
            <div className="relative">
              <select required name="location" disabled={isRegionLocked} defaultValue={currentUserProfile?.region === 'Diaspora' ? 'USA' : (currentUserProfile?.region === 'Local' ? 'Ethiopia' : '')} className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">የት ሀገር ነዎት? (Location)</option>
                <option value="Ethiopia">Ethiopia (ኢትዮጵያ) - Local</option>
                <option value="USA">USA - Diaspora</option>
                <option value="Canada">Canada - Diaspora</option>
                <option value="Europe">Europe - Diaspora</option>
                <option value="Australia">Australia - Diaspora</option>
              </select>
              {isRegionLocked && <p className="text-[10px] text-amber-500 mt-1">Location is locked for pricing accuracy. Contact support to change.</p>}
            </div>

            <button type="submit" disabled={uploading} className="w-full bg-amber-500 disabled:bg-zinc-800 hover:bg-amber-400 text-black font-black py-4 rounded-xl shadow-lg transition-colors mt-4">
              {uploading ? "በማስቀመጥ ላይ..." : "አስቀምጥ (Save Details)"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
           <div>
             <h3 className="font-bold text-amber-500 text-sm uppercase tracking-wider mb-4 flex items-center"><Package className="mr-2" size={16}/> መደበኛ ትዕዛዞች (Orders)</h3>
             {userOrders.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">ምንም ትዕዛዝ የለም (No orders yet).</p>
             ) : (
                <div className="space-y-3">
                   {userOrders.map(order => (
                      <div key={order.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                         <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white text-base line-clamp-1 flex-1 pr-2">{order.product_name}</h4>
                            {getStatusBadge(order.status)}
                         </div>
                         <p className="text-xs text-zinc-500 mb-2">{new Date(order.created_at).toLocaleDateString()}</p>
                         {order.tracking_number && (
                            <div className="mt-3 bg-black border border-amber-500/20 p-3 rounded-xl">
                               <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">Tracking Number</p>
                               <p className="font-mono text-white text-sm font-bold">{order.tracking_number}</p>
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             )}
           </div>

           <div>
             <h3 className="font-bold text-[#2AABEE] text-sm uppercase tracking-wider mb-4 flex items-center"><PlusCircle className="mr-2" size={16}/> ልዩ ትዕዛዞች (Sourcing)</h3>
             {userSourcing.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">ምንም ልዩ ትዕዛዝ የለም.</p>
             ) : (
                <div className="space-y-3">
                   {userSourcing.map(order => (
                      <div key={order.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                         <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white text-base line-clamp-1 flex-1 pr-2">{order.product_name || order.store_name || "Custom Order"}</h4>
                            {getStatusBadge(order.status)}
                         </div>
                         <p className="text-xs text-zinc-500 mb-2">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                   ))}
                </div>
             )}
           </div>
        </div>

        <button onClick={handleLogout} className="mt-12 w-full py-4 bg-red-900/20 text-red-500 border border-red-900/50 rounded-xl font-bold flex items-center justify-center hover:bg-red-900/40 transition-colors">
           <LogOut size={16} className="mr-2"/> ዘግተህ ውጣ (Sign Out)
        </button>
      </div>
    );
  };

  const renderOfflineSaleModal = () => {
    if (!showOfflineSaleModal || !offlineSaleProduct) return null;
    return (
      <div className="fixed inset-0 bg-black/95 z-[90] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
        <div className="bg-zinc-900 border border-amber-500/50 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
          <button onClick={() => setShowOfflineSaleModal(false)} className="absolute top-4 right-4 bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors"><X className="text-white w-5 h-5" /></button>
          <h2 className="text-xl font-black text-amber-500 mb-2">Log Store Sale</h2>
          <p className="text-white text-sm font-bold mb-4">{offlineSaleProduct.name}</p>
          
          <div className="flex space-x-2 mb-6">
            <button onClick={() => { setOfflineSaleMode("single"); setOfflineSaleCustomPrice(offlineSaleProduct.price); }} className={`flex-1 py-2 rounded-lg font-bold text-sm border ${offlineSaleMode === "single" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-700"}`}>Retail Sale</button>
            <button onClick={() => { setOfflineSaleMode("bulk"); setOfflineSaleCustomPrice(""); }} className={`flex-1 py-2 rounded-lg font-bold text-sm border ${offlineSaleMode === "bulk" ? "bg-amber-500 text-black border-amber-500" : "bg-black text-zinc-400 border-zinc-700"}`}>Bulk/Custom Sale</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">Quantity Sold (Units)</label>
              <input type="number" min="1" max={offlineSaleProduct.stock_quantity} value={offlineSaleQty} onChange={(e) => setOfflineSaleQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none" />
              <p className="text-[10px] text-zinc-500 mt-1">Available stock: {Math.max(0, offlineSaleProduct.stock_quantity)}</p>
            </div>
            
            {offlineSaleMode === 'bulk' && (
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1">Total Revenue Collected (Birr)</label>
                <input type="number" value={offlineSaleCustomPrice} onChange={(e) => setOfflineSaleCustomPrice(e.target.value)} placeholder="e.g. 4500" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none font-mono" />
              </div>
            )}
            
            {offlineSaleMode === 'single' && (
              <div className="bg-black p-3 rounded-xl border border-zinc-800">
                <p className="text-xs text-zinc-400 font-bold">Auto-calculated Revenue</p>
                <p className="text-lg font-black text-white">{offlineSaleProduct.price * offlineSaleQty} Birr</p>
              </div>
            )}
            
            <button onClick={submitOfflineSale} disabled={uploading || (offlineSaleMode === 'bulk' && !offlineSaleCustomPrice)} className="w-full bg-amber-500 disabled:bg-zinc-800 text-black font-black py-4 rounded-xl shadow-lg mt-2 transition-colors">
              {uploading ? "Logging..." : "Confirm Sale"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCartSlideOver = () => {
    const isReadyToCheckout = isFullNameValid(orderName) && vipPhone.length === 10 && orderFile;
    const totals = getCartTotals();
    const hasVipAccess = isVIP || isCEO;

    return (
      <div className="fixed inset-0 z-[80] flex justify-end">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)}></div>
        <div className="relative w-full max-w-sm bg-zinc-950 h-full overflow-y-auto border-l border-zinc-800 animate-in slide-in-from-right duration-300 flex flex-col">
          <div className="p-6 pb-4 border-b border-zinc-900 sticky top-0 bg-zinc-950 z-10 flex justify-between items-center">
            <h2 className="text-xl font-black text-white flex items-center"><ShoppingCart className="mr-2 text-amber-500" size={24}/> ጋሪዎ (Cart)</h2>
            <button onClick={() => setShowCart(false)} className="bg-zinc-900 p-2 rounded-full hover:bg-zinc-800 transition-colors"><X size={20}/></button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto pb-32">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="mx-auto text-zinc-700 w-16 h-16 mb-4" />
                <p className="text-zinc-500 font-bold">ጋሪዎ ባዶ ነው</p>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {cart.map((item, index) => (
                  <div key={index} className="bg-black border border-zinc-800 rounded-xl p-3 flex gap-3 relative shadow-md">
                    <button onClick={() => removeFromCart(index)} className="absolute -top-2 -right-2 bg-red-900/50 text-red-500 p-1.5 rounded-full hover:bg-red-900 z-10"><X size={14}/></button>
                    {item.product.image_urls && item.product.image_urls[0] ? (
                      <img src={item.product.image_urls[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg bg-white shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-zinc-900 rounded-lg flex items-center justify-center text-[10px] text-zinc-500 font-bold shrink-0">ምስል የለም</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-bold truncate pr-4">{item.product.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-bold mt-0.5">አማራጭ: <span className="text-amber-500">{item.option}</span></p>
                      <div className="mt-2 flex justify-between items-center">
                         <div className="flex items-center space-x-2 bg-zinc-900 rounded-lg p-1 border border-zinc-700">
                           <button onClick={() => updateCartItemQty(index, -1)} className="text-white hover:text-amber-500 px-2 py-0.5">-</button>
                           <span className="font-bold text-sm w-4 text-center text-amber-500">{item.quantity}</span>
                           <button onClick={() => updateCartItemQty(index, 1)} className="text-white hover:text-amber-500 px-2 py-0.5">+</button>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="text-white font-black text-sm uppercase tracking-widest border-b border-zinc-900 pb-2 mb-2 flex items-center">
                  የእርስዎ መረጃ
                  {hasVipAccess && <span className="ml-2 bg-amber-500 text-black px-2 py-0.5 rounded-full text-[9px] font-black tracking-normal">VIP Member</span>}
                </h3>

                {!currentUser ? (
                  <div className="text-center bg-zinc-900 p-6 rounded-2xl border border-amber-500/30">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 mx-auto"><Users className="text-amber-500 w-6 h-6" /></div>
                    <h3 className="text-white font-black mb-2 text-sm">ለመግዛት ይግቡ</h3>
                    <div ref={telegramCheckoutRef} className="flex justify-center min-h-[50px]"></div>
                  </div>
                ) : (
                  <form onSubmit={handleCartOrderSubmit} className="space-y-3">
                    {!hasVipAccess && (
                      <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-start space-x-3 mb-4">
                        <input type="checkbox" id="vipUpsell" checked={includeVipSignup} onChange={e => setIncludeVipSignup(e.target.checked)} className="mt-1 w-5 h-5 accent-amber-500 cursor-pointer" />
                        <label htmlFor="vipUpsell" className="text-sm text-zinc-200 cursor-pointer">
                          <span className="font-bold text-amber-500 block">የ VIP ቅናሽ አሁን ያግኙ! (+ {userRegion === 'ዳያስፖራ' ? '1950 ብር ($15)' : '300 ብር'})</span>
                          በየእቃው ላይ ያለውን የVIP ቅናሽ (ለእያንዳንዱ እቃ እስከ 3 ብዛት) ለማግኘት ይህን ይምረጡ።
                        </label>
                      </div>
                    )}

                    <input required value={orderName} onChange={(e) => setOrderName(e.target.value)} placeholder="ሙሉ ስም (የመጀመሪያ እና የአባት ስም ክፍተት በማድረግ ይጻፉ)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm" onChange={(e) => { setOrderName(e.target.value); e.target.setCustomValidity(isFullNameValid(e.target.value) ? '' : 'እባክዎ ሙሉ ስም ያስገቡ (የመጀመሪያ እና የአባት ስም)'); }} />
                    <input required type="tel" maxLength="10" pattern="[0-9]{10}" value={vipPhone} onChange={e => setVipPhone(e.target.value.replace(/\D/g, ""))} placeholder="ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm font-mono" />
                    <textarea required value={orderAddress} onChange={(e) => setOrderAddress(e.target.value)} rows="2" placeholder="የማድረሻ አድራሻ (ከተማ፣ ሰፈር፣ ልዩ ቦታ)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm"></textarea>

                    <label className="flex items-center space-x-3 text-zinc-300 mt-2 bg-black p-3 rounded-xl border border-zinc-800 cursor-pointer">
                      <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} className="w-5 h-5 accent-amber-500 cursor-pointer" />
                      <span className="font-bold text-sm">ይህ ዕቃ ስጦታ ነው?</span>
                    </label>

                    {isGift && (
                      <div className="p-3 bg-zinc-900 border border-amber-500/30 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2">
                        <h4 className="text-amber-500 font-bold text-[10px] uppercase tracking-wider mb-1">የተቀባዩ መረጃ</h4>
                        <input required value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="የተቀባዩ ሙሉ ስም" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm" />
                        <input required type="tel" maxLength="10" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value.replace(/\D/g, ""))} placeholder="የተቀባዩ ስልክ ቁጥር (10 አሃዝ)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm font-mono" />
                        <textarea required value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} rows="2" placeholder="የተቀባዩ ሙሉ አድራሻ (ከተማ, ሰፈር)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm"></textarea>
                      </div>
                    )}

                    <select required value={checkoutShipping} onChange={(e) => setCheckoutShipping(e.target.value)} className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm font-bold mt-2">
                      <option value="standard">ከ3-5 የስራ ቀናት (መደበኛ ማጓጓዣ)</option>
                      <option value="next_day">በሚቀጥለው ቀን (+1300 ብር አስቸኳይ)</option>
                    </select>

                    <div className="bg-black p-3 rounded-xl border border-zinc-800 text-sm mt-4 mb-4">
                       <h4 className="text-amber-500 font-black mb-2 border-b border-zinc-800 pb-2">የክፍያ ዝርዝር (Payment Details)</h4>
                       
                       {(isVIP || includeVipSignup) ? (
                         <>
                           <div className="flex justify-between mb-1"><span className="text-amber-500">የVIP እቃዎች (x{totals.vipItemsQty}):</span> <span className="text-amber-500 font-bold">{totals.vipItemsCost} ብር</span></div>
                           {totals.regularItemsQty > 0 && <div className="flex justify-between mb-1"><span className="text-zinc-400">መደበኛ እቃዎች (x{totals.regularItemsQty}):</span> <span className="text-white font-bold">{totals.regularItemsCost} ብር</span></div>}
                           <div className="text-[11px] text-black font-bold bg-amber-500 p-2 rounded-md mt-2 mb-2 leading-snug">💡 የVIP ቅናሽ ለመጀመሪያዎቹ 3 እቃዎች ብቻ በራሱ ጊዜ ታስቧል (የተቀረው በመደበኛ ዋጋ ይታሰባል)።</div>
                         </>
                       ) : (
                         <div className="flex justify-between mb-1"><span className="text-zinc-400">የእቃዎች ዋጋ (x{totals.totalQty}):</span> <span className="text-white font-bold">{totals.itemsPrice} ብር</span></div>
                       )}

                       {totals.nextDayFee > 0 && <div className="flex justify-between mb-1"><span className="text-zinc-400">አስቸኳይ ማጓጓዣ:</span> <span className="text-white font-bold">+ {totals.nextDayFee} ብር</span></div>}
                       {totals.vipFee > 0 && <div className="flex justify-between mb-1"><span className="text-amber-500">VIP አባልነት:</span> <span className="text-amber-500 font-bold">+ {totals.vipFee} ብር</span></div>}
                       
                       <div className="flex justify-between mt-2 pt-2 border-t border-zinc-800">
                         <span className="text-white font-black">ጠቅላላ ክፍያ:</span>
                         <span className="text-amber-500 font-black text-lg">{totals.finalTotal} ብር</span>
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
                    
                    {!isReadyToCheckout && <p className="text-red-500 text-xs text-center font-bold">እባክዎ ሙሉ ስም እና ትክክለኛ መረጃ ያስገቡ።</p>}
                    
                    <button type="submit" disabled={uploading || !isReadyToCheckout} className="w-full bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black py-4 rounded-xl text-base shadow-lg transition-colors mt-2">
                      {uploading ? "በመላክ ላይ..." : "ይዘዙ (Checkout)"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAdmin = () => {
    
    // BADGES LOGIC
    const pendingOrdersCount = allOrders.filter(o => o.status === 'pending' && !o.is_offline_sale).length;
    const pendingSourcingCount = allSourcing.filter(o => o.status === 'pending').length;
    const pendingVipCount = pendingVipRequests.length;
    
    // MENU CONFIG
    const adminMenu = [
      { id: "overview", label: "Overview", icon: LayoutDashboard, badge: 0 },
      { id: "orders", label: "Orders", icon: Package, badge: pendingOrdersCount },
      { id: "sourcing", label: "Sourcing", icon: PlusCircle, badge: pendingSourcingCount },
      { id: "vip", label: "VIP", icon: Target, badge: pendingVipCount },
      { id: "products", label: "Products", icon: ShoppingBag, badge: 0 },
      { id: "posts", label: "Articles", icon: FileText, badge: 0 },
      { id: "games", label: "Games", icon: Trophy, badge: 0 },
      { id: "categories", label: "Categories", icon: Settings, badge: 0 }
    ];

    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex flex-col animate-in fade-in duration-200">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-zinc-900 bg-black sticky top-0 z-10 shrink-0">
          <h2 className="text-amber-500 font-black text-2xl tracking-wide flex items-center">
            {editId ? "Edit Listing" : <><LayoutDashboard className="mr-2" /> CEO Dashboard</>}
          </h2>
          <button onClick={() => { setShowAdmin(false); setEditId(null); setExpandedOptionCategories({}); }} className="bg-zinc-900 hover:bg-zinc-800 p-2 rounded-full transition-colors"><X className="text-white w-6 h-6" /></button>
        </div>

        {!editId && (
          <div className="bg-black border-b border-zinc-900 shadow-xl z-10 shrink-0">
            <div className="flex overflow-x-auto no-scrollbar p-3 px-6 gap-3">
              {adminMenu.map((tab) => {
                const Icon = tab.icon;
                const isActive = adminTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => { setAdminTab(tab.id); if(tab.id !== 'overview') openNewPost(tab.id); }} className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center shrink-0 border ${isActive ? "bg-amber-500 text-black border-amber-500 shadow-lg" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"}`}>
                    <Icon size={16} className="mr-2" /> {tab.label}
                    {tab.badge > 0 && <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-black ${isActive ? 'bg-red-600 text-white' : 'bg-red-500/20 text-red-500'}`}>{tab.badge}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 pt-4 pb-32">
          {adminTab === "overview" && !editId && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-lg mb-2">
                 <div className="flex justify-between items-end mb-4">
                    <h3 className="text-amber-500 font-black text-lg flex items-center"><Plane className="mr-2" size={20}/> Flight Batching</h3>
                    <p className="text-zinc-400 font-bold text-sm">{totalBatchWeight.toFixed(2)} kg / 1.00 kg</p>
                 </div>
                 
                 <div className="w-full bg-black rounded-full h-4 border border-zinc-800 overflow-hidden mb-3">
                    <div className={`h-full transition-all duration-500 ${flightBatchPercentage >= 100 ? 'bg-green-500' : 'bg-amber-500'}`} style={{width: `${flightBatchPercentage}%`}}></div>
                 </div>
                 
                 {flightBatchPercentage >= 100 ? (
                    <div className="bg-green-500/20 text-green-400 p-3 rounded-lg text-sm font-black text-center border border-green-500/30">✅ Minimum weight reached! Ready to ship.</div>
                 ) : (
                    <p className="text-zinc-500 text-xs text-center">You need {(1.0 - totalBatchWeight).toFixed(2)}kg more to fill the bag.</p>
                 )}
              </div>

              <h3 className="text-amber-500 font-bold mb-2 mt-4">Product Metrics</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                 <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center shadow-lg">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Realized Cash (Sales)</p>
                    <p className="text-amber-500 font-black text-lg">{totalRevenue.toLocaleString()} ብር</p>
                 </div>
                 <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center shadow-lg">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Prize Pool (3%)</p>
                    <p className="text-[#2AABEE] font-black text-lg">{prizePool.toLocaleString()} ብር</p>
                 </div>
                 <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center shadow-lg">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Trapped Capital (Stock)</p>
                    <p className="text-white font-black text-lg">${inventoryAssetValueCad.toLocaleString()} CAD</p>
                 </div>
                 <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center shadow-lg">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Active Local Stock</p>
                    <p className="text-white font-black text-lg">{activeLocalStock} Items</p>
                 </div>
              </div>

              <h3 className="text-amber-500 font-bold mb-2 mt-6">VIP Membership Revenue</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                 <div className="bg-zinc-900 border border-amber-500/30 p-4 rounded-xl text-center shadow-lg">
                    <p className="text-[10px] text-amber-500 font-bold uppercase mb-1">Local VIP (ሀገር ውስጥ)</p>
                    <p className="text-white font-black text-lg">{localVipRevenue.toLocaleString()} ብር</p>
                    <p className="text-[10px] text-zinc-500 mt-1">From {approvedVipPayments.filter(v => v.payment_type === 'ሀገር ውስጥ').length} members</p>
                 </div>
                 <div className="bg-zinc-900 border border-amber-500/30 p-4 rounded-xl text-center shadow-lg">
                    <p className="text-[10px] text-amber-500 font-bold uppercase mb-1">Diaspora VIP (ዳያስፖራ)</p>
                    <p className="text-white font-black text-lg">{diasporaVipRevenue.toLocaleString()} ብር</p>
                    <p className="text-[10px] text-zinc-500 mt-1">From {approvedVipPayments.filter(v => v.payment_type === 'ዳያስፖራ').length} members</p>
                 </div>
              </div>

              <button onClick={() => setShowFinancialDetails(!showFinancialDetails)} className="w-full bg-black border border-zinc-800 text-zinc-400 py-3 rounded-xl font-bold text-sm flex items-center justify-center hover:text-white transition-colors">
                 <List size={16} className="mr-2" /> {showFinancialDetails ? "Hide" : "🔍 የሒሳብ ዝርዝር (View Details)"}
              </button>

              {showFinancialDetails && (
                 <div className="bg-black border border-zinc-800 p-4 rounded-xl space-y-6 animate-in slide-in-from-top-2">
                    <div>
                      <h4 className="text-amber-500 font-bold text-sm border-b border-zinc-800 pb-2 mb-3">📦 Trapped Capital Breakdown</h4>
                      {products.filter(p => p.stock_quantity > 0).length === 0 ? <p className="text-xs text-zinc-500">No stock trapped.</p> : (
                         <ul className="space-y-2">
                           {products.filter(p => p.stock_quantity > 0).map(p => (
                              <li key={p.id} className="flex justify-between text-xs">
                                <span className="text-zinc-300 truncate w-48">{p.name} (x{p.stock_quantity})</span>
                                <span className="text-white font-mono">${(p.stock_quantity * p.cost_cad).toFixed(2)} CAD</span>
                              </li>
                           ))}
                         </ul>
                      )}
                    </div>
                    <div>
                      <h4 className="text-green-500 font-bold text-sm border-b border-zinc-800 pb-2 mb-3">💰 Realized Cash Breakdown</h4>
                      {onlineOrdersArr.length === 0 && offlineOrdersArr.length === 0 ? <p className="text-xs text-zinc-500">No realized sales yet.</p> : (
                         <ul className="space-y-2">
                           {offlineOrdersArr.map(o => (
                              <li key={o.id} className="flex justify-between text-xs">
                                <span className="text-blue-300 truncate w-48">[POS] {o.product_name}</span>
                                <span className="text-white font-mono">{o.price} ብር</span>
                              </li>
                           ))}
                           {onlineOrdersArr.map(o => (
                              <li key={o.id} className="flex justify-between text-xs">
                                <span className="text-zinc-300 truncate w-48">[APP] {o.product_name}</span>
                                <span className="text-white font-mono">{o.price} ብር</span>
                              </li>
                           ))}
                         </ul>
                      )}
                    </div>
                 </div>
              )}

              <div className="bg-zinc-900 border border-amber-500/50 p-4 rounded-xl shadow-lg flex items-center justify-between mt-4">
                 <div>
                   <p className="text-xs text-amber-500 font-bold uppercase mb-1">Marketing & Startup Expenses</p>
                   <p className="text-[10px] text-zinc-400">Budget Limit: $500</p>
                 </div>
                 <div className="flex items-center space-x-2">
                   <span className="text-zinc-500 font-bold">$</span>
                   <input 
                     type="number" 
                     value={startupExpenses} 
                     onChange={(e) => handleUpdateExpenses(e.target.value)} 
                     className="bg-black text-white font-black text-lg text-center w-20 rounded-lg border border-zinc-700 py-2 focus:border-amber-500 outline-none"
                   />
                 </div>
              </div>
            </div>
          )}

          {adminTab === "vip" && (
             <div className="space-y-6">
                {pendingVipRequests.length === 0 && <p className="text-zinc-500 text-sm">No pending VIP requests.</p>}
                {pendingVipRequests.map(req => (
                   <div key={req.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col space-y-3 shadow-lg relative">
                      <p className="text-white font-bold">{req.full_name}</p>
                      <p className="text-xs text-zinc-400">Phone: <span className="font-mono text-white">{req.phone_number}</span></p>
                      <p className="text-xs text-zinc-400">Type: <span className="text-amber-500">{req.payment_type}</span></p>
                      <p className="text-[10px] text-zinc-500">{new Date(req.created_at).toLocaleString()}</p>
                      
                      {req.receipt_url && (
                         <a href={req.receipt_url} target="_blank" rel="noreferrer" className="block text-center bg-black border border-zinc-700 py-2 rounded-lg text-xs font-bold text-[#2AABEE] hover:bg-zinc-800">
                            View Receipt Image
                         </a>
                      )}

                      <button onClick={() => handleApproveVip(req.id, req.telegram_id)} disabled={uploading} className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors">
                         Approve & Grant VIP
                      </button>
                   </div>
                ))}
             </div>
          )}

          {adminTab === "orders" && (
             <div className="space-y-6">
                {allOrders.filter(o => o.status !== 'arrived').length === 0 && <p className="text-zinc-500 text-sm">No active orders found. (Arrived orders are hidden).</p>}
                
                {allOrders.filter(o => o.status !== 'arrived').map(order => {
                   const currentUpdate = orderUpdateData[order.id] || { status: order.status, tracking: order.tracking_number || "" };
                   
                   return (
                   <div key={order.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col space-y-3 shadow-lg relative overflow-hidden">
                      {order.is_offline_sale && <div className="absolute top-0 right-0 bg-blue-900/50 text-blue-300 text-[9px] font-black px-2 py-1 rounded-bl-lg border-b border-l border-blue-800/50">OFFLINE SALE</div>}
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-white font-bold text-sm">{order.full_name}</p>
                            <p className="text-amber-500 font-black text-sm">{order.product_name} <span className="text-zinc-500 font-normal text-xs">({order.selected_option})</span></p>
                            {order.total_weight_kg > 0 && <p className="text-[10px] text-zinc-400 mt-1">Weight: <span className={order.total_weight_kg < 1 ? "text-red-500 font-bold" : "text-white"}>{order.total_weight_kg} kg</span></p>}
                            {order.order_batch_id && <p className="text-[10px] text-zinc-600 font-mono mt-1">Batch: {order.order_batch_id}</p>}
                         </div>
                         <div className="text-right flex flex-col items-end">
                            {getStatusBadge(order.status)}
                            <p className="text-[10px] text-zinc-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                         </div>
                      </div>
                      
                      {!order.is_offline_sale && (
                        <div className="bg-black p-3 rounded-lg border border-zinc-800 space-y-3">
                           <div>
                              <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Update Status</label>
                              <select value={currentUpdate.status} onChange={(e) => setOrderUpdateData({...orderUpdateData, [order.id]: {...currentUpdate, status: e.target.value}})} className="w-full bg-zinc-900 border border-zinc-700 text-white p-2 rounded-lg text-xs outline-none focus:border-amber-500">
                                 <option value="pending">Pending (በሂደት ላይ)</option>
                                 <option value="approved">Approved (ተቀባይነት አግኝቷል - Adds to Batch)</option>
                                 <option value="shipped">Shipped (በመንገድ ላይ ነው)</option>
                                 <option value="arrived">Arrived (ደርሷል - Hides from view)</option>
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
                      )}
                   </div>
                )})}
             </div>
          )}

          {adminTab === "sourcing" && (
             <div className="space-y-6">
                {allSourcing.filter(o => o.status !== 'arrived').length === 0 && <p className="text-zinc-500 text-sm">No active sourcing orders found. (Arrived orders are hidden).</p>}
                
                {allSourcing.filter(o => o.status !== 'arrived').map(order => {
                   const currentUpdate = sourcingUpdateData[order.id] || { status: order.status, weight: order.total_weight_kg || "" };
                   return (
                   <div key={order.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col space-y-3 shadow-lg">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-white font-bold text-sm">{order.full_name}</p>
                            <p className="text-[#2AABEE] font-black text-sm">{order.product_name || "Custom Order"}</p>
                            <p className="text-xs text-zinc-400 mt-1">Store: <span className="text-white">{order.store_name || "N/A"}</span></p>
                            {order.total_weight_kg > 0 && <p className="text-[10px] text-zinc-400 mt-1">Weight: <span className="text-white">{order.total_weight_kg} kg</span></p>}
                            {order.product_link && <a href={order.product_link} target="_blank" rel="noreferrer" className="text-[10px] text-amber-500 underline mt-1 block truncate w-48">Link</a>}
                         </div>
                         <div className="text-right flex flex-col items-end">
                            {getStatusBadge(order.status)}
                            <p className="text-[10px] text-zinc-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                         </div>
                      </div>

                      {order.image_url && (
                         <a href={order.image_url} target="_blank" rel="noreferrer" className="block text-center bg-black border border-zinc-700 py-2 rounded-lg text-xs font-bold text-[#2AABEE] hover:bg-zinc-800">
                            View Sourcing Image
                         </a>
                      )}
                      
                      <div className="bg-black p-3 rounded-lg border border-zinc-800 space-y-3">
                         <div>
                            <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Update Status</label>
                            <select value={currentUpdate.status} onChange={(e) => setSourcingUpdateData({...sourcingUpdateData, [order.id]: {...currentUpdate, status: e.target.value}})} className="w-full bg-zinc-900 border border-zinc-700 text-white p-2 rounded-lg text-xs outline-none focus:border-amber-500">
                               <option value="pending">Pending (በሂደት ላይ)</option>
                               <option value="approved">Approved (ተቀባይነት አግኝቷል - Adds to Batch)</option>
                               <option value="shipped">Shipped (በመንገድ ላይ ነው)</option>
                               <option value="arrived">Arrived (ደርሷል - Hides from view)</option>
                            </select>
                         </div>
                         
                         {currentUpdate.status === 'approved' && (
                            <div>
                               <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Set Weight (For Flight Batch)</label>
                               <input type="number" step="0.1" value={currentUpdate.weight} onChange={(e) => setSourcingUpdateData({...sourcingUpdateData, [order.id]: {...currentUpdate, weight: e.target.value}})} placeholder="e.g. 0.5" className="w-full bg-zinc-900 border border-amber-500/50 text-white p-2 rounded-lg text-xs outline-none focus:border-amber-500" />
                            </div>
                         )}

                         <button onClick={() => handleUpdateSourcing(order.id, order.telegram_id, order.product_name)} disabled={uploading || (currentUpdate.status === 'approved' && !currentUpdate.weight)} className="w-full bg-[#2AABEE] disabled:bg-zinc-800 text-white font-bold py-2 rounded-lg text-xs hover:bg-[#229ED9] transition-colors">
                            Update & Notify User
                         </button>
                      </div>
                   </div>
                )})}
             </div>
          )}

          {adminTab === "categories" && (
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                 <h3 className="text-amber-500 font-bold mb-4">ዋና ምድቦች (Primary Categories)</h3>
                 <div className="flex space-x-2 mb-4">
                   <input type="text" value={newCatInput} onChange={e => setNewCatInput(e.target.value)} placeholder="Add new primary..." className="flex-1 bg-black border border-zinc-700 text-white p-3 rounded-xl focus:border-amber-500 outline-none text-sm" />
                   <button onClick={() => addCategory('primary')} className="bg-amber-500 text-black px-4 py-3 rounded-xl font-bold hover:bg-amber-400">Add</button>
                 </div>
                 <div className="flex flex-col gap-2">
                   {customCategories.map((c, index) => {
                     const isHidden = hiddenCategories.includes(c);
                     return (
                     <div key={`prim_${c}`} className="bg-zinc-800 text-white px-3 py-2 rounded-lg flex items-center justify-between text-sm">
                       {editCatIndex === index ? (
                         <input autoFocus type="text" value={editCatValue} onChange={e => setEditCatValue(e.target.value)} onBlur={() => saveCategoryEdit('primary')} className="bg-black border border-amber-500 text-white px-2 py-1 rounded w-1/2 outline-none" />
                       ) : (
                         <span className={isHidden ? "text-zinc-500 line-through" : ""}>{c}</span>
                       )}
                       <div className="flex items-center space-x-1">
                         <button onClick={() => { setEditCatIndex(index); setEditCatValue(c); }} className="p-1.5 text-zinc-400 hover:text-amber-500"><Edit3 size={16}/></button>
                         <button onClick={() => moveCategory('primary', index, -1)} className="p-1.5 text-zinc-400 hover:text-white"><ArrowUp size={16}/></button>
                         <button onClick={() => moveCategory('primary', index, 1)} className="p-1.5 text-zinc-400 hover:text-white"><ArrowDown size={16}/></button>
                         <button onClick={() => toggleHideCategory('primary', c)} className={`p-1.5 ${isHidden ? 'text-amber-500' : 'text-zinc-400 hover:text-amber-500'}`}>
                           {isHidden ? <EyeOff size={16}/> : <Eye size={16}/>}
                         </button>
                       </div>
                     </div>
                   )})}
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
                       {(customSubCats[selectedPrimaryForSub] || []).map((c, index) => {
                         const isHidden = hiddenSubCategories.includes(c);
                         return (
                         <div key={`sec_${c}`} className="bg-zinc-800 text-white px-3 py-2 rounded-lg flex items-center justify-between text-sm">
                           {editSubCatIndex === index ? (
                             <input autoFocus type="text" value={editSubCatValue} onChange={e => setEditSubCatValue(e.target.value)} onBlur={() => saveCategoryEdit('secondary')} className="bg-black border border-amber-500 text-white px-2 py-1 rounded w-1/2 outline-none" />
                           ) : (
                             <span className={isHidden ? "text-zinc-500 line-through" : ""}>{c}</span>
                           )}
                           <div className="flex items-center space-x-1">
                             <button onClick={() => { setEditSubCatIndex(index); setEditSubCatValue(c); }} className="p-1.5 text-zinc-400 hover:text-amber-500"><Edit3 size={16}/></button>
                             <button onClick={() => moveCategory('secondary', index, -1)} className="p-1.5 text-zinc-400 hover:text-white"><ArrowUp size={16}/></button>
                             <button onClick={() => moveCategory('secondary', index, 1)} className="p-1.5 text-zinc-400 hover:text-white"><ArrowDown size={16}/></button>
                             <button onClick={() => toggleHideCategory('secondary', c)} className={`p-1.5 ${isHidden ? 'text-amber-500' : 'text-zinc-400 hover:text-amber-500'}`}>
                               {isHidden ? <EyeOff size={16}/> : <Eye size={16}/>}
                             </button>
                           </div>
                         </div>
                       )})}
                     </div>
                   </>
                 )}
              </div>
            </div>
          )}

          {adminTab === "games" && (
            <div className="space-y-8">
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

          {adminTab !== "games" && adminTab !== "categories" && adminTab !== "orders" && adminTab !== "sourcing" && adminTab !== "overview" && adminTab !== "vip" && (
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
                    <option value="">GOLETH</option>
                    <option value="">አማኑኤል</option>
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
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <input required value={formData.cadCost || ""} type="number" step="0.01" placeholder="Base Cost (CAD)" onChange={(e) => setFormData({ ...formData, cadCost: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl outline-none focus:border-amber-500" />
                    <div>
                      <input required value={formData.stockQty || ""} type="number" placeholder="Stock Qty (Single units)" onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl outline-none focus:border-amber-500" />
                      <p className="text-[10px] text-zinc-500 mt-1 pl-1">Ex: If you bought a 5-pack, enter '5'.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input required value={formData.weightKg || ""} type="number" step="0.1" placeholder="Weight (kg)" onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl outline-none focus:border-amber-500" />
                    <input value={formData.specialFreightFee || ""} type="number" placeholder="Special Freight Fee (ETB)" onChange={(e) => setFormData({ ...formData, specialFreightFee: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl outline-none focus:border-amber-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 mb-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Calculated Regular Price</label>
                      <input readOnly value={formData.price || ""} type="number" className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg outline-none opacity-80 font-mono" />
                    </div>
                    <div>
                      <label className="text-[10px] text-amber-500 font-bold uppercase block mb-1">Calculated VIP Price</label>
                      <input readOnly value={formData.vipPrice || ""} type="number" className="w-full bg-black border border-amber-500/50 text-amber-500 p-3 rounded-lg outline-none opacity-80 font-mono font-bold" />
                    </div>
                    <p className="col-span-2 text-[10px] text-zinc-500 leading-tight mt-1">Pricing is auto-calculated: (CAD + 13% Tax) + 18% Markup * 130 Rate + Freight.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                    <div className="relative">
                      <label className="block text-zinc-400 text-xs font-bold mb-2">ዋና ምድቦች (Primary Categories) - Select multiple</label>
                      <div className="bg-black p-3 rounded-lg border border-zinc-700 max-h-40 overflow-y-auto space-y-2">
                         {customCategories.map(c => (
                           <label key={c} className="flex items-center space-x-2 text-white cursor-pointer hover:bg-zinc-800 p-1 rounded">
                             <input type="checkbox" checked={formData.shopCat?.includes(c)} onChange={(e) => {
                               const newCats = e.target.checked ? [...formData.shopCat, c] : formData.shopCat.filter(cat => cat !== c);
                               setFormData({...formData, shopCat: newCats});
                             }} className="accent-amber-500" />
                             <span className="text-sm">{c}</span>
                           </label>
                         ))}
                      </div>
                    </div>

                    <div className="relative border-t border-zinc-800 pt-4 mt-2">
                      <label className="block text-zinc-400 text-xs font-bold mb-2">ንዑስ ምድቦች (Subcategories) - Select multiple</label>
                      <div className="bg-black p-3 rounded-lg border border-zinc-700 max-h-40 overflow-y-auto space-y-2">
                         {Object.entries(customSubCats).flatMap(([prim, subs]) => subs.map(sub => ({prim, sub}))).map(({prim, sub}, i) => {
                           return (
                             <label key={`${prim}_${sub}_${i}`} className="flex items-center space-x-2 text-white cursor-pointer hover:bg-zinc-800 p-1 rounded">
                               <input type="checkbox" checked={formData.shopSubCat?.includes(sub)} onChange={(e) => {
                                 const newSubCats = e.target.checked ? [...formData.shopSubCat, sub] : formData.shopSubCat.filter(cat => cat !== sub);
                                 setFormData({...formData, shopSubCat: newSubCats});
                               }} className="accent-amber-500" />
                               <span className="text-sm">{sub} <span className="text-[10px] text-zinc-500 ml-1">({prim})</span></span>
                             </label>
                           );
                         })}
                      </div>
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
            <button onClick={() => { openNewPost("overview"); setShowAdmin(true); }} className="bg-amber-500 text-black px-3 py-1.5 rounded-full font-bold text-xs shadow-lg shadow-amber-500/20">
              CEO
            </button>
          )}
          
          <div className="flex items-center space-x-2">
            {!currentUser ? (
               <button onClick={() => setShowLoginModal(true)} className="bg-[#2AABEE] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-[#229ED9] transition-colors">
                 ይግቡ
               </button>
            ) : (
               <button onClick={() => setActiveTab("ፕሮፋይል")} className={`border px-3 py-1.5 rounded-full flex items-center transition-colors shadow-sm ${activeTab === 'ፕሮፋይል' ? 'bg-zinc-800 border-amber-500 text-amber-500' : 'bg-zinc-900 border-zinc-800 hover:border-amber-500/50 text-white'}`}>
                  <User size={14} className={`${activeTab === 'ፕሮፋይል' ? 'text-amber-500' : 'text-amber-500'} mr-2`} />
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

      {showCart && renderCartSlideOver()}

      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        {activePost && !selectedProduct && renderSinglePost()}
        
        {!activePost && !selectedProduct && (
          <>
            {["ዋና", "ስፖርት", "ሹክሹክታ", "ማህበራዊ"].includes(activeTab) && renderPostFeed()}
            {activeTab === "ቪአይፒ" && renderVIP()}
            {activeTab === "ሱቅ" && renderShop()}
            {activeTab === "ፕሮፋይል" && renderProfilePage()}
          </>
        )}
      </main>

      {renderProductDetail()}

      {showSuccessModal && renderSuccessModal()}
      {showOrderForm && renderOrderForm()}
      {renderOfflineSaleModal()}
      {showAdmin && renderAdmin()}

      <nav className="fixed bottom-0 inset-x-0 w-full bg-black/95 backdrop-blur-md border-t border-zinc-900 flex justify-around pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 px-1 z-[100]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActivePost(null); setSelectedProduct(null); setQuantity(1); window.scrollTo(0,0); }}
              className={`flex flex-col items-center p-2 transition-colors ${isActive ? "text-amber-500" : "text-zinc-400 hover:text-zinc-300"}`}
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
