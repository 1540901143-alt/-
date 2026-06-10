import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Wallet, ShieldAlert, Cpu, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string, provider: string) => void;
}

const WALLET_OPTIONS = [
  {
    id: "metamask",
    name: "MetaMask",
    logoColor: "bg-orange-500/10 text-orange-600",
    description: "最受欢迎的以太坊浏览器扩展钱包",
    badge: "推荐",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    logoColor: "bg-blue-600/10 text-blue-600",
    description: "简易安全的移动及浏览器数字交易所托管钱包",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    logoColor: "bg-sky-500/10 text-sky-500",
    description: "支持使用二维码通过移动端冷钱包扫码登录",
  },
  {
    id: "phantom",
    name: "Phantom",
    logoColor: "bg-violet-500/10 text-violet-600",
    description: "极速支持以太坊及多链的多功能现代钱包",
  },
];

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleSelectWallet = (walletId: string, walletName: string) => {
    setLoadingId(walletId);
    
    // Simulate smart contract connection flow
    setTimeout(() => {
      setLoadingId(null);
      setSuccessId(walletId);
      
      setTimeout(() => {
        // Generate a mock wallet address
        const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
        const mockAddress = `0x7E3a${randomHex}98...83D${randomHex}`;
        onConnect(mockAddress, walletName);
        setSuccessId(null);
        onClose();
      }, 1000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="wallet-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0c0c0e]/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-neutral-900 text-white">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-neutral-900">连接数字钱包</h3>
                  <p className="text-xs text-neutral-400">选择适合您的服务商登录</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="mt-5 space-y-3">
              {WALLET_OPTIONS.map((wallet) => {
                const isLoading = loadingId === wallet.id;
                const isSuccess = successId === wallet.id;

                return (
                  <button
                    key={wallet.id}
                    disabled={loadingId !== null}
                    onClick={() => handleSelectWallet(wallet.id, wallet.name)}
                    className="relative w-full flex items-center justify-between p-4 rounded-2xl border border-neutral-100 hover:border-neutral-900/10 hover:bg-neutral-50/50 text-left transition-all group disabled:pointer-events-none cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${wallet.logoColor} transition-colors group-hover:scale-105 duration-300`}>
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-neutral-800">{wallet.name}</span>
                          {wallet.badge && (
                            <span className="text-[10px] px-2 py-0.5 font-medium rounded-full bg-neutral-900 text-white leading-none">
                              {wallet.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 mr-4">{wallet.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center pr-1">
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-2 border-neutral-800 border-t-transparent rounded-full"
                          />
                        ) : isSuccess ? (
                          <motion.div
                            key="success"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-emerald-500"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="arrow"
                            className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-neutral-400"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hint Footer */}
            <div className="mt-5 p-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                我们支持绝大多数以太坊底层兼容公链。连接时不会触发真实的代币扣费或签名授权。请妥善保管好您的助记词，切勿泄露。
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
