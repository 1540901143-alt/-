import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldAlert, Cpu, Sparkles, User, Calendar, Tag, Check, Award, Flame, Hammer } from "lucide-react";
import { NFTCharacter } from "../types";

interface CharacterDetailProps {
  character: NFTCharacter | null;
  onClose: () => void;
  isWalletConnected: boolean;
  walletAddress: string;
  onMintSuccess: (characterId: string, ownerAddress: string) => void;
  userBalance: number;
  deductBalance: (amount: number) => boolean;
}

export default function CharacterDetail({
  character,
  onClose,
  isWalletConnected,
  walletAddress,
  onMintSuccess,
  userBalance,
  deductBalance,
}: CharacterDetailProps) {
  const [mintStatus, setMintStatus] = useState<"idle" | "verifying" | "signing" | "mining" | "success" | "insufficient">("idle");
  const [txHash, setTxHash] = useState<string>("");

  if (!character) return null;

  const isAlreadyOwnedByUser = character.owner.toLowerCase() === walletAddress.toLowerCase();

  const handleMint = () => {
    if (!isWalletConnected) return;

    // Parse price
    const priceEth = parseFloat(character.price.split(" ")[0]);
    if (userBalance < priceEth) {
      setMintStatus("insufficient");
      setTimeout(() => setMintStatus("idle"), 3000);
      return;
    }

    setMintStatus("verifying");

    // Phase 1: Verifying node
    setTimeout(() => {
      setMintStatus("signing");

      // Phase 2: Wallet Signature
      setTimeout(() => {
        setMintStatus("mining");

        // Phase 3: Block execution
        setTimeout(() => {
          const success = deductBalance(priceEth);
          if (success) {
            const randomHash = "0x" + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
            setTxHash(randomHash);
            setMintStatus("success");
            onMintSuccess(character.id, walletAddress);
          } else {
            setMintStatus("insufficient");
            setTimeout(() => setMintStatus("idle"), 3000);
          }
        }, 1200);
      }, 1000);
    }, 800);
  };

  // Border and badge color mapping based on rarity
  const rarityConfig = {
    Legendary: {
      text: "Legendary",
      badge: "bg-amber-500/10 text-amber-700 border-amber-200/50",
      glow: "shadow-[0_0_25px_rgba(245,158,11,0.15)]",
      gradient: "from-amber-600 to-amber-400",
    },
    Epic: {
      text: "Epic",
      badge: "bg-purple-500/10 text-purple-700 border-purple-200/50",
      glow: "shadow-[0_0_25px_rgba(168,85,247,0.15)]",
      gradient: "from-purple-600 to-purple-400",
    },
    Rare: {
      text: "Rare",
      badge: "bg-sky-500/10 text-sky-700 border-sky-200/50",
      glow: "shadow-[0_0_25px_rgba(14,165,233,0.15)]",
      gradient: "from-sky-600 to-sky-400",
    },
  };

  const config = rarityConfig[character.rarity || "Rare"];

  return (
    <AnimatePresence>
      <div id="character-detail-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0c0c0e]/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="relative w-full max-w-4xl bg-[#FCFAF7] rounded-[32px] overflow-hidden shadow-2xl border border-neutral-200/60 z-10 flex flex-col md:flex-row"
        >
          {/* Left Panel: High Res Img */}
          <div className="relative w-full md:w-1/2 bg-[#F3EFE9] flex items-center justify-center p-6 md:p-10 border-b md:border-b-0 md:border-r border-neutral-200/40 min-h-[300px] md:min-h-[500px]">
            {/* Ambient shadow gradient */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] opacity-25 ${config.glow}`} />
            
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              src={character.imageUrl}
              alt={character.name}
              referrerPolicy="no-referrer"
              className="relative w-auto max-h-[250px] md:max-h-[400px] object-contain rounded-2xl drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] selection:bg-transparent"
            />

            {/* Float Badge */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`text-[12px] px-3.5 py-1 font-mono tracking-wider font-semibold rounded-full border ${config.badge}`}>
                {config.text.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Right Panel: Data Specs */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between max-h-[90vh] md:max-h-[600px] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100/60 text-neutral-400 hover:text-neutral-900 transition-all cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="pt-2">
                <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">Digital Avatar Info</span>
                <h2 className="text-2xl md:text-3xl font-display font-medium text-neutral-900 mt-1">{character.name}</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-500 leading-relaxed mt-4 bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100">
                {character.description}
              </p>

              {/* Stats Visualizers */}
              <div className="mt-6">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#7E7D7A] font-semibold mb-3">战斗与功能属性 stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(character.stats).map(([statName, val], i) => (
                    <div key={statName} className="p-3 bg-white border border-neutral-100 rounded-xl shadow-xs">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-neutral-400 capitalize">{statName === "intelligence" ? "Intelligence" : statName}</span>
                        <span className="font-mono font-semibold text-neutral-800">{val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="mt-6">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#7E7D7A] font-semibold mb-3">链上标签 traits</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {character.attributes.map((attr) => (
                    <div key={attr.traitType} className="bg-neutral-50 border border-neutral-100 rounded-xl p-2.5 text-center flex flex-col justify-center">
                      <span className="text-[10px] uppercase font-mono text-neutral-400 leading-none">{attr.traitType}</span>
                      <span className="text-xs font-semibold text-neutral-700 mt-1 leading-tight">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ownership Card */}
              <div className="mt-6 p-4 rounded-2xl bg-white border border-neutral-100 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-neutral-50 text-neutral-500">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">当前持有者 (Owner)</span>
                    <p className="text-xs font-mono font-semibold text-neutral-700 mt-0.5">{character.owner}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">铸造价格</span>
                  <p className="text-sm font-semibold text-neutral-900 mt-0.5">{character.price}</p>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-7 pt-4 border-t border-neutral-200/50 flex flex-col gap-3">
              {mintStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>恭喜！数字角色资产铸造成功！</span>
                  </div>
                  <p className="font-mono text-[10px] pl-6 text-emerald-600/80 break-all select-all">
                    Tx: {txHash}
                  </p>
                </motion.div>
              )}

              {mintStatus === "insufficient" && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>余额不足！您的钱包余额暂不支持索取该限量代币角色。</span>
                </div>
              )}

              {mintStatus === "idle" && (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    {!isWalletConnected ? (
                      <p className="text-[11px] text-[#7E7D7A] leading-relaxed">
                        ⚠️ 请在顶部栏确认连接 Web3 数字钱包以激活智能合约铸造逻辑。
                      </p>
                    ) : (
                      <div className="text-xs text-neutral-500 flex items-center gap-1.5 font-mono">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>剩余代币余额: <strong className="text-neutral-700 font-sans">{userBalance.toFixed(2)} ETH</strong></span>
                      </div>
                    )}
                  </div>

                  {isAlreadyOwnedByUser ? (
                    <button
                      disabled
                      className="px-6 py-3 rounded-2xl bg-emerald-500/10 text-emerald-600 font-medium text-sm flex items-center gap-2 select-none border border-emerald-500/10 cursor-not-allowed"
                    >
                      <Check className="w-4 h-4" /> 已归您所有
                    </button>
                  ) : (
                    <button
                      disabled={!isWalletConnected}
                      onClick={handleMint}
                      className="px-6 py-3 rounded-2xl font-display font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer border border-transparent shadow-xs disabled:pointer-events-none disabled:bg-neutral-100 disabled:text-neutral-400 bg-neutral-900 text-white hover:bg-neutral-800"
                    >
                      <Hammer className="w-4 h-4" /> 铸造数字资产
                    </button>
                  )}
                </div>
              )}

              {/* Processing Flow animation */}
              {mintStatus !== "idle" && mintStatus !== "success" && mintStatus !== "insufficient" && (
                <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-5 h-5 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] tracking-wider uppercase font-mono text-neutral-400 block leading-tight">Contract State Engine</span>
                    <span className="text-xs font-semibold text-neutral-800 block mt-0.5">
                      {mintStatus === "verifying" && "第一步: 正在验证数字指纹防伪参数..."}
                      {mintStatus === "signing" && "第二步: 正在向本地钱包请求智能合约签名..."}
                      {mintStatus === "mining" && "第三步: 区块链确认中，请耐心等候矿工打包..."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
