import React from "react";
import { Target, Home, Package } from "lucide-react";

export default function VipPanel({
  currentUser,
  setShowLoginModal,
  hasPendingVip,
  isCEO,
  isVIP,
  vipStatus,
  isFullNameValid,
  orderName,
  setOrderName,
  vipPhone,
  setVipPhone,
  vipReceiptFile,
  setVipReceiptFile,
  vipPaymentType,
  setVipPaymentType,
  currentUserProfile,
  handleVipPaymentSubmit,
  uploading,
  renderActualGames
}) {
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
        {renderActualGames && renderActualGames(true)}
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

              <input required name="fullName" value={orderName} onChange={e => setOrderName(e.target.value)} placeholder="ሙሉ ስም (የመጀመሪያ እና የአባት ስም)" className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-amber-500 outline-none text-base" onInvalid={(e) => e.target.setCustomValidity('እባክዎ ሙሉ ስም ያስገቡ (የመጀመሪያ እና የአባት ስም)')} onInput={(e) => e.target.setCustomValidity('')} />
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
        {renderActualGames && renderActualGames(true)}
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
      {renderActualGames && renderActualGames(false)}
    </div>
  );
}
