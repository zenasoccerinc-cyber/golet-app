import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Trophy,
  Flame,
  Target,
  ShoppingBag,
  X,
  Trash2,
  Edit,
  Loader2,
  CheckCircle2,
  LogOut,
  Lock,
  ChevronRight,
  Crown,
  Users,
  PlusCircle,
  Image as ImageIcon,
  AlertCircle,
  TrendingUp,
  Package,
  Clock,
  Truck,
  Globe2,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// SECURE CONNECTION: Pulling from your .env vault
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// SECURE TELEGRAM CREDENTIALS: Pulling from your .env vault
const ORDERS_BOT_TOKEN = process.env.REACT_APP_ORDERS_BOT_TOKEN;
const APP_BOT_TOKEN = process.env.REACT_APP_APP_BOT_TOKEN;
const CHAT_ID = process.env.REACT_APP_CHAT_ID;

const TelegramLoginWidget = ({ onAuth }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    window.onTelegramAuth = (user) => onAuth(user);
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "goleth_app_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;
    if (containerRef.current) containerRef.current.appendChild(script);
    return () => {
      delete window.onTelegramAuth;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [onAuth]);
  return (
    <div ref={containerRef} className="flex justify-center mt-4 w-full"></div>
  );
};

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("goleth_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.vipUntil && new Date(parsedUser.vipUntil) < new Date()) {
        parsedUser.isVIP = false;
      }
      return parsedUser;
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState("ዜና");
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isCEO, setIsCEO] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});

  const [newsCategory, setNewsCategory] = useState("ዋና");
  const [newsLimit, setNewsLimit] = useState(10);
  const newsCategories = ["ዋና", "አስተያየት", "ማህበራዊ", "ያግኙን"];

  const [sportCategory, setSportCategory] = useState("የዝውውር ዜና");
  const sportCategories = ["የዝውውር ዜና"];

  const [shopCategory, setShopCategory] = useState("ሁሉም");
  const shopCategories = ["ሁሉም", "ወንዶች", "ሴቶች", "ልጆች", "መድሃኒት", "ሌላ"];

  // CUSTOM SOURCING STATES
  const [showSourcingModal, setShowSourcingModal] = useState(false);
  const [sourcingLink, setSourcingLink] = useState("");

  // GLOBAL CHECKOUT STATES
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeProductImageIndex, setActiveProductImageIndex] = useState(0);
  const [orderDestination, setOrderDestination] = useState("local");
  const [orderName, setOrderName] = useState("");
  const [countryCode, setCountryCode] = useState("+251");
  const [orderPhone, setOrderPhone] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [orderShipping, setOrderShipping] = useState("local_delivery");
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // VIP ORDER STATE
  const [vipPhone, setVipPhone] = useState("");
  const [vipReceipt, setVipReceipt] = useState(null);
  const [isSubmittingVip, setIsSubmittingVip] = useState(false);

  // PREDICTION STATES
  const [teamAScore, setTeamAScore] = useState("");
  const [teamBScore, setTeamBScore] = useState("");
  const [predictionStatus, setPredictionStatus] = useState("idle");
  const [existingPrediction, setExistingPrediction] = useState(null);

  const [leaderboard, setLeaderboard] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  // DASHBOARD STATES
  const [myOrders, setMyOrders] = useState([]);
  const [userJoinedDate, setUserJoinedDate] = useState(null);

  const [news, setNews] = useState([]);
  const [gossip, setGossip] = useState([]);
  const [products, setProducts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // ADMIN FILE UPLOAD STATES
  const [adminTab, setAdminTab] = useState("news");
  const [formData, setFormData] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [teamAImageFile, setTeamAImageFile] = useState(null);
  const [teamBImageFile, setTeamBImageFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user && predictions.length > 0) {
      checkExistingPrediction(predictions[0].id);
      fetchUserPoints();
    }
  }, [user, predictions]);

  useEffect(() => {
    if (showProfile && user) {
      fetchMyProfileData();
    }
  }, [showProfile, user]);

  const fetchData = async () => {
    const { data: nData } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    const { data: gData } = await supabase
      .from("gossip")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    const { data: pData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: prData } = await supabase
      .from("predictions")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    const { data: oData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    let lData = [];
    if (prData && prData.length > 0) {
      const activeMatch = prData[0];
      const { data: matchGuesses } = await supabase
        .from("user_predictions")
        .select("*")
        .eq("match_id", activeMatch.id);
      if (matchGuesses && matchGuesses.length > 0) {
        const userIds = matchGuesses.map((g) => g.user_id);
        const { data: guessUsers } = await supabase
          .from("users")
          .select("id, name, total_points")
          .in("id", userIds);
        if (guessUsers) {
          lData = matchGuesses.map((guess) => {
            const u = guessUsers.find((user) => user.id === guess.user_id);
            return {
              ...guess,
              name: u ? u.name : "Unknown",
              total_points: u ? u.total_points : 0,
            };
          });
          lData.sort((a, b) => b.total_points - a.total_points);
        }
      }
    }

    if (nData) setNews(nData);
    if (gData) setGossip(gData);
    if (pData) setProducts(pData);
    if (prData) setPredictions(prData);
    if (oData) setOrders(oData);
    setLeaderboard(lData);
  };

  const fetchMyProfileData = async () => {
    const { data: myOrderData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (myOrderData) setMyOrders(myOrderData);

    const { data: uData } = await supabase
      .from("users")
      .select("created_at")
      .eq("id", user.id)
      .single();
    if (uData) setUserJoinedDate(uData.created_at);
  };

  const fetchUserPoints = async () => {
    const { data } = await supabase
      .from("users")
      .select("total_points")
      .eq("id", user.id)
      .single();
    if (data) setTotalPoints(data.total_points);
  };

  const checkExistingPrediction = async (matchId) => {
    const { data } = await supabase
      .from("user_predictions")
      .select("*")
      .eq("user_id", user.id)
      .eq("match_id", matchId)
      .single();
    if (data) setExistingPrediction(data);
  };

  const navigateHome = () => {
    setActiveTab("ዜና");
    setNewsCategory("ዋና");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoTap = () => {
    navigateHome();
    const newCount = tapCount + 1;
    setTapCount(newCount);
    setTimeout(() => setTapCount(0), 3000);
    if (newCount >= 5) {
      const password = window.prompt("CEO Password:");
      if (password === "admin123") {
        setIsCEO(true);
        fetchCEOUsers();
        alert("CEO Mode Activated");
      }
      setTapCount(0);
    }
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "ዜና") {
      setNewsCategory("ዋና");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const fetchCEOUsers = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAllUsers(data);
  };

  const handleRealLogin = async (telegramUser) => {
    const userIdString = telegramUser.id.toString();
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userIdString)
      .single();
    let currentUser;
    if (data) {
      let currentlyValidVIP = false;
      if (data.is_vip && data.vip_until) {
        currentlyValidVIP = new Date(data.vip_until) > new Date();
        if (!currentlyValidVIP)
          await supabase
            .from("users")
            .update({ is_vip: false })
            .eq("id", userIdString);
      }
      currentUser = {
        id: data.id,
        name: data.name,
        isVIP: currentlyValidVIP,
        vipUntil: data.vip_until,
      };
    } else {
      const newUser = {
        id: userIdString,
        name: telegramUser.first_name,
        is_vip: false,
        total_points: 0,
      };
      await supabase.from("users").insert([newUser]);
      currentUser = {
        id: newUser.id,
        name: newUser.name,
        isVIP: false,
        vipUntil: null,
      };
    }
    setUser(currentUser);
    localStorage.setItem("goleth_user", JSON.stringify(currentUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("goleth_user");
    setShowProfile(false);
    setIsCEO(false);
    navigateHome();
  };

  const handlePredictSubmit = async (matchId) => {
    if (!user) {
      alert("በመጀመሪያ በቴሌግራም ይግቡ (Log in first)");
      return;
    }
    if (teamAScore === "" || teamBScore === "") return;
    setPredictionStatus("loading");
    const newGuess = {
      user_id: user.id,
      match_id: matchId,
      team_a_score: Number(teamAScore),
      team_b_score: Number(teamBScore),
    };
    const { error } = await supabase
      .from("user_predictions")
      .insert([newGuess]);
    if (!error) {
      setPredictionStatus("success");
      setTimeout(() => {
        setPredictionStatus("idle");
        setExistingPrediction(newGuess);
        fetchData();
      }, 1500);
    } else {
      alert("Error processing prediction.");
      setPredictionStatus("idle");
    }
  };

  const handleDelete = async (table, id) => {
    if (window.confirm("Are you sure?")) {
      await supabase.from(table).delete().eq("id", id);
      fetchData();
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    fetchData();
  };

  const handleEdit = (item = null, table) => {
    setAdminTab(table || "news");
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title || item.name || "",
        subtitle: item.subtitle || "",
        author: item.author || "",
        body: item.body || "",
        price: item.price || "",
        category: item.category || "ዋና",
        league: item.league_name || "",
        teamA: item.team_a_name || "",
        teamB: item.team_b_name || "",
        teamALogo: item.team_a_logo || "",
        teamBLogo: item.team_b_logo || "",
        image_url: item.image_url || null,
        is_vip_only: item.is_vip_only || false,
        brand: item.brand || "",
        sizes: item.sizes || "",
        stock_status: item.stock_status || "In Stock",
        highlight_tag: item.highlight_tag || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        subtitle: "",
        author: "Goleth",
        body: "",
        price: "",
        category: "ዋና",
        league: "",
        teamA: "",
        teamB: "",
        teamALogo: "",
        teamBLogo: "",
        image_url: null,
        is_vip_only: false,
        brand: "",
        sizes: "",
        stock_status: "In Stock",
        highlight_tag: "",
      });
    }
    setShowAdmin(true);
  };

  const closeAdmin = () => {
    setShowAdmin(false);
    setEditingId(null);
    setFormData({});
    setImageFiles([]);
    setTeamAImageFile(null);
    setTeamBImageFile(null);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (adminTab === "analytics") return;
    setUploading(true);

    let finalImageUrl = formData.image_url || null;
    let finalTeamALogo = formData.teamALogo;
    let finalTeamBLogo = formData.teamBLogo;

    if (imageFiles && imageFiles.length > 0) {
      const uploadedUrls = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileName = `${Date.now()}_${i}.${file.name.split(".").pop()}`;
        const { error } = await supabase.storage
          .from("images")
          .upload(fileName, file);
        if (!error)
          uploadedUrls.push(
            supabase.storage.from("images").getPublicUrl(fileName).data
              .publicUrl
          );
      }
      finalImageUrl = uploadedUrls.join(",");
    }

    if (teamAImageFile) {
      const fileName = `${Date.now()}_teamA.${teamAImageFile.name
        .split(".")
        .pop()}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, teamAImageFile);
      if (!error)
        finalTeamALogo = supabase.storage.from("images").getPublicUrl(fileName)
          .data.publicUrl;
    }
    if (teamBImageFile) {
      const fileName = `${Date.now()}_teamB.${teamBImageFile.name
        .split(".")
        .pop()}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, teamBImageFile);
      if (!error)
        finalTeamBLogo = supabase.storage.from("images").getPublicUrl(fileName)
          .data.publicUrl;
    }

    const payload = {};
    if (["news", "gossip"].includes(adminTab)) {
      Object.assign(payload, {
        title: formData.title,
        subtitle: formData.subtitle,
        author: formData.author || "Goleth",
        body: formData.body,
        category: formData.category,
        image_url: finalImageUrl,
      });
    } else if (adminTab === "products") {
      Object.assign(payload, {
        name: formData.title,
        body: formData.body,
        price: Number(formData.price),
        category: formData.category,
        image_url: finalImageUrl,
        is_vip_only: formData.is_vip_only || false,
        brand: formData.brand || null,
        sizes: formData.sizes || null,
        stock_status: formData.stock_status || "In Stock",
        highlight_tag: formData.highlight_tag || null,
      });
    } else if (adminTab === "predictions") {
      Object.assign(payload, {
        league_name: formData.league,
        team_a_name: formData.teamA,
        team_b_name: formData.teamB,
        team_a_logo: finalTeamALogo,
        team_b_logo: finalTeamBLogo,
      });
    }

    try {
      if (editingId)
        await supabase.from(adminTab).update(payload).eq("id", editingId);
      else {
        if (adminTab === "predictions")
          await supabase
            .from("predictions")
            .update({ is_active: false })
            .neq("id", 0);
        await supabase.from(adminTab).insert([payload]);
      }
      closeAdmin();
      setUploading(false);
      fetchData();
    } catch (err) {
      alert(
        "DB Error! Did you make sure to add the new columns (brand, sizes, stock_status, highlight_tag) to Supabase?"
      );
      setUploading(false);
    }
  };

  const handleBotOrderSubmit = async (e) => {
    e.preventDefault();

    if (orderDestination === "local") {
      if (
        orderPhone.length !== 10 ||
        (!orderPhone.startsWith("09") && !orderPhone.startsWith("07"))
      ) {
        alert("Local phone must be 10 digits and start with 09 or 07.");
        return;
      }
    } else {
      if (orderPhone.length < 7) {
        alert("Please enter a valid international phone number.");
        return;
      }
      if (
        receiverPhone.length !== 10 ||
        (!receiverPhone.startsWith("09") && !receiverPhone.startsWith("07"))
      ) {
        alert(
          "The receiver's Ethiopian phone number must be 10 digits and start with 09 or 07."
        );
        return;
      }
    }

    if (!orderReceipt) {
      alert("እባክዎ የክፍያ ደረሰኝዎን ያስገቡ (Please upload receipt)");
      return;
    }

    setIsSubmittingOrder(true);
    let basePrice = selectedProduct.price;
    let vipText = "";
    let isVipUser = user && user.isVIP;

    if (isVipUser) {
      basePrice = selectedProduct.price * 0.9;
      vipText = " (VIP 10% Discount Applied!)";
    }

    let shippingCost = orderShipping === "local_delivery" ? 150 : 500;

    if (orderDestination === "international") {
      // Waive the service fee for VIPs
      shippingCost = isVipUser ? 0 : 750; // Example 750 ETB handling fee for non-VIPs
      if (isVipUser) {
        vipText += " (International Service Fee Waived!)";
      }
    }

    const total = basePrice + shippingCost;
    const finalPhone =
      orderDestination === "local"
        ? orderPhone
        : `${countryCode} ${orderPhone} (Receiver: ${receiverPhone})`;

    try {
      const orderPayload = {
        user_id: user ? user.id : null,
        customer_name: orderName,
        phone: finalPhone,
        product_name: selectedProduct.name,
        total_price: total,
        shipping_method:
          orderDestination === "local" ? orderShipping : "Diaspora Delivery",
        is_vip: isVipUser,
        order_type: "product",
        status: "Pending",
      };

      const { error: dbError } = await supabase
        .from("orders")
        .insert([orderPayload]);
      if (dbError) console.error("Supabase Analytics Save Error:", dbError);
      else fetchData();
    } catch (err) {
      console.error("Database connection issue:", err);
    }

    const adminCaptionText = `🚨 <b>New Order Received!</b>\n\n📦 <b>Product:</b> ${
      selectedProduct.name
    }\n👤 <b>Customer:</b> ${orderName}\n🌍 <b>Type:</b> ${orderDestination.toUpperCase()}\n📞 <b>Phone:</b> ${finalPhone}\n🚚 <b>Shipping:</b> ${orderShipping}\n💰 <b>Total Paid:</b> ${total} ETB${vipText}`;
    const formPayload = new FormData();
    formPayload.append("chat_id", CHAT_ID);
    formPayload.append("photo", orderReceipt);
    formPayload.append("caption", adminCaptionText);
    formPayload.append("parse_mode", "HTML");

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${ORDERS_BOT_TOKEN}/sendPhoto`,
        { method: "POST", body: formPayload }
      );
      if (response.ok) {
        if (user && user.id) {
          try {
            const customerMsg = `✅ <b>ትዕዛዝዎ ደርሶናል! (Order Received!)</b>\n\n📦 <b>እቃ (Product):</b> ${selectedProduct.name}\n💰 <b>የተከፈለ (Total Paid):</b> ${total} ETB\n\nWe are verifying your payment and processing your order. You can track this order in your My Account Dashboard!\n\n- Goleth Team`;
            const customerPayload = {
              chat_id: user.id,
              text: customerMsg,
              parse_mode: "HTML",
            };
            await fetch(
              `https://api.telegram.org/bot${APP_BOT_TOKEN}/sendMessage`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customerPayload),
              }
            );
          } catch (e) {
            console.error("Failed to send customer confirmation", e);
          }
        }

        alert(
          "ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል! (Order submitted successfully!)\n\nYou can now track your order status in your Profile Dashboard."
        );
        setSelectedProduct(null);
        setActiveProductImageIndex(0);
        setOrderName("");
        setOrderPhone("");
        setReceiverPhone("");
        setOrderReceipt(null);
      } else {
        const errorData = await response.json();
        alert(
          `ትዕዛዙ አልተላከም። (Failed to send order.)\nReason: ${
            errorData.description || "Unknown error"
          }`
        );
      }
    } catch (error) {
      alert("ስህተት አጋጥሟል። በይነመረብዎን ያረጋግጡ። (Check internet connection.)");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleVipRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!vipReceipt) {
      alert("እባክዎ የክፍያ ደረሰኝዎን ያስገቡ (Please upload receipt)");
      return;
    }
    setIsSubmittingVip(true);

    try {
      const vipPayload = {
        user_id: user ? user.id : null,
        customer_name: user.name,
        phone: vipPhone,
        product_name: "Goleth VIP 1-Month Membership",
        total_price: 50,
        shipping_method: "Digital Delivery",
        is_vip: false,
        order_type: "vip_signup",
        status: "Pending",
      };
      const { error: dbError } = await supabase
        .from("orders")
        .insert([vipPayload]);
      if (dbError) console.error("Database tracking error:", dbError);
    } catch (err) {
      console.error(err);
    }

    const adminCaptionText = `👑 <b>New VIP Subscription Request!</b>\n\n👤 <b>User Name:</b> ${user.name}\n📞 <b>Phone Number:</b> ${vipPhone}\n💰 <b>Amount Due:</b> 50 ETB\n\n<i>Verify payment on your bank app, then mark this user as VIP in CEO Studio!</i>`;
    const formPayload = new FormData();
    formPayload.append("chat_id", CHAT_ID);
    formPayload.append("photo", vipReceipt);
    formPayload.append("caption", adminCaptionText);
    formPayload.append("parse_mode", "HTML");

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${ORDERS_BOT_TOKEN}/sendPhoto`,
        { method: "POST", body: formPayload }
      );
      if (response.ok) {
        if (user && user.id) {
          try {
            const customerMsg = `👑 <b>የቪአይፒ ጥያቄዎ ደርሶናል! (VIP Request Received!)</b>\n\nየ 50 ብር ክፍያዎን እንዳረጋገጥን አካውንትዎን ወደ VIP እናሳድጋለን። እናመሰግናለን! (Once we verify your payment, your account will be upgraded.)\n\n- Goleth Team`;
            const customerPayload = {
              chat_id: user.id,
              text: customerMsg,
              parse_mode: "HTML",
            };
            await fetch(
              `https://api.telegram.org/bot${APP_BOT_TOKEN}/sendMessage`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customerPayload),
              }
            );
          } catch (e) {
            console.error("Failed to send customer confirmation", e);
          }
        }
        alert("የክፍያ ማረጋገጫዎ ተልኳል! (Request sent!)");
        setVipPhone("");
        setVipReceipt(null);
        fetchData();
      } else {
        alert("የክፍያ ደረሰኙ አልተላከም። እባክዎ እንደገና ይሞክሩ።");
      }
    } catch (error) {
      alert("የመረብ ግንኙነት ችግር አጋጥሟል።");
    } finally {
      setIsSubmittingVip(false);
    }
  };

  const handleSourcingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("እባክዎ የቴሌግራም ቁልፉን ተጠቅመው ይግቡ (Please log in via Telegram first).");
      setShowSourcingModal(false);
      handleNavClick("ቪአይፒ");
      return;
    }
    const adminMessage = `🌍 <b>New Custom Sourcing Request</b>\n\n👤 <b>Customer:</b> ${user.name}\n🔗 <b>Link:</b> ${sourcingLink}`;
    try {
      await fetch(
        `https://api.telegram.org/bot${ORDERS_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: adminMessage,
            parse_mode: "HTML",
          }),
        }
      );
      try {
        const customerMsg = `✅ <b>የግል እቃ ጥያቄዎ ደርሶናል! (Sourcing Request Received!)</b>\n\n🔗 <b>Link:</b> ${sourcingLink}\n\nዋጋውን እና መጓጓዣውን አጣርተን በቅርቡ እናሳውቅዎታለን።\n\n- Goleth Team`;
        await fetch(
          `https://api.telegram.org/bot${APP_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: user.id,
              text: customerMsg,
              parse_mode: "HTML",
            }),
          }
        );
      } catch (err) {
        console.error("Could not send customer DM", err);
      }
      setShowSourcingModal(false);
      setSourcingLink("");
      alert("ጥያቄዎ ተልኳል! (Request sent!)");
    } catch (error) {
      alert("There was an error sending your link. Please try again.");
    }
  };

  const toggleReadMore = (id) =>
    setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getMaskedAuthor = (dbAuthor) => {
    if (!dbAuthor) return "Goleth";
    return dbAuthor.toLowerCase().includes("zenasoccer") ? "Goleth" : dbAuthor;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "text-orange-500 bg-orange-500/10 border-orange-500/30";
      case "Out for Delivery":
        return "text-blue-500 bg-blue-500/10 border-blue-500/30";
      case "Completed":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      default:
        return "text-amber-500 bg-amber-500/10 border-amber-500/30"; // Pending
    }
  };

  const renderSmartBody = (text, imagesArray, isExpanded, articleId) => {
    if (!text) return null;
    if (!isExpanded) {
      let truncated = text.substring(0, 150) + "...";
      truncated = truncated.replace(/\[IMAGE\d+\]/g, "");
      return (
        <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
          {truncated}
        </p>
      );
    }
    const parts = text.split(/(\[IMAGE\d+\])/g);
    return (
      <div
        className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap cursor-pointer"
        onClick={() => toggleReadMore(articleId)}
      >
        {parts.map((part, i) => {
          const match = part.match(/\[IMAGE(\d+)\]/);
          if (match) {
            const imgIndex = parseInt(match[1], 10);
            if (imagesArray[imgIndex])
              return (
                <img
                  key={i}
                  src={imagesArray[imgIndex]}
                  alt=""
                  className="w-full my-4 rounded-lg object-cover"
                />
              );
            return null;
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  const renderCEOStudio = () => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total_price || 0),
      0
    );

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 overflow-y-auto">
        <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 p-6 shadow-2xl relative my-8">
          <button
            onClick={closeAdmin}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-black text-amber-500 mb-6">
            {editingId ? "Edit" : "CEO Studio"}
          </h2>
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            {!editingId && (
              <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {["news", "gossip", "products", "predictions", "analytics"].map(
                  (tab) => (
                    <button
                      type="button"
                      key={tab}
                      onClick={() => setAdminTab(tab)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                        adminTab === tab
                          ? "bg-amber-500 text-black"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  )
                )}
              </div>
            )}

            {adminTab === "analytics" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center">
                    <TrendingUp size={24} className="text-green-500 mb-2" />
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      Total Sales
                    </span>
                    <span className="text-2xl font-black text-white">
                      {totalRevenue}{" "}
                      <span className="text-sm text-zinc-500">ETB</span>
                    </span>
                  </div>
                  <div className="bg-black border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center">
                    <Package size={24} className="text-blue-500 mb-2" />
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      Orders
                    </span>
                    <span className="text-2xl font-black text-white">
                      {orders.length}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">
                    Live Order Pipeline
                  </h3>
                  <div className="bg-black border border-zinc-800 rounded-xl max-h-[60vh] overflow-y-auto p-2 space-y-2">
                    {orders.length === 0 && (
                      <p className="text-zinc-600 text-xs text-center py-4">
                        No orders yet.
                      </p>
                    )}
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        className="bg-zinc-900 p-4 rounded-lg border border-zinc-800/50"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-bold text-sm">
                            {o.customer_name}
                          </span>
                          <span className="text-amber-500 font-black text-sm">
                            {o.total_price} ETB
                          </span>
                        </div>
                        <div className="text-zinc-400 text-xs mb-1 truncate">
                          {o.product_name}
                        </div>
                        <div className="text-blue-400 text-xs mb-3">
                          {o.phone}
                        </div>

                        <div className="flex justify-between items-center bg-black p-2 rounded-lg border border-zinc-800">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                            Update Status:
                          </span>
                          <select
                            value={o.status || "Pending"}
                            onChange={(e) =>
                              handleUpdateOrderStatus(o.id, e.target.value)
                            }
                            className={`text-xs font-bold bg-transparent outline-none cursor-pointer ${
                              o.status === "Completed"
                                ? "text-green-500"
                                : o.status === "Out for Delivery"
                                ? "text-blue-500"
                                : o.status === "Processing"
                                ? "text-orange-500"
                                : "text-amber-500"
                            }`}
                          >
                            <option
                              value="Pending"
                              className="bg-zinc-900 text-amber-500"
                            >
                              Pending
                            </option>
                            <option
                              value="Processing"
                              className="bg-zinc-900 text-orange-500"
                            >
                              Processing
                            </option>
                            <option
                              value="Out for Delivery"
                              className="bg-zinc-900 text-blue-500"
                            >
                              Out for Delivery
                            </option>
                            <option
                              value="Completed"
                              className="bg-zinc-900 text-green-500"
                            >
                              Completed
                            </option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {["news", "gossip"].includes(adminTab) && (
              <>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                    Title
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category || "ዋና"}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                    >
                      <option value="ዋና">ዋና</option>
                      <option value="ሰበር ዜና">ሰበር ዜና (Breaking)</option>
                      <option value="የዝውውር ዜና">የዝውውር ዜና (Transfers)</option>
                      <option value="አስተያየት">አስተያየት</option>
                      <option value="ማህበራዊ">ማህበራዊ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author || "Goleth"}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                    Body Text
                  </label>
                  <textarea
                    required
                    rows="6"
                    value={formData.body || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, body: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-700"
                    placeholder="Type [IMAGE1], [IMAGE2] anywhere here..."
                  ></textarea>
                </div>
              </>
            )}

            {adminTab === "products" && (
              <>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                    Product Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Brand / Origin (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Nike, Made in CA"
                      value={formData.brand || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Highlight Tag (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Free Delivery!"
                      value={formData.highlight_tag || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          highlight_tag: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Sizes / Options (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., S, M, L, XL"
                      value={formData.sizes || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, sizes: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Stock Status
                    </label>
                    <select
                      value={formData.stock_status || "In Stock"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock_status: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock (Hurry!)">
                        Low Stock (Hurry!)
                      </option>
                      <option value="Pre-Order / Sourcing">
                        Pre-Order / Sourcing
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Add full details, tech specs, or materials here..."
                    value={formData.body || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, body: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Price (ETB)
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category || "ሌላ"}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                    >
                      <option value="ወንዶች">ወንዶች (Men)</option>
                      <option value="ሴቶች">ሴቶች (Women)</option>
                      <option value="ልጆች">ልጆች (Kids)</option>
                      <option value="መድሃኒት">መድሃኒት (Medicine)</option>
                      <option value="ሌላ">ሌላ (Other)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="flex items-center space-x-2 text-zinc-300 bg-black p-3 border border-zinc-800 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_vip_only || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_vip_only: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-amber-500 bg-black border-zinc-800"
                    />
                    <span className="text-sm font-bold text-amber-500">
                      Make this a VIP-Only Product
                    </span>
                  </label>
                </div>
              </>
            )}

            {adminTab === "predictions" && (
              <>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                    League
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.league || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, league: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Home Team
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.teamA || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, teamA: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                      Away Team
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.teamB || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, teamB: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white"
                    />
                  </div>
                </div>
                <div className="bg-black p-3 border border-zinc-800 rounded-lg">
                  <label className="text-[10px] text-amber-500 uppercase block mb-2 font-bold">
                    Team Logos (Upload)
                  </label>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-zinc-500 block mb-1">
                        Home Logo:
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setTeamAImageFile(e.target.files[0])}
                        className="text-[10px] text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-800 file:text-white w-full"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block mb-1">
                        Away Logo:
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setTeamBImageFile(e.target.files[0])}
                        className="text-[10px] text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-800 file:text-white w-full"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {["news", "gossip", "products"].includes(adminTab) && (
              <div className="mt-4">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                  Select Images
                </label>
                <div className="flex items-center space-x-4 bg-black border border-zinc-800 rounded-lg p-3">
                  <ImageIcon size={20} className="text-amber-500" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-500"
                  />
                </div>
              </div>
            )}

            {adminTab !== "analytics" && (
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-amber-500 text-black font-black py-4 rounded-xl mt-4"
              >
                {uploading ? "Publishing..." : "አስገባ (Publish)"}
              </button>
            )}
          </form>
        </div>
      </div>
    );
  };

  const renderArticle = (item, isHero, table) => {
    const isExpanded = expandedPosts[item.id];
    const shouldTruncate = item.body && item.body.length > 150;
    const isBreaking = item.category === "ሰበር ዜና";
    const imagesArray = item.image_url ? item.image_url.split(",") : [];
    const mainImage = imagesArray[0];

    if (isHero) {
      return (
        <div
          key={item.id}
          className={`bg-zinc-900 rounded-xl overflow-hidden shadow-lg relative mb-4 border ${
            isBreaking ? "border-red-600" : "border-zinc-800"
          }`}
        >
          {isCEO && (
            <div className="absolute top-2 right-2 flex space-x-2 z-10">
              <button
                onClick={() => handleEdit(item, table)}
                className="bg-blue-600 p-2 rounded-full"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(table, item.id)}
                className="bg-red-600 p-2 rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          {mainImage && (
            <img
              src={mainImage}
              alt=""
              className="w-full aspect-[1.91/1] object-cover"
            />
          )}
          <div className="p-5">
            <h3
              className={`font-black text-2xl leading-tight mb-2 ${
                isBreaking ? "text-red-500" : "text-amber-500"
              }`}
            >
              {item.title}
            </h3>
            <div className="text-zinc-500 text-[10px] uppercase mb-2">
              {getMaskedAuthor(item.author)} • {formatDate(item.created_at)}
            </div>
            {renderSmartBody(item.body, imagesArray, isExpanded, item.id)}
            {shouldTruncate && (
              <button
                onClick={() => toggleReadMore(item.id)}
                className="text-amber-500 text-xs font-bold mt-3"
              >
                {isExpanded ? "አሳጥር" : "ሙሉውን ያንብቡ"}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={item.id}
        className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 mb-3 flex h-32 relative"
      >
        {isCEO && (
          <div className="absolute top-2 right-2 flex space-x-2 z-10 bg-black/50 p-1 rounded">
            <button onClick={() => handleEdit(item, table)}>
              <Edit size={14} className="text-blue-400" />
            </button>
            <button onClick={() => handleDelete(table, item.id)}>
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        )}
        {mainImage ? (
          <img src={mainImage} className="w-1/3 h-full object-cover" alt="" />
        ) : (
          <div className="w-1/3 bg-black flex items-center justify-center text-xs text-zinc-800">
            GOLETH
          </div>
        )}
        <div className="w-2/3 p-3 flex flex-col justify-center">
          <h3 className="text-white font-bold text-sm line-clamp-2">
            {item.title}
          </h3>
          <span className="text-zinc-500 text-[10px] mt-1">
            {formatDate(item.created_at)}
          </span>
        </div>
      </div>
    );
  };

  const renderNewsFeed = (
    feedData,
    currentCategory,
    setCategoryFunc,
    categoriesList
  ) => {
    const filteredData =
      currentCategory === "ዋና" || currentCategory === "ሁሉም"
        ? feedData
        : feedData.filter((n) => n.category === currentCategory);
    const visibleData = filteredData.slice(0, newsLimit);
    return (
      <div className="pb-24 pt-2">
        <div className="flex overflow-x-auto space-x-2 mb-4 pb-2 scrollbar-hide">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                if (cat === "ያግኙን") {
                  window.location.href = "mailto:contactgoleth@gmail.com";
                  return;
                }
                setCategoryFunc(cat);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                currentCategory === cat
                  ? "bg-amber-500 text-black"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {visibleData.map((item, index) =>
            renderArticle(item, index === 0, "news")
          )}
        </div>
      </div>
    );
  };

  const renderProfileDashboard = () => (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/90 p-0 sm:p-4 transition-all duration-300">
      <div className="bg-zinc-950 w-full sm:max-w-2xl h-[90vh] sm:h-[80vh] rounded-t-3xl sm:rounded-2xl border-t sm:border border-zinc-800 flex flex-col relative overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {/* Header Area */}
        <div className="bg-zinc-900 border-b border-zinc-800 p-6 relative">
          <button
            onClick={() => setShowProfile(false)}
            className="absolute top-6 right-6 text-zinc-500 hover:text-white bg-black p-2 rounded-full border border-zinc-800"
          >
            <X size={20} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-3xl font-black text-black shadow-lg uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {user.isVIP ? (
                  <span className="bg-amber-500/20 text-amber-500 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 border border-amber-500/30">
                    <Crown size={12} /> VIP Active
                  </span>
                ) : (
                  <span className="bg-zinc-800 text-zinc-400 text-xs font-bold px-3 py-1 rounded-full border border-zinc-700">
                    Free Account
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-xs text-zinc-500">
              Member since:{" "}
              <span className="text-zinc-300 font-bold">
                {userJoinedDate ? formatDate(userJoinedDate) : "Recently"}
              </span>
            </div>
            {user.isVIP && user.vipUntil && (
              <div className="text-xs font-bold text-amber-500 flex items-center gap-1">
                <Clock size={14} /> Renews: {formatDate(user.vipUntil)}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black">
          {/* VIP CTA if not VIP */}
          {!user.isVIP && (
            <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-5 flex justify-between items-center">
              <div>
                <h3 className="text-amber-500 font-black mb-1 flex items-center gap-2">
                  <Crown size={18} /> Upgrade to VIP
                </h3>
                <p className="text-zinc-400 text-xs">
                  Unlock 10% shop discounts, waived international fees, and
                  predictions!
                </p>
              </div>
              <button
                onClick={() => {
                  setShowProfile(false);
                  handleNavClick("ቪአይፒ");
                }}
                className="bg-amber-500 text-black text-xs font-black px-4 py-2 rounded-xl"
              >
                Upgrade
              </button>
            </div>
          )}

          {/* Order History */}
          <div>
            <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-500" /> My Order Tracking
            </h3>

            {myOrders.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                <ShoppingBag size={32} className="text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm font-bold">
                  You haven't placed any orders yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start sm:items-center mb-1">
                        <span className="text-white font-bold text-sm sm:text-base">
                          {order.product_name}
                        </span>
                        <span className="text-amber-500 font-black text-sm whitespace-nowrap ml-4">
                          {order.total_price} ETB
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                        {formatDate(order.created_at)} • {order.shipping_method}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-wider flex items-center gap-1 ${getStatusColor(
                            order.status || "Pending"
                          )}`}
                        >
                          {order.status === "Completed" ? (
                            <CheckCircle2 size={12} />
                          ) : order.status === "Out for Delivery" ? (
                            <Truck size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {order.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-zinc-900 border-t border-zinc-800 p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-900/10 border border-red-900/30 hover:bg-red-900/20 text-red-500 py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  const renderVIP = () => {
    if (!user && !isCEO) {
      return (
        <div className="pb-24 flex flex-col items-center justify-center pt-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center max-w-sm w-full shadow-2xl">
            <Users size={30} className="text-[#229ED9] mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">
              እንኳን በደህና መጡ!
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              አዲስ መለያ ለመፍጠር ወይም ለመግባት የቴሌግራም ቁልፉን ይጫኑ።
            </p>
            <TelegramLoginWidget onAuth={handleRealLogin} />
          </div>
        </div>
      );
    }

    if (user && !user.isVIP && !isCEO) {
      return (
        <div className="pb-24 flex flex-col items-center pt-6 px-2">
          <div className="text-center mb-8">
            <Crown
              size={40}
              className="text-amber-500 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
            />
            <h2 className="text-3xl font-black text-white tracking-wider mb-1">
              GOLETH VIP
            </h2>
            <p className="text-zinc-400 text-xs px-4">
              Unlock exclusive matches, local discounts, and{" "}
              <b>$0 International Fees</b> for just <b>50 ETB/month</b>.
            </p>
          </div>

          {predictions.length > 0 && (
            <div className="w-full max-w-sm mb-6">
              <h3 className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mb-2 pl-2">
                Sneak Peek: Today's Match
              </h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden flex items-center justify-between">
                <div className="absolute inset-0 backdrop-blur-[3px] bg-black/40 z-10 flex items-center justify-center">
                  <div className="bg-amber-500 text-black px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-xl">
                    <Lock size={12} /> VIP ONLY PREDICTION
                  </div>
                </div>
                <span className="text-white font-bold opacity-30">
                  {predictions[0].team_a_name}
                </span>
                <span className="text-zinc-600 font-black text-xs opacity-50">
                  VS
                </span>
                <span className="text-white font-bold opacity-30">
                  {predictions[0].team_b_name}
                </span>
              </div>
            </div>
          )}

          {products.filter((p) => p.is_vip_only).length > 0 && (
            <div className="w-full max-w-sm mb-8">
              <h3 className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mb-2 pl-2">
                Sneak Peek: VIP Shop
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {products
                  .filter((p) => p.is_vip_only)
                  .slice(0, 3)
                  .map((p) => {
                    const mainImg = p.image_url
                      ? p.image_url.split(",")[0]
                      : null;
                    return (
                      <div
                        key={p.id}
                        className="min-w-[120px] bg-zinc-900 rounded-xl border border-zinc-800 p-2 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 z-10 flex items-center justify-center">
                          <Lock
                            size={20}
                            className="text-amber-500 drop-shadow-lg"
                          />
                        </div>
                        {mainImg ? (
                          <img
                            src={mainImg}
                            className="w-full aspect-square object-cover rounded-lg opacity-40 mb-2"
                            alt=""
                          />
                        ) : (
                          <div className="w-full aspect-square bg-black rounded-lg mb-2"></div>
                        )}
                        <p className="text-white font-bold text-[10px] truncate opacity-50">
                          {p.name}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="bg-black border border-amber-500/30 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_30px_rgba(245,158,11,0.05)] text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Upgrade Now
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl text-left border border-zinc-800 mt-4 mb-6">
              <p className="text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-wider">
                የክፍያ መመሪያ (Payment Info):
              </p>
              <p className="text-sm font-black text-white">
                • CBE: <span className="text-amber-500">1000XXXXXXXXX</span>
              </p>
              <p className="text-sm font-black text-white">
                • Telebirr: <span className="text-amber-500">09XXXXXXXX</span>
              </p>
            </div>
            <form
              onSubmit={handleVipRegistrationSubmit}
              className="space-y-4 text-left border-t border-zinc-800/50 pt-6"
            >
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  ስልክ ቁጥር (Phone Number)
                </label>
                <input
                  required
                  type="tel"
                  value={vipPhone}
                  onChange={(e) => setVipPhone(e.target.value)}
                  placeholder="09..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  የክፍያ ደረሰኝ (Upload Receipt)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setVipReceipt(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 p-2 rounded-xl"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingVip}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl flex justify-center items-center space-x-2 transition-colors mt-2"
              >
                {isSubmittingVip ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                <span>{isSubmittingVip ? "በመላክ ላይ..." : "Upgrade to VIP"}</span>
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="pb-24 pt-6 flex flex-col items-center">
        <div className="text-center text-amber-500 font-black mb-6 border border-amber-500/50 bg-amber-500/10 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center space-x-2">
          <Crown size={20} />
          <span>የቪአይፒ አባል (VIP Member)</span>
        </div>

        {predictions.length > 0 ? (
          <div className="w-full max-w-sm">
            <h3 className="text-white font-black text-xl mb-4 text-center">
              ዛሬ ግምት (Today's Match)
            </h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              {isCEO && (
                <button
                  onClick={() => handleDelete("predictions", predictions[0].id)}
                  className="absolute top-3 right-3 p-2 bg-red-900/50 rounded-full text-red-500 z-10"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6">
                {predictions[0].league_name}
              </div>
              <div className="flex justify-between items-center relative z-10">
                <div className="flex flex-col items-center w-1/3">
                  <div className="w-16 h-16 bg-black border border-zinc-800 rounded-full flex items-center justify-center p-2 shadow-lg mb-3">
                    {predictions[0].team_a_logo ? (
                      <img
                        src={predictions[0].team_a_logo}
                        className="max-w-full max-h-full object-contain"
                        alt=""
                      />
                    ) : (
                      <span className="text-[10px] text-zinc-500">Logo</span>
                    )}
                  </div>
                  <span className="text-white font-bold text-center text-sm">
                    {predictions[0].team_a_name}
                  </span>
                </div>
                <div className="w-1/3 flex flex-col items-center">
                  <div className="bg-zinc-800 text-zinc-400 font-black text-xs px-3 py-1 rounded-full mb-2">
                    VS
                  </div>
                </div>
                <div className="flex flex-col items-center w-1/3">
                  <div className="w-16 h-16 bg-black border border-zinc-800 rounded-full flex items-center justify-center p-2 shadow-lg mb-3">
                    {predictions[0].team_b_logo ? (
                      <img
                        src={predictions[0].team_b_logo}
                        className="max-w-full max-h-full object-contain"
                        alt=""
                      />
                    ) : (
                      <span className="text-[10px] text-zinc-500">Logo</span>
                    )}
                  </div>
                  <span className="text-white font-bold text-center text-sm">
                    {predictions[0].team_b_name}
                  </span>
                </div>
              </div>

              {existingPrediction ? (
                <div className="mt-8 bg-green-900/20 border border-green-500/30 rounded-xl p-4 text-center">
                  <p className="text-green-500 text-xs font-bold uppercase mb-2 flex items-center justify-center gap-1">
                    <CheckCircle2 size={14} /> ግምትዎ ተልኳል
                  </p>
                  <div className="flex justify-center items-center space-x-4">
                    <span className="text-2xl font-black text-white">
                      {existingPrediction.team_a_score}
                    </span>
                    <span className="text-zinc-500">-</span>
                    <span className="text-2xl font-black text-white">
                      {existingPrediction.team_b_score}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-8 border-t border-zinc-800 pt-6">
                  <p className="text-center text-xs text-zinc-400 font-bold mb-4">
                    ግምትዎን ያስገቡ (Enter Prediction)
                  </p>
                  <div className="flex justify-center items-center space-x-4 mb-6">
                    <input
                      type="number"
                      min="0"
                      value={teamAScore}
                      onChange={(e) => setTeamAScore(e.target.value)}
                      className="w-16 h-16 bg-black border-2 border-zinc-800 focus:border-amber-500 rounded-xl text-center text-2xl font-black text-white outline-none"
                    />
                    <span className="text-zinc-600 font-black">-</span>
                    <input
                      type="number"
                      min="0"
                      value={teamBScore}
                      onChange={(e) => setTeamBScore(e.target.value)}
                      className="w-16 h-16 bg-black border-2 border-zinc-800 focus:border-amber-500 rounded-xl text-center text-2xl font-black text-white outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handlePredictSubmit(predictions[0].id)}
                    disabled={
                      predictionStatus === "loading" ||
                      teamAScore === "" ||
                      teamBScore === ""
                    }
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black py-4 rounded-xl flex justify-center items-center space-x-2"
                  >
                    {predictionStatus === "loading" ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Target size={20} />
                    )}
                    <span>አስገባ (Submit)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-zinc-500 font-bold mt-10">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
              <Trophy size={24} className="text-zinc-700" />
            </div>
            ምንም ጨዋታ የለም (No active match)
          </div>
        )}
      </div>
    );
  };

  const renderShop = () => {
    const filteredProducts =
      shopCategory === "ሁሉም"
        ? products
        : products.filter((p) => p.category === shopCategory);
    return (
      <div className="pb-24 pt-2">
        <div className="flex overflow-x-auto space-x-2 mb-4 pb-2 scrollbar-hide">
          {shopCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setShopCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                shopCategory === cat
                  ? "bg-amber-500 text-black"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowSourcingModal(true)}
          className="w-full max-w-md mx-auto mb-6 flex items-center justify-center space-x-2 bg-amber-500/10 border border-amber-500/50 hover:bg-amber-500/20 text-amber-500 font-bold py-3 px-4 rounded-xl transition-colors"
        >
          <PlusCircle size={18} />
          <span>የግል እቃ ይዘዙ (Custom Sourcing Request)</span>
        </button>

        <div className="flex flex-col space-y-6">
          {filteredProducts.map((item) => {
            const productImages = item.image_url
              ? item.image_url.split(",")
              : [];
            const mainImg = productImages[0];
            const isVipOnly = item.is_vip_only;
            const canBuy = !isVipOnly || (user && user.isVIP) || isCEO;

            return (
              <div
                key={item.id}
                className={`bg-zinc-900 rounded-2xl overflow-hidden shadow-xl max-w-md mx-auto w-full border relative ${
                  isVipOnly ? "border-amber-500/30" : "border-zinc-800"
                }`}
              >
                {/* Custom Highlight Tag Badge */}
                {item.highlight_tag && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded shadow-lg uppercase z-10 tracking-widest">
                    {item.highlight_tag}
                  </div>
                )}

                {isCEO && (
                  <div className="absolute top-3 right-3 flex space-x-2 z-10 bg-black/50 p-1.5 rounded-lg">
                    <button
                      onClick={() => handleEdit(item, "products")}
                      className="p-1"
                    >
                      <Edit size={16} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete("products", item.id)}
                      className="p-1"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                )}

                {mainImg ? (
                  <img
                    src={mainImg}
                    className="w-full aspect-square object-cover"
                    alt=""
                  />
                ) : (
                  <div className="w-full aspect-square bg-black"></div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-amber-500 font-bold uppercase">
                      {item.category}
                    </span>
                    {isVipOnly && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-black flex items-center gap-1">
                        <Lock size={10} /> VIP ONLY
                      </span>
                    )}
                  </div>

                  {/* Brand / Origin (Optional) */}
                  {item.brand && (
                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">
                      {item.brand}
                    </div>
                  )}

                  <h3 className="text-white font-black text-xl mb-3">
                    {item.name}
                  </h3>

                  {/* Stock Status Indicator */}
                  {item.stock_status && (
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.stock_status.includes("Low")
                            ? "bg-red-500 animate-pulse"
                            : item.stock_status.includes("Pre")
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      ></span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {item.stock_status}
                      </span>
                    </div>
                  )}

                  {/* Dynamic Sizes/Options */}
                  {item.sizes && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.sizes.split(",").map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-zinc-950 text-zinc-300 text-[10px] font-black px-3 py-1.5 rounded-md border border-zinc-800 uppercase tracking-widest"
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.body && (
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed whitespace-pre-wrap border-b border-zinc-800/50 pb-4">
                      {item.body}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-[10px] font-bold uppercase">
                        Price
                      </span>
                      <div className="flex items-center space-x-2">
                        {user && user.isVIP ? (
                          <>
                            <p className="text-amber-500 font-black text-2xl">
                              {Math.round(item.price * 0.9)} ብር
                            </p>
                            <p className="text-zinc-500 line-through text-sm">
                              {item.price}
                            </p>
                          </>
                        ) : (
                          <p
                            className={`font-black text-2xl ${
                              isVipOnly ? "text-zinc-500" : "text-amber-500"
                            }`}
                          >
                            {item.price} ብር
                          </p>
                        )}
                      </div>
                    </div>

                    {canBuy ? (
                      <button
                        onClick={() => {
                          setSelectedProduct(item);
                          setActiveProductImageIndex(0);
                          setOrderDestination("local");
                        }}
                        className="bg-amber-500 text-black font-black px-6 py-3 rounded-xl hover:bg-amber-400"
                      >
                        እዘዝ
                      </button>
                    ) : (
                      <button
                        onClick={() => handleNavClick("ቪአይፒ")}
                        className="bg-zinc-800 text-amber-500 border border-amber-500/30 font-black px-4 py-3 rounded-xl hover:bg-zinc-700 flex items-center space-x-1"
                      >
                        <Lock size={16} /> <span>VIP ብቻ</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "ዜና", icon: Home },
    { id: "ስፖርት", icon: Trophy },
    { id: "ሹክሹክታ", icon: Flame },
    { id: "ቪአይፒ", icon: Crown },
    { id: "ሱቅ", icon: ShoppingBag },
  ];

  const currentOrderImages =
    selectedProduct && selectedProduct.image_url
      ? selectedProduct.image_url.split(",")
      : [];

  // VIP Expiry check for warning banner
  let vipDaysLeft = 0;
  let showVipWarning = false;
  if (user && user.isVIP && user.vipUntil) {
    vipDaysLeft = Math.ceil(
      (new Date(user.vipUntil) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (vipDaysLeft <= 7 && vipDaysLeft > 0) showVipWarning = true;
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black font-sans text-white">
      {/* WARNING BANNER */}
      {showVipWarning && (
        <div
          className="bg-amber-500 text-black px-4 py-2 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          onClick={() => handleNavClick("ቪአይፒ")}
        >
          <AlertTriangle size={16} /> Your VIP expires in {vipDaysLeft} days!
          Renew now to keep benefits.
        </div>
      )}

      <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 p-4 flex justify-between items-center">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={handleLogoTap}
        >
          <h1 className="text-white font-black text-2xl tracking-widest">
            GOL<span className="text-amber-500">ETH</span>
          </h1>
        </div>
        <div>
          {user ? (
            <div
              onClick={() => setShowProfile(true)}
              className="bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800 cursor-pointer text-xs font-bold flex items-center gap-2"
            >
              <div className="w-5 h-5 bg-amber-500 rounded-full text-black flex items-center justify-center font-black uppercase">
                {user.name.charAt(0)}
              </div>
              {user.name}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick("ቪአይፒ")}
              className="text-xs font-bold bg-[#229ED9] px-4 py-2 rounded-full text-white"
            >
              ይግቡ / ይመዝገቡ
            </button>
          )}
        </div>
      </header>

      {showProfile && renderProfileDashboard()}
      {showAdmin && renderCEOStudio()}

      {/* SOURCING CHECKOUT MODAL */}
      {showSourcingModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 px-4">
          <div className="bg-zinc-900 border border-amber-500 p-6 rounded-2xl w-full max-w-md shadow-[0_0_15px_rgba(245,158,11,0.2)] relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-amber-500">የግል እቃ ይዘዙ</h2>
              <button
                onClick={() => setShowSourcingModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-zinc-400 mb-6 text-xs leading-relaxed">
              ከ Amazon፣ BestBuy፣ ወይም ሌላ የዩኤስ ሱቅ እቃ መግዛት ይፈልጋሉ? ሊንኩን ከታች ያስገቡ።
              እቃውን እና መጓጓዣውን አጠቃልለን ዋጋውን እናሳውቅዎታለን።
            </p>
            <form onSubmit={handleSourcingSubmit}>
              <input
                type="url"
                required
                placeholder="https://www.amazon.com/item..."
                className="w-full p-3 rounded-xl bg-black border border-zinc-800 focus:border-amber-500 text-white mb-4 outline-none transition-colors"
                value={sourcingLink}
                onChange={(e) => setSourcingLink(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3 rounded-xl transition-colors"
              >
                ሊንክ ላክ (Send Link)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL CHECKOUT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 px-4">
          <div className="bg-zinc-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 p-6 relative">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag size={20} /> Order Details
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-zinc-800 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex space-x-2 mb-6 bg-black p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setOrderDestination("local")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  orderDestination === "local"
                    ? "bg-amber-500 text-black"
                    : "text-zinc-500"
                }`}
              >
                <MapPin size={14} /> Local Order
              </button>
              <button
                onClick={() => setOrderDestination("international")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  orderDestination === "international"
                    ? "bg-amber-500 text-black"
                    : "text-zinc-500"
                }`}
              >
                <Globe2 size={14} /> Diaspora Gift
              </button>
            </div>

            <form onSubmit={handleBotOrderSubmit} className="space-y-4">
              {currentOrderImages.length > 0 && (
                <img
                  src={currentOrderImages[activeProductImageIndex]}
                  className="w-full h-32 object-cover rounded-xl border border-zinc-800 mb-2"
                  alt=""
                />
              )}

              {/* Conditional VIP Upsell Banner */}
              {!user?.isVIP && (
                <div className="bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30 p-3 rounded-xl mb-4">
                  <p className="text-amber-500 text-[10px] font-black uppercase mb-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Wait! You're paying full price.
                  </p>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {orderDestination === "local"
                      ? "VIP Members get an instant 10% discount on this item. Close this window and upgrade to VIP first!"
                      : "Diaspora VIP Benefit: Become a Goleth VIP and we will completely WAIVE the international service handling fee on this order!"}
                  </p>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  Your Full Name
                </label>
                <input
                  required
                  type="text"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {orderDestination === "local" ? (
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                    Local Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={orderPhone}
                    onChange={(e) => setOrderPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                      Your International Phone
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none w-24"
                      >
                        <option value="+1">US/CA (+1)</option>
                        <option value="+44">UK (+44)</option>
                        <option value="+971">UAE (+971)</option>
                        <option value="+49">GER (+49)</option>
                        <option value="+251">ETH (+251)</option>
                      </select>
                      <input
                        required
                        type="tel"
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1 text-amber-500">
                      Receiver's Phone (In Ethiopia)
                    </label>
                    <input
                      required
                      type="tel"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      placeholder="09..."
                      className="w-full bg-amber-500/5 border border-amber-500/30 rounded-xl p-3 text-white outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {orderDestination === "local" && (
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                    Shipping Method
                  </label>
                  <select
                    value={orderShipping}
                    onChange={(e) => setOrderShipping(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="local_delivery">በከተማ ውስጥ (+150 ETB)</option>
                    <option value="traveler">በመንገደኛ መላክ (+500 ETB)</option>
                  </select>
                </div>
              )}

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mt-4">
                <p className="text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-wider">
                  Payment Instructions:
                </p>
                {orderDestination === "local" ? (
                  <>
                    <p className="text-sm font-black text-white">
                      • CBE:{" "}
                      <span className="text-amber-500">1000XXXXXXXXX</span>
                    </p>
                    <p className="text-sm font-black text-white">
                      • Telebirr:{" "}
                      <span className="text-amber-500">09XXXXXXXX</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black text-white mb-2">
                      • PayPal:{" "}
                      <span className="text-blue-400">paypal.me/goleth</span>
                    </p>
                    <p className="text-sm font-black text-white">
                      • Sendwave / Remitly to Receiver
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-2 italic">
                      * Upload screenshot of successful transfer below.
                    </p>
                  </>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  Upload Receipt
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setOrderReceipt(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 bg-black border border-zinc-800 p-2 rounded-xl focus:border-amber-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl mt-2 flex justify-center items-center gap-2 transition-colors"
              >
                {isSubmittingOrder ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                <span>
                  {isSubmittingOrder ? "Processing..." : "Confirm & Send"}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="p-4 max-w-lg mx-auto pb-32 relative">
        {activeTab === "ዜና" &&
          renderNewsFeed(news, newsCategory, setNewsCategory, newsCategories)}
        {activeTab === "ስፖርት" &&
          renderNewsFeed(
            news,
            sportCategory,
            setSportCategory,
            sportCategories
          )}
        {activeTab === "ሹክሹክታ" && (
          <div className="space-y-4">
            {gossip.map((g, index) => renderArticle(g, index === 0, "gossip"))}
          </div>
        )}
        {activeTab === "ቪአይፒ" && renderVIP()}
        {activeTab === "ሱቅ" && renderShop()}

        {/* CEO FLOATING ACTION BUTTON */}
        {isCEO && !showAdmin && (
          <button
            onClick={() => {
              let defaultTab = "news";
              if (activeTab === "ሱቅ") defaultTab = "products";
              if (activeTab === "ሹክሹክታ") defaultTab = "gossip";
              if (activeTab === "ቪአይፒ") defaultTab = "predictions";
              handleEdit(null, defaultTab);
            }}
            className="fixed bottom-24 right-4 bg-amber-500 text-black p-4 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] z-30 hover:bg-amber-400 transition-transform active:scale-95 flex items-center justify-center"
          >
            <PlusCircle size={28} />
          </button>
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-zinc-950/95 border-t border-zinc-800 flex justify-around pb-6 pt-3 px-2 z-40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`flex flex-col items-center p-2 ${
                isActive ? "text-amber-500" : "text-white/90"
              }`}
            >
              <Icon size={isActive ? 26 : 24} className="mb-1.5" />
              <span className="text-[11px] font-bold">{tab.id}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
