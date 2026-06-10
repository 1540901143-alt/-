import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Wallet,
  ShieldCheck,
  Palette,
  Check,
  ExternalLink,
  ChevronDown,
  Lock,
  Compass,
  Users,
  LineChart,
  ArrowRight,
  Sparkles,
  RefreshCw,
  LogOut,
  BellRing,
  HelpCircle
} from "lucide-react";
import { INITIAL_CHARACTERS, ROADMAP_ITEMS, FAQ_ITEMS, IMAGES } from "./data";
import { NFTCharacter } from "./types";
import WalletModal from "./components/WalletModal";
import CharacterDetail from "./components/CharacterDetail";
import DotGrid from "./components/DotGrid";
import BorderGlow from "./components/BorderGlow";

export default function App() {
  // Navigation & UI States
  const [activeSection, setActiveSection] = useState("project");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<NFTCharacter | null>(null);

  // Web3 Simulation States
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletProvider, setWalletProvider] = useState("");
  const [userBalance, setUserBalance] = useState(4.5); // Initial ETH Balance
  const [characters, setCharacters] = useState<NFTCharacter[]>(INITIAL_CHARACTERS);
  const [mintedCount, setMintedCount] = useState(7842);

  // FAQ collapse trackers
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Notifications system to mimic blockchain tx logs
  const [transactions, setTransactions] = useState<
    Array<{ id: string; type: string; details: string; time: string; value?: string }>
  >([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Subscribe state
  const [emailInput, setEmailInput] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  // Sticky header class logic
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple active link tracker based on scroll bounds
      const sections = ["project", "characters", "features", "ecosystem", "roadmap", "faq"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simple auto-mint simulator to make ecosystem feel alive!
  useEffect(() => {
    const timer = setInterval(() => {
      // Small chance to increment minted count every 15 seconds
      if (Math.random() > 0.4 && mintedCount < 10000) {
        setMintedCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [mintedCount]);

  const handleConnectWallet = (address: string, provider: string) => {
    setIsWalletConnected(true);
    setWalletAddress(address);
    setWalletProvider(provider);
    triggerNotification(`成功连接 ${provider} 钱包 (${address.substring(0, 8)})`);
    logTransaction("wallet_connect", `已连接 ${provider} 智能节点`, "0.00 ETH");
  };

  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    setWalletProvider("");
    triggerNotification("已断开数字钱包连接");
  };

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  const logTransaction = (type: string, details: string, value?: string) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setTransactions((prev) => [
      { id: Date.now().toString(), type, details, time: now, value },
      ...prev.slice(0, 4), // Maintain a maximum history of 5 items
    ]);
  };

  const deductBalance = (amount: number): boolean => {
    if (userBalance < amount) return false;
    setUserBalance((prev) => prev - amount);
    return true;
  };

  const handleMintSuccess = (characterId: string, ownerAddress: string) => {
    setCharacters((prevChars) =>
      prevChars.map((char) =>
        char.id === characterId ? { ...char, owner: ownerAddress } : char
      )
    );
    setMintedCount((prev) => prev + 1);
    
    // Find character name
    const characterName = characters.find((c) => c.id === characterId)?.name || "安全凭证";
    triggerNotification(`🎉 铸造成功！您已获得该 ${characterName} 限量数字角色。`);
    
    // Log contract transaction
    const price = characters.find((c) => c.id === characterId)?.price || "0.00 ETH";
    logTransaction("mint", `成功铸造 ${characterName} 智能资产`, price);

    // Update detail modal
    if (selectedCharacter && selectedCharacter.id === characterId) {
      setSelectedCharacter((prev) => prev ? { ...prev, owner: ownerAddress } : null);
    }
  };

  const scrollToId = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const toggleFAQ = (id: number) => {
    setExpandedFAQ((prev) => (prev === id ? null : id));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribeSuccess(true);
    triggerNotification("✉️ 订阅成功！最新内测计划已发送至您的邮箱。");
    setTimeout(() => {
      setEmailInput("");
      setSubscribeSuccess(false);
    }, 4000);
  };

  return (
    <div className="relative min-h-screen selection:bg-neutral-900 selection:text-white">
      
      {/* Dynamic Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#FAF8F5] text-neutral-900 rounded-full px-6 py-3 shadow-xl flex items-center gap-3 border border-neutral-200/50 text-xs md:text-sm max-w-[90vw] text-center"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-medium">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF9F6]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-neutral-200/35 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-display font-bold text-xl tracking-wider text-neutral-900 flex items-center gap-2 cursor-pointer"
          >
            <span className="w-2.5 h-6 rounded-xs bg-neutral-900 inline-block" />
            NFT CHARACTER
          </button>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[
              { label: "项目", id: "project" },
              { label: "角色阵容", id: "characters" },
              { label: "为什么选择我们", id: "features" },
              { label: "生态数据", id: "ecosystem" },
              { label: "发展路线图", id: "roadmap" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className={`relative py-1 cursor-pointer transition-colors ${
                  activeSection === item.id ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-900"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Actions Column (Connect Wallet) */}
          <div className="hidden md:flex items-center gap-4">
            {isWalletConnected ? (
              <div className="flex items-center gap-2.5 bg-white border border-neutral-100 rounded-full pl-3.5 pr-2 py-1.5 shadow-xs">
                {/* Wallet Balance Display */}
                <div className="text-right">
                  <div className="text-[10px] font-mono text-neutral-500 leading-none">WALLET ACC</div>
                  <div className="text-xs font-semibold text-neutral-800 font-mono mt-0.5">{userBalance.toFixed(2)} ETH</div>
                </div>
                
                {/* Visual Separator */}
                <span className="w-[1px] h-5 bg-neutral-100" />

                {/* Account details and action */}
                <div className="flex items-center gap-1.5 bg-neutral-50 pl-3.5 pr-1.5 py-1.5 rounded-full border border-neutral-100">
                  <span className="text-xs font-mono font-medium text-neutral-600 select-all">
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </span>
                  
                  {/* Disconnect indicator */}
                  <button
                    onClick={handleDisconnect}
                    title="断开连接"
                    className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="px-6 py-2.5 rounded-full text-xs font-display font-semibold font-mono tracking-wider bg-neutral-900 hover:bg-neutral-800 text-white transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Wallet className="w-4 h-4" /> Connect Wallet
              </button>
            )}
          </div>

          {/* Burger menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white text-neutral-500 hover:text-neutral-900 transition-all cursor-pointer border border-neutral-200/60"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-[#FCFAF7] border-b border-neutral-200/50 shadow-xl md:hidden overflow-hidden z-30"
            >
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-3 font-medium">
                  {[
                    { label: "项目", id: "project" },
                    { label: "角色阵容", id: "characters" },
                    { label: "为什么选择我们", id: "features" },
                    { label: "生态数据", id: "ecosystem" },
                    { label: "发展路线图", id: "roadmap" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToId(item.id)}
                      className="text-left py-2 text-neutral-500 hover:text-neutral-900 border-b border-neutral-100 transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  {isWalletConnected ? (
                    <div className="bg-white border border-neutral-100 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-500 font-mono">余额</span>
                        <span className="text-sm font-semibold font-mono text-neutral-800">{userBalance.toFixed(2)} ETH</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-500 font-mono">地址</span>
                        <span className="text-xs font-mono font-medium text-neutral-600">
                          {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 8)}
                        </span>
                      </div>
                      <button
                        onClick={handleDisconnect}
                        className="w-full py-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> 断开数字钱包
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsWalletModalOpen(true);
                      }}
                      className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold font-mono tracking-wider flex items-center justify-center gap-2"
                    >
                      <Wallet className="w-4 h-4" /> CONNECT WALLET
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* BODY CONTENT - GRID SECTIONS */}
      <main className="pt-28 pb-16 space-y-24 md:space-y-36">

        {/* HERO SECTION ("探索下一代 NFT数字角色") */}
        <section id="project" className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Hero Left Content */}
            <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF8F5] rounded-full border border-neutral-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-600 animate-pulse" />
                <span className="text-xs font-mono font-medium tracking-wider text-[#7E7D7A]">MEET THE NEXT GENERATION CHIPS</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-neutral-900 tracking-tight leading-tight md:leading-[1.1]"
              >
                探索下一代 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-600">
                  NFT数字角色
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[#7E7D7A] text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                融合顶尖艺术与区块链技术，打造独一无二的数字身份。在元宇宙中释放您的潜能，开启全新的互动体验。
              </motion.p>

              {/* Action buttons list */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={() => scrollToId("characters")}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                >
                  开始探索
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToId("faq")}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold bg-white text-[#7E7D7A] hover:bg-neutral-50 border border-neutral-200/60 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  了解更多
                </button>
              </motion.div>

              {/* Real-time Mint state indicator bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-2xl bg-white border border-neutral-200/50 max-w-md mx-auto lg:mx-0 shadow-xs"
              >
                <div className="flex justify-between items-center text-xs text-neutral-500 mb-1.5 font-mono">
                  <span className="flex items-center gap-1.5 font-sans font-semibold text-neutral-850">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    已铸造总额 Minted Progress
                  </span>
                  <span className="font-semibold text-neutral-850 font-mono">{mintedCount} / 10,000</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-neutral-900 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(mintedCount / 10000) * 100}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Hero Right Visual Asset */}
            <div className="w-full lg:w-1/2 relative flex justify-center">
              
              {/* Image Frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full max-w-[450px] aspect-square rounded-[40px] overflow-hidden bg-white shadow-2xl border-4 border-white flex items-center justify-center p-4"
              >
                {/* Floating Stats over Hero Image */}
                <div className="absolute inset-0 bg-neutral-900/5 backdrop-blur-xs flex items-center justify-center">
                  <img
                    src={IMAGES.hero}
                    alt="Hero Character"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03] select-none"
                  />
                </div>
                
                {/* Micro Float badge 1 */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-neutral-100 flex items-center gap-3"
                >
                  <div className="p-2 rounded-xl bg-neutral-100 text-neutral-850">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono tracking-wider block">LEVEL DEEPMIND</span>
                    <span className="text-xs font-semibold text-neutral-800">100% 极高清CG级别</span>
                  </div>
                </motion.div>

                {/* Micro Float badge 2 */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-neutral-100 flex items-center gap-3"
                >
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono tracking-wider block">FLOOR GROWTH</span>
                    <span className="text-xs font-semibold text-neutral-850">+25.8% (本周)</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION ("关于项目") */}
        <section className="bg-[#FCFAF7] py-20 border-y border-neutral-200/40">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* About Left Visual */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-[450px] aspect-square rounded-[40px] overflow-hidden bg-white shadow-xl border border-neutral-100"
              >
                <img
                  src={IMAGES.about}
                  alt="About Project Metadata"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none"
                />
                
                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-neutral-900/5 backdrop-blur-3xs" />
              </motion.div>
            </div>

            {/* About Right Content */}
            <div className="w-full lg:w-1/2 space-y-6 text-left">
              <span className="text-xs font-mono font-bold tracking-widest text-[#7E7D7A] uppercase">ESTABLISHED ON SECURE BLOCKCHAIN</span>
              <h2 className="text-3xl md:text-4xl font-display font-medium text-neutral-900">关于项目</h2>
              
              <div className="space-y-4 text-sm text-[#7E7D7A] leading-relaxed">
                <p>
                  NFT CHARACTER 不仅仅是一系列数字艺术品，它是一个完整的生态系统。我们致力于构建一个让创作者、持有者和开发者共同繁荣的平台。每一个角色都经过精心设计，拥有独特的背景故事和在未来游戏与社交场景中的实用功能。
                </p>
                <p>
                  通过去中心化的方式，我们确保了每一件资产的稀缺性与所有权，为数字时代的收藏家提供前所未有的价值保障。
                </p>
              </div>

              {/* Utility keynotes */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                <div className="space-y-1">
                  <span className="text-neutral-850 font-semibold text-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    高并发极速交易
                  </span>
                  <p className="text-xs text-[#7E7D7A] leading-relaxed">基于以太坊L2极低Gas打包传输。</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-850 font-semibold text-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    元宇宙跨链集成
                  </span>
                  <p className="text-xs text-[#7E7D7A] leading-relaxed">一键集成到 Decentraland 核心节点。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHARACTERS SECTION ("角色阵容") */}
        <section id="characters" className="max-w-7xl mx-auto px-6 md:px-12 text-center scroll-mt-24">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7E7D7A] font-bold">DISCOVER OUR CHARACTERS</span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-neutral-900">角色阵容</h2>
            <p className="text-xs text-[#7E7D7A] max-w-md mx-auto">
              每一位数字角色通过密码学证明保证绝对权属。点击卡片可查看高精度细节、技术参数并开启智能合约铸造。
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 text-left">
            {characters.map((char, index) => {
              
              // Define tag styles for card display in light theme
              const tagColors = {
                Legendary: "bg-amber-50 text-amber-700 border-amber-200/50",
                Epic: "bg-purple-50 text-purple-700 border-purple-200/50",
                Rare: "bg-sky-50 text-sky-700 border-sky-200/50",
              };

              return (
                <motion.div
                  key={char.id}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 25 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  onClick={() => setSelectedCharacter(char)}
                  className="group cursor-pointer"
                >
                  <BorderGlow
                    borderRadius={24}
                    backgroundColor="#FCFAF7"
                    glowColor={char.rarity === "Legendary" ? "35 90 70" : char.rarity === "Epic" ? "280 85 70" : "195 85 70"}
                    glowIntensity={0.8}
                    className="p-4"
                  >
                    {/* NFT Artwork container */}
                    <div className="relative aspect-square rounded-2xl bg-white flex items-center justify-center p-4 overflow-hidden mb-4 border border-neutral-200/20 shadow-xs">
                      <img
                        src={char.imageUrl}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500 select-none"
                      />
                      
                      {/* Hover status Overlay */}
                      <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 p-3">
                        <span className="px-4 py-2 bg-white text-neutral-900 font-display font-semibold rounded-full text-xs shadow-md tracking-wider flex items-center gap-1">
                          查看详情 VIEW DETAIL
                        </span>
                      </div>

                      {/* Left corner Tag floating */}
                      <div className="absolute top-2 left-2 z-10">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tagColors[char.rarity] || "bg-neutral-50 border-neutral-200 text-neutral-500"}`}>
                          {char.rarity}
                        </span>
                      </div>
                    </div>

                    {/* Text descriptions */}
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-[#7E7D7A] uppercase">
                        PRICE: {char.price}
                      </span>
                      <h3 className="text-lg font-display font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors mt-0.5">
                        {char.name}
                      </h3>
                      
                      {/* Owner detail footer */}
                      <div className="mt-3 pt-3 border-t border-neutral-200/40 flex items-center justify-between text-[11px] text-neutral-500">
                        <span className="font-mono">
                          {char.owner === walletAddress ? "⭐️ 归您所有" : char.owner.substring(0, 6) + "..."}
                        </span>
                        <span className="font-semibold text-neutral-800 bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-neutral-200/50">
                          {char.price}
                        </span>
                      </div>
                    </div>
                  </BorderGlow>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* WHY CHOOSE US ("为什么选择我们") */}
        <section id="features" className="max-w-7xl mx-auto px-6 md:px-12 space-y-12 scroll-mt-24">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7E7D7A] font-bold text-center">CORE ADVANTAGES</span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-neutral-900">为什么选择我们</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-6 h-6 text-neutral-900" />,
                title: "顶级安全保障",
                description: "基于全球领先的公链协议，确保您的数字资产永久确权，安全无虞。",
              },
              {
                icon: <Palette className="w-6 h-6 text-neutral-900" />,
                title: "卓越艺术设计",
                description: "联合知名CG艺术家倾力打造，每一处细节都彰显对数字美学的极致追求。",
              },
              {
                icon: <Compass className="w-6 h-6 text-neutral-900" />,
                title: "多元赋能生态",
                description: "持有角色即可解锁游戏权益、社区治理权及独家空投机会。",
              },
            ].map((box, i) => (
              <motion.div
                key={box.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="w-full h-full"
              >
                <BorderGlow
                  borderRadius={24}
                  backgroundColor="#FCFAF7"
                  glowColor="200 40 80"
                  glowIntensity={0.6}
                  className="p-8 h-full"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200/50 flex items-center justify-center shadow-xs">
                      {box.icon}
                    </div>
                    <h3 className="text-lg font-display font-semibold text-neutral-900">{box.title}</h3>
                    <p className="text-xs text-[#7E7D7A] leading-relaxed pr-2">{box.description}</p>
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ECOSYSTEM STATS ("生态数据") */}
        <section id="ecosystem" className="max-w-7xl mx-auto px-6 md:px-12 scroll-mt-24 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7E7D7A] font-bold">ECOSYSTEM LIVE METRICS</span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-neutral-900">生态数据</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { metric: "10,000+", label: "Total Supply", desc: "创世区块设定最高上限" },
              { metric: "5,000+", label: "Global Holders", desc: "全球去中心化持币地址" },
              { metric: "32.5K", label: "Volume Traded", desc: "二级市场全球交易活跃度" },
              { metric: "1.5 ETH", label: "Floor Price", desc: "主网认领最低评估价" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group"
              >
                <BorderGlow
                  borderRadius={24}
                  backgroundColor="#FCFAF7"
                  glowColor="340 70 80"
                  glowIntensity={0.6}
                  className="p-6 md:p-8 text-center h-full"
                >
                  <div className="space-y-2">
                    <span className="block text-2xl md:text-3.5xl font-mono font-bold text-neutral-900 group-hover:scale-[1.03] transition-transform">
                      {stat.metric}
                    </span>
                    <span className="block text-xs font-semibold text-[#7E7D7A] tracking-wider uppercase font-mono">
                      {stat.label}
                    </span>
                    <span className="block text-[10px] text-neutral-500">
                      {stat.desc}
                    </span>
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ROADMAP SECTION ("发展路线图") */}
        <section id="roadmap" className="max-w-7xl mx-auto px-6 md:px-12 scroll-mt-24 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7E7D7A] font-bold">MILESTONE ROADMAP</span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-neutral-900">发展路线图</h2>
          </div>

          {/* Timeline Node Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative pt-6">
            
            {/* Horizontal timeline connect line - hidden on mobile */}
            <div className="hidden md:block absolute top-[44px] left-[50px] right-[50px] h-0.5 bg-neutral-200" />

            {ROADMAP_ITEMS.map((item, i) => {
              const isCompleted = item.status === "Completed";
              const isInProgress = item.status === "In Progress";

              return (
                <motion.div
                  key={item.phase}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 25 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative space-y-4"
                >
                  {/* Circle marker */}
                  <div className="flex justify-center md:justify-start">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-mono font-bold text-sm border-4 border-[#FAF9F6] shadow-md relative z-10 transition-colors ${
                        isCompleted
                          ? "bg-neutral-900 text-white animate-pulse"
                          : isInProgress
                          ? "bg-white border-neutral-900 text-neutral-900"
                          : "bg-neutral-100 border-neutral-200 text-neutral-400"
                      }`}
                    >
                      {item.phase}
                    </div>
                  </div>

                  {/* Copy content */}
                  <div className="text-center md:text-left bg-[#FCFAF7] md:bg-transparent rounded-2xl p-5 md:p-0 border border-neutral-200/50 md:border-transparent">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-[10px] font-mono tracking-wider text-[#7E7D7A] uppercase leading-none">
                        {item.tagline}
                      </span>
                      {isInProgress && (
                        <span className="text-[9px] px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full font-mono">
                          LIVE
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-display font-bold text-neutral-900 mt-1">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-[#7E7D7A] leading-relaxed mt-2 pl-0.5 pr-2">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FAQ ACCORDION SECTION ("常见问题") */}
        <section id="faq" className="max-w-4xl mx-auto px-6 md:px-12 scroll-mt-24 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7E7D7A] font-bold">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-3xl font-display font-medium text-neutral-900">常见问题</h2>
          </div>

          <div className="space-y-3.5 pt-4">
            {FAQ_ITEMS.map((item) => {
              const isOpen = expandedFAQ === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-[#FCFAF7] rounded-2xl border border-neutral-200/50 overflow-hidden shadow-xs hover:border-neutral-200 transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(item.id)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer group"
                  >
                    <span className="font-semibold text-neutral-800 text-sm md:text-base group-hover:text-neutral-900 transition-colors">
                      {item.question}
                    </span>
                    <div className={`p-1.5 rounded-lg bg-[#FAF8F5] text-neutral-500 border border-neutral-200/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 md:px-6 md:pb-6 text-xs md:text-sm text-[#7E7D7A] leading-relaxed border-t border-neutral-200/30 pt-4">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA SECTION ("加入数字角色新时代") */}
        <section className="max-w-7xl mx-auto px-6 md:px-12">
          
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.98 }}
            viewport={{ once: true }}
            className="relative rounded-[36px] bg-[#FCFAF7] overflow-hidden p-8 md:p-16 text-center select-none shadow-xl border border-neutral-200/50"
          >
            {/* Dynamic Interactive Dot Matrix Background Aura */}
            <div className="absolute inset-0 z-0 opacity-80">
              <DotGrid
                dotSize={4}
                gap={15}
                baseColor="#FAF6F0"
                activeColor="#6336FF"
                proximity={120}
                shockRadius={250}
                shockStrength={5}
                resistance={750}
                returnDuration={1.5}
              />
            </div>

            {/* Glowing background decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-neutral-200/20 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6 md:space-y-8 pointer-events-auto">
              <span className="text-[10px] font-mono tracking-widest text-[#7E7D7A] uppercase font-bold leading-none block">
                COMMUNITY DRIVEN ECOSYSTEM
              </span>
              
              <h2 className="text-3xl md:text-4.5xl font-display font-medium text-neutral-900 tracking-tight leading-tight">
                加入数字角色新时代
              </h2>
              
              <p className="text-[#7E7D7A] text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
                成为先驱的一份子，立即开启您的元宇宙之旅。加入我们的社区，不错过任何重大更新。
              </p>

              {/* Instant Newsletter Form */}
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                <input
                  required
                  type="email"
                  placeholder="输入您的电子邮箱地址..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-5 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 text-xs placeholder:text-neutral-400 focus:outline-shadow focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all font-sans"
                />
                
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-neutral-950 text-white hover:bg-neutral-900 font-semibold text-xs transition-all tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {subscribeSuccess ? <Check className="w-4 h-4 text-emerald-500" /> : "立即加入 Discord"}
                </button>
              </form>
              
              <div className="flex justify-center items-center gap-6 pt-2 text-[11px] text-[#7E7D7A] font-mono">
                <a href="#github" className="hover:text-neutral-900 transition-colors flex items-center gap-1.5 cursor-pointer">
                  关注 Twitter (X)
                </a>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                <a href="#discord" className="hover:text-neutral-900 transition-colors flex items-center gap-1.5 cursor-pointer">
                  服务条款 Terms
                </a>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-[#FCFAF7] border-t border-neutral-200/50 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="space-y-2">
            <span className="font-display font-bold text-base tracking-wider text-neutral-900 block">
              NFT CHARACTER
            </span>
            <p className="text-xs text-[#7E7D7A]">
              © 2026 NFT CHARACTER. All rights reserved. Built with precision and decentralized protocols.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-[#7E7D7A] font-mono justify-center">
            <a href="#twitter" className="hover:text-neutral-900 transition-colors">Twitter</a>
            <a href="#discord" className="hover:text-neutral-900 transition-colors">Discord</a>
            <a href="#instagram" className="hover:text-neutral-900 transition-colors">Instagram</a>
            <a href="#terms" className="hover:text-neutral-900 transition-colors">Terms</a>
            <a href="#privacy" className="hover:text-neutral-900 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>

      {/* WALLET CONNECT DIALOG MODAL */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleConnectWallet}
      />

      {/* CHARACTER METADATA DETAIL CARD PANEL */}
      <CharacterDetail
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        onMintSuccess={handleMintSuccess}
        userBalance={userBalance}
        deductBalance={deductBalance}
      />
    </div>
  );
}
