import { NFTCharacter, RoadmapItem, FAQItem } from "./types";

export const IMAGES = {
  hero: "/src/assets/images/hero_character_1781085842921.png",
  about: "/src/assets/images/about_project_1781085880070.png",
  aetherGuardian: "/src/assets/images/aether_guardian_1781085862487.png",
  neonStalker: "/src/assets/images/neon_stalker_1781085899772.png",
  dataShard: "/src/assets/images/data_shard_1781085938649.png",
  voidWalker: "/src/assets/images/void_walker_1781085918620.png",
};

export const INITIAL_CHARACTERS: NFTCharacter[] = [
  {
    id: "char-1",
    name: "Aether Guardian",
    rarity: "Legendary",
    imageUrl: IMAGES.aetherGuardian,
    description: "Aether Guardian 守护着数字维度的光轮，全身覆有神圣复合理合金，其能将波形能量化作神圣羽翼，守卫去中心化的最前端，为智能合约生态铸就牢不可破的圣盾。",
    price: "0.25 ETH",
    owner: "0x8F9a...2D81",
    mintDate: "2026-02-14",
    stats: {
      power: 94,
      speed: 82,
      intelligence: 88,
      agility: 78,
    },
    attributes: [
      { traitType: "Class", value: "Sentinel" },
      { traitType: "Element", value: "Aether Light" },
      { traitType: "Weapon", value: "Divine Barrier" },
      { traitType: "Armor", value: "Cosmic Alum" },
    ],
  },
  {
    id: "char-2",
    name: "Neon Stalker",
    rarity: "Epic",
    imageUrl: IMAGES.neonStalker,
    description: "活跃于数字网络夜色之下的敏捷刺客，能够在光纤通道与电路盲区中来去自如。身上律动的亮绿与霓虹紫线是其高精度量子计算周期的能量释放表现。",
    price: "0.15 ETH",
    owner: "0x3D4c...91A2",
    mintDate: "2026-03-01",
    stats: {
      power: 80,
      speed: 98,
      intelligence: 84,
      agility: 96,
    },
    attributes: [
      { traitType: "Class", value: "Stalker" },
      { traitType: "Element", value: "Neon Cyan" },
      { traitType: "Weapon", value: "Phase Blade" },
      { traitType: "Armor", value: "Shadow Fabric" },
    ],
  },
  {
    id: "char-3",
    name: "Data Shard",
    rarity: "Rare",
    imageUrl: IMAGES.dataShard,
    description: "由原始未加密的创世区块碎片凝结而成的智能结晶。在其漂浮的晶态机体中，运算数据流若隐若现，其内部散发的温暖琥珀辉光承载着古老公链的所有元数据历史。",
    price: "0.08 ETH",
    owner: "0x7E1b...09F4",
    mintDate: "2026-03-12",
    stats: {
      power: 72,
      speed: 70,
      intelligence: 95,
      agility: 80,
    },
    attributes: [
      { traitType: "Class", value: "Intelligence" },
      { traitType: "Element", value: "Data Quartz" },
      { traitType: "Core", value: "Genesis Node" },
      { traitType: "Frequency", value: "8.4 GHz" },
    ],
  },
  {
    id: "char-4",
    name: "Void Walker",
    rarity: "Legendary",
    imageUrl: IMAGES.voidWalker,
    description: "游走于零地址与未定义空值之间的终极虚空旅人。他身披星尘暗物质编织的黑焰战袍，拥有跨越底层链进行跨链通讯的非凡能力，在多维宇宙中留下璀璨轨迹。",
    price: "0.32 ETH",
    owner: "0x5A2e...D9C4",
    mintDate: "2026-04-18",
    stats: {
      power: 96,
      speed: 85,
      intelligence: 92,
      agility: 88,
    },
    attributes: [
      { traitType: "Class", value: "Cosmic Sage" },
      { traitType: "Element", value: "Void Stardust" },
      { traitType: "Relic", value: "Bifrost Gateway" },
      { traitType: "Power Source", value: "Singularity" },
    ],
  },
];

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    phase: "01",
    title: "Phase 01: 启动",
    tagline: "BUILD THE FOUNDATION",
    description: "项目公开发售，建立核心DAO社区，上线官方网站及艺术展示厅，举办创世社区专属回馈活动。",
    status: "Completed",
  },
  {
    phase: "02",
    title: "Phase 02: 扩展",
    tagline: "GROW ECOSYSTEM",
    description: "开启首批二级市场专属交易通道，发布实体高素质周边，并针对首批持有者启动系列专属空投计划。",
    status: "In Progress",
  },
  {
    phase: "03",
    title: "Phase 03: 元宇宙",
    tagline: "METAVERSE INTEGRATION",
    description: "角色数据与三大主流元宇宙虚拟平台完成底层协议接口对接，向持有者开放高清3D渲染交互式模型包下载。",
    status: "Upcoming",
  },
  {
    phase: "04",
    title: "Phase 04: 生态进化",
    tagline: "DECENTRALIZED COMMUNITY",
    description: "全面推行去中心化治理（DAO）提案机制，正式启动独立动作冒险游戏项目的公测，建立百万级创作者基金。",
    status: "Upcoming",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: "什么是 NFT CHARACTER ？",
    answer: "NFT CHARACTER 是基于先进智能合约算法生成的次世代数字身份角色集合。每一个角色都拥有极富未来感的设计美学与全球独一无二的元数据凭证，在未来不仅代表了数字艺术顶峰，也将在后续衍生的链游、VR社交、3D展厅以及自治社区中发挥独有的虚拟化身效用。",
  },
  {
    id: 2,
    question: "如何参与发售与铸造（Mint）？",
    answer: "您需要在页面右上角点击「Connect Wallet」连接您的 Web3 钱包（如 MetaMask, Rainbow 或 Standard Coinbase），并保证钱包内留存有充足的 ETH（加上少量 Gas 费）。在铸造期开启时，在详情卡上点击「铸造角色 (Mint)」触发钱包模拟确认，扣除相应金额后该角色的所有权将安全转移到您的钱包地址下。",
  },
  {
    id: 3,
    question: "角色具有如何的实际用途与收藏价值？",
    answer: "第一，艺术稀缺性：联合顶尖CG大师精心渲染，数量终身限定，永不增发；第二，游戏赋能：可直接接入下阶段测试的虚幻5 3D链游，并根据稀有度提供相应的基础攻击力与产出加成机制；第三，生态权益：定期自动获取平台合作空投，并参与持有者共治理事会重大项目发展决断。",
  },
];
