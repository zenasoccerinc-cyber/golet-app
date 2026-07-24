import React, { useState, useEffect, useRef } from "react";
import {
  Home, Trophy, Flame, Users, Target, ShoppingBag, X, Trash2, Edit2, ChevronLeft, PlusCircle, Send, CheckCircle, LogOut, ArrowUp, ArrowDown, Edit3, User, Package, Plus, Minus, Eye, EyeOff, DollarSign, ShoppingCart, Plane, List
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
  
  const localVipRevenue = approvedVipPayments.filter(v => v.payment_type === 'ሀገር ውስጥ').reduce((sum) => sum + 300, 0);
  const diasporaVipRevenue = approvedVipPayments.filter(v => v.payment_type === 'ዳያስፖራ').reduce((sum) => sum + 1950, 0);

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
     const { error: pError } = await supabase.from('vip_payments').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', paymentId);
     
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

  const renderShop = () => {
    const uniquePrimary = ["ሁሉም", ...customCategories.filter(c => !hiddenCategories.includes(c))];
    const activeSubCats = shopCategory === "ሁሉም" ? [] : (customSubCats[shopCategory] || []).filter(c => !hiddenSubCategories.includes(c));
    const uniqueSecondary = ["ሁሉም", ...activeSubCats];

    let filtered = products;
    if (shopCategory !== "ሁሉም") {
      filtered = filtered.filter(p => {
        const catList = Array.isArray(p.category) ? p.category : (p.category ? [p.category] : []);
        return catList.includes(shopCategory);
      });
    }
    if (shopCategory !== "ሁሉም" && shopSubCategory !== "ሁሉም") {
      filtered = filtered.filter(p => {
        const subCatList = Array.isArray(p.subcategory) ? p.subcategory : (p.subcategory ? [p.subcategory] : []);
        return subCatList.includes(shopSubCategory);
      });
    }

    const hasVipAccess = isVIP || isCEO;

    return (
      <div className="pb-24">
        <div className="flex justify-between items-center mb-3">
           <div className="flex flex-wrap gap-2 flex-1">
             {uniquePrimary.map(cat => (
               <button key={cat} onClick={() => { setShopCategory(cat); setShopSubCategory("ሁሉም"); }} 
                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${shopCategory === cat ? "bg-amber-500 text-black shadow-lg" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"}`}>
                 {cat}
               </button>
             ))}
           </div>
           
           <button onClick={() => setShowCart(true)} className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl relative ml-2 shadow-lg">
             <ShoppingCart className="text-amber-500 w-5 h-5" />
             {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
           </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {renderOrderBanner()}
        </div>

        {shopCategory !== "ሁሉም" && uniqueSecondary.length > 1 && (
           <div className="flex flex-wrap gap-2 pb-4 mb-2 mt-2">
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
                      <button onClick={(e) => { e.stopPropagation(); handleOpenOfflineSale(item); }} className="bg-black/80 backdrop-blur p-1.5 rounded-md text-amber-500 font-black text-[10px] flex items-center"><DollarSign size={12} className="mr-0.5"/> POS</button>
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

  const renderActualGames = (isBlurred = false) => {
    if (!games || games.length === 0) return null;
    
    return (
      <div className={isBlurred ? "opacity-30 blur-[4px] pointer-events-none select-none mt-8" : "mt-8"}>
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

              {!isBlurred && game.status === 'open' && !userPred && (
                <div className="flex flex-col items-center space-y-4 border-t border-zinc-800 pt-4">
                  <div className="flex justify-center items-center space-x-3">
                    <input type="number" value={predictionInputs[game.id]?.a || ""} onChange={e => setPredictionInputs(prev => ({...prev, [game.id]: {...(prev[game.id] || {}), a: e.target.value}}))} className="w-16 p-3 rounded-lg bg-black border border-zinc-700 text-white text-center font-black focus:border-amber-500 outline-none" placeholder="0" />
                    <span className="font-black text-zinc-500">-</span>
                    <input type="number" value={predictionInputs[game.id]?.b || ""} onChange={e => setPredictionInputs(prev => ({...prev, [game.id]: {...(prev[game.id] || {}), b: e.target.value}}))} className="w-16 p-3 rounded-lg bg-black border border-zinc-700 text-white text-center font-black focus:border-amber-500 outline-none" placeholder="0" />
                  </div>
                  <button onClick={() => submitPrediction(game.id)} className="w-full bg-amber-500 text-black py-3 rounded-xl font-black shadow-lg hover:bg-amber-400 transition-colors">ውጤት ላክ</button>
                </div>
              )}

              {!isBlurred && game.status === 'open' && userPred && (
                <div className="mt-4 text-center bg-black border border-amber-500/50 text-amber-500 text-sm font-bold p-3 rounded-xl">🔒 ግምትዎ ተቆልፏል: {String(userPred.predicted_score_a ?? '')} - {String(userPred.predicted_score_b ?? '')}</div>
              )}

              {!isBlurred && game.status === 'finished' && userPred && (
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

  const renderVIP = () => {
    const handleVipActionClick = () => {
       if (!currentUser) {
          setShowLoginModal(true);
       } else {
          document.getElementById('vip-payment-form')?.scrollIntoView({ behavior: 'smooth' });
       }
    };

    const renderVipBenefits = () => (
      <div className="text-left mb-8 bg-gradient-to-b from-zinc-900 to-black p-[2px] rounded-2xl border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Target size={120} /></div>
        <div className="bg-zinc-950 rounded-2xl p-5 h-full z-10 relative">
          <h3 className="text-amber-500 font-black mb-5 text-lg border-b border-zinc-800 pb-3 flex items-center">
            <Target className="mr-2" size={20} /> የVIP አባልነት ጥቅሞች
          </h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="group relative bg-zinc-900/50 p-5 rounded-xl border border-zinc-800/50 hover:border-amber-500/50 transition-all">
              <div className="flex items-center space-x-4 mb-3">
                 <div className="bg-amber-500/20 p-3 rounded-xl"><Home className="text-amber-500 w-6 h-6 shrink-0" /></div>
                 <h4 className="text-lg font-black text-amber-500">የሀገር ውስጥ VIP</h4>
              </div>
              <ul className="text-sm text-zinc-300 leading-relaxed pl-16 space-y-2 list-disc">
                 <li>ልዩ ቅናሽ ያላቸውን እቃዎች ለVIP ተጠቃሚ ብቻ</li>
                 <li>በየሳምንቱ እና በየወሩ በሚኖሩን የእግር ኳስ እና ሌሎች የውድድር መርሐ ግብሮች በመሳተፍ የሱቃችን ምርቶችን የማሸነፍ ዕድል ያገኛሉ!</li>
                 <li>ለእያንዳንዱ እቃ እስከ 3 ብዛት ለሚገዙት ልዩ እና ታላቅ ቅናሾች ተጠቃሚ ይሆናሉ።</li>
              </ul>
              <div className="mt-5 pl-16">
                 <div className="flex items-baseline space-x-1 mb-3">
                    <p className="text-2xl font-black text-white">300 ብር</p>
                    <p className="text-sm text-zinc-300 font-bold">/ በወር</p>
                 </div>
                 <button onClick={handleVipActionClick} className="bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 px-8 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">VIP ይሁኑ</button>
              </div>
            </div>
            
            <div className="group relative bg-zinc-900/50 p-5 rounded-xl border border-zinc-800/50 hover:border-amber-500/50 transition-all">
              <div className="flex items-center space-x-4 mb-3">
                 <div className="bg-amber-500/20 p-3 rounded-xl"><Package className="text-amber-500 w-6 h-6 shrink-0" /></div>
                 <h4 className="text-lg font-black text-amber-500">የዳያስፖራ VIP</h4>
              </div>
              <ul className="text-sm text-zinc-300 leading-relaxed pl-16 space-y-2 list-disc">
                 <li>ልዩ ቅናሽ ያላቸውን እቃዎች ለVIP ተጠቃሚ ብቻ</li>
                 <li>በወር 2 ጊዜ ከማንኛውም የአገልግሎት ክፍያ ነጻ ይሆናሉ (እቃውን ከገዙ በኋላ የእቃውን እና የማጓጓዣ ክፍያ ብቻ ይከፍላሉ)።</li>
                 <li>በሳምንት እና በወር በሚኖሩ ውድድሮች በመሳተፍ ምርቶችን ያሸንፉ፤ ያሸነፉትን እቃ ወደ ኢትዮጵያ በነጻ የመላክ እድል ያገኛሉ።</li>
              </ul>
              <div className="mt-5 pl-16">
                 <div className="flex items-baseline space-x-1 mb-3">
                    <p className="text-2xl font-black text-white">$15</p>
                    <p className="text-sm text-zinc-300 font-bold">/ በወር</p>
                 </div>
                 <button onClick={handleVipActionClick} className="bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 px-8 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">VIP ይሁኑ</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    if (!currentUser) {
      return (
        <div className="pb-24 pt-6">
          <div className="text-center max-w-sm mx-auto mb-8">
            {renderVipBenefits()}
          </div>
          {renderActualGames(true)}
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
      const isPaymentValid = isFullNameValid(orderName) && vipPhone.length === 10 && vipReceiptFile;
      return (
        <div className="pb-24 pt-6">
          <div className="max-w-md mx-auto mb-8">

            <div id="vip-payment-form" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
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
                      <div className="flex justify-between mb-3 pb-3 border-b border-zinc-800"><span className="text-zinc-400">ወርሃዊ ክፍያ:</span><span className="text-amber-500 font-black">300 ብር</span></div>
                      <p className="font-bold text-amber-500 text-base">📌 የባንክ ማስተላለፊያ መመሪያ፦</p>
                      <p>የኢትዮጵያ ንግድ ባንክ (CBE) - <span className="text-amber-500 font-mono font-black text-lg">1000123456789</span></p>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between mb-3 pb-3 border-b border-zinc-800"><span className="text-zinc-400">ወርሃዊ ክፍያ:</span><span className="text-amber-500 font-black">$15 USD (1950 ብር)</span></div>
                      <p className="font-bold text-amber-500 text-base">📌 የPayPal ማስተላለፊያ መመሪያ፦</p>
                      <p>PayPal ኢሜይል: <span className="text-amber-500 font-mono font-black text-lg">demo@goleth.com</span></p>
                    </>
                  )}
                  <p className="text-xs text-zinc-400 pt-2 mt-2">መጀመሪያ ክፍያዎን ያስተላልፉ። በመቀጠል ደረሰኙን ፎቶ አንስተው ከታች ያያይዙ።</p>
                </div>

                <input required name="fullName" value={orderName} onChange={e => setOrderName(e.target.value)} placeholder="ሙሉ ስም (የመጀመሪያ እና የአባት ስም)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none text-base" onChange={(e) => { setOrderName(e.target.value); e.target.setCustomValidity(isFullNameValid(e.target.value) ? '' : 'እባክዎ ሙሉ ስም ያስገቡ (የመጀመሪያ እና የአባት ስም)'); }} />
                <input required type="tel" placeholder="ስልክ ቁጥር (10 አሃዝ)" maxLength="10" pattern="[0-9]{10}" value={vipPhone} onChange={e => setVipPhone(e.target.value.replace(/\D/g, ""))} className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none text-base font-mono" />
                
                <div>
                  <label className="block text-zinc-400 text-sm font-bold mb-2">የክፍያ ማረጋገጫ ፋይል ያያይዙ፦</label>
                  <input required type="file" name="receiptFile" onChange={(e) => setVipReceiptFile(e.target.files[0])} accept="image/*" className="w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:bg-zinc-800 file:text-white file:border-0 file:cursor-pointer" />
                </div>
                
                <button type="submit" disabled={uploading || !isPaymentValid} className="w-full bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black py-4 rounded-xl text-lg shadow-lg transition-colors mt-2">
                  {uploading ? "በመላክ ላይ..." : "ላክ"}
                </button>
              </form>
            </div>
          </div>
          {renderActualGames(true)}
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
        {renderActualGames(false)}
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
