import React, { useState, useEffect, useRef } from "react";
import {
  Home, Trophy, Flame, Users, Target, ShoppingBag, X, Trash2, Edit2, ChevronLeft, PlusCircle, Send, CheckCircle, LogOut, ArrowUp, ArrowDown, Edit3, User, Package, Plus, Minus, Eye, EyeOff, DollarSign, ShoppingCart, Plane, List, LayoutDashboard, FileText, Settings, Archive
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import SuccessModal from "./components/SuccessModal"; // CEO Edit: Linking the new Success Modal
import AccountSlideOver from "./components/AccountSlideOver"; // CEO Edit: Linking the Account Menu
import OfflineSaleModal from "./components/OfflineSaleModal"; // CEO Edit: Linking the POS Modal
import CartSlideOver from "./components/CartSlideOver"; // CEO Edit: Linking the Cart Screen
import AdminPanel from "./components/AdminPanel"; // CEO Edit: Linking the Command Center
import Shop from "./components/Shop";
import ProductDetail from "./components/ProductDetail";
import VipPanel from "./components/VipPanel";
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
  const [showProfileSlideOver, setShowProfileSlideOver] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  
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
  const [vipRequests, setVipRequests] = useState([]);

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
  
  // Flight Batch Math Updates: Orders = Pending only. Sourcing = Approved only (0.5kg assumed)
  const pendingOrdersWeight = allOrders.filter(o => o.status === 'pending' && !o.is_offline_sale).reduce((sum, o) => sum + (o.total_weight_kg || 0), 0);
  const approvedSourcingWeight = allSourcing.filter(o => o.status === 'approved').length * 0.5; 
  const totalBatchWeight = pendingOrdersWeight + approvedSourcingWeight;
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

    const handlePopState = () => { setActivePost(null); setSelectedProduct(null); setShowCart(false); setShowAccountMenu(false); setShowProfileSlideOver(false); setQuantity(1); };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (isCEO) {
      fetchAllOrders();
      fetchAllSourcing();
      fetchVipRequests();
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

  const fetchVipRequests = async () => {
    try {
      const { data } = await supabase.from('vip_payments').select('*').eq('status', 'pending').order('created_at', { ascending: false });
      if (data) setVipRequests(data);
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

      if (!userRecord.full_name || !userRecord.phone_number) {
         setShowProfileSlideOver(true);
      }

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
    localStorage.removeItem('goleth_user'); localStorage.removeItem('goleth_profile'); localStorage.removeItem('goleth_pending_vip');
    setCurrentUser(null); setCurrentUserProfile(null); setIsVIP(false); setVipStatus("none"); setUserPredictions({}); setHasPendingVip(false); setIsCEO(false); setShowAdmin(false); setShowAccountMenu(false); setUserOrders([]); setUserSourcing([]); setShowProfileSlideOver(false);
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
        setShowProfileSlideOver(false); 
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
        setVipRequests(prev => prev.filter(r => r.id !== paymentId));
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
    const update = sourcingUpdateData[orderId] || { status: order.status };
    
    setUploading(true);
    const { data, error } = await supabase.from('sourcing_requests').update({ status: update.status }).eq('id', orderId).select();
    
    if (error || (!data || data.length === 0)) {
       alert("Update failed! Check RLS policies.");
    } else {
       alert("Sourcing order updated!");
       setAllSourcing(prev => prev.map(o => o.id === orderId ? { ...o, status: update.status } : o));
       
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
    if (type === 'vip') fetchVipRequests();
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

      {/* CEO Edit: Using the standalone Account Menu and passing all data it needs */}
      {showAccountMenu && (
        <AccountSlideOver
          setShowAccountMenu={setShowAccountMenu}
          handleLogout={handleLogout}
          isCEO={isCEO}
          currentUserProfile={currentUserProfile}
          isVIP={isVIP}
          userOrders={userOrders}
          userSourcing={userSourcing}
          getStatusBadge={getStatusBadge}
        />
      )}
      {/* CEO Edit: Using the standalone Cart Component */}
      <CartSlideOver
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
        removeFromCart={removeFromCart}
        calculateTotal={calculateTotal}
        handleCheckout={handleCheckout}
      />

      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        {activePost && !selectedProduct && renderSinglePost()}
        
        {!activePost && !selectedProduct && (
          <>
            {["ዋና", "ስፖርት", "ሹክሹክታ", "ማህበራዊ"].includes(activeTab) && renderPostFeed()}
            {activeTab === "ቪአይፒ" && (
  <VipPanel
    currentUser={currentUser}
    setShowLoginModal={setShowLoginModal}
    hasPendingVip={hasPendingVip}
    isCEO={isCEO}
    isVIP={isVIP}
    vipStatus={vipStatus}
    isFullNameValid={isFullNameValid}
    orderName={orderName}
    setOrderName={setOrderName}
    vipPhone={vipPhone}
    setVipPhone={setVipPhone}
    vipReceiptFile={vipReceiptFile}
    setVipReceiptFile={setVipReceiptFile}
    vipPaymentType={vipPaymentType}
    setVipPaymentType={setVipPaymentType}
    currentUserProfile={currentUserProfile}
    handleVipPaymentSubmit={handleVipPaymentSubmit}
    uploading={uploading}
    renderActualGames={typeof renderActualGames !== 'undefined' ? renderActualGames : null}
  />
)}
{activeTab === "ሱቅ" && (
  <Shop
    customCategories={customCategories}
    hiddenCategories={hiddenCategories}
    shopCategory={shopCategory}
    customSubCats={customSubCats}
    hiddenSubCategories={hiddenSubCategories}
    shopSubCategory={shopSubCategory}
    products={products}
    isVIP={isVIP}
    isCEO={isCEO}
    setShopCategory={setShopCategory}
    setShopSubCategory={setShopSubCategory}
    setShowCart={setShowCart}
    cart={cart}
    renderOrderBanner={typeof renderOrderBanner !== 'undefined' ? renderOrderBanner : null}
    openProduct={openProduct}
    handleOpenOfflineSale={handleOpenOfflineSale}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
  />
)}          </>
        )}
      </main>

      {renderProductDetail()}

      {/* CEO Edit: Using the standalone Profile Menu and passing required data */}
<ProductDetail
  selectedProduct={selectedProduct}
  isVIP={isVIP}
  isCEO={isCEO}
  cart={cart}
  setShowCart={setShowCart}
  handleOpenOfflineSale={handleOpenOfflineSale}
  handleEdit={handleEdit}
  handleDelete={handleDelete}
  selectedOption={selectedOption}
  setSelectedOption={setSelectedOption}
  quantity={quantity}
  setQuantity={setQuantity}
  addToCart={addToCart}
  formatOptionDisplay={formatOptionDisplay}
/>
<ProfileSlideOver
          setShowProfileSlideOver={setShowProfileSlideOver}
          currentUserProfile={currentUserProfile}
          saveUserProfile={saveUserProfile}
          isFullNameValid={isFullNameValid}
          uploading={uploading}
        />
      )}
      {showSuccessModal && <SuccessModal setShowSuccessModal={setShowSuccessModal} />} {/* CEO Edit: Using the standalone Success Modal */}
      {showOrderForm && renderOrderForm()}
      {/* CEO Edit: Using the standalone Offline Sale (POS) Modal */}
      <OfflineSaleModal
        showOfflineSaleModal={showOfflineSaleModal}
        setShowOfflineSaleModal={setShowOfflineSaleModal}
        offlineSaleProduct={offlineSaleProduct}
        offlineSaleMode={offlineSaleMode}
        setOfflineSaleMode={setOfflineSaleMode}
        offlineSaleQty={offlineSaleQty}
        setOfflineSaleQty={setOfflineSaleQty}
        offlineSaleCustomPrice={offlineSaleCustomPrice}
        setOfflineSaleCustomPrice={setOfflineSaleCustomPrice}
        submitOfflineSale={submitOfflineSale}
        uploading={uploading}
      />
      {/* CEO Edit: Using the standalone Admin Component */}
      <AdminPanel
        showAdminPanel={showAdmin}
        setShowAdminPanel={setShowAdmin}
        products={products}
        orders={allOrders}
        sourcingRequests={allSourcing}
        isCEO={isCEO}
      />

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
