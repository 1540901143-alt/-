export interface NFTCharacter {
  id: string;
  name: string;
  rarity: "Legendary" | "Epic" | "Rare";
  imageUrl: string;
  description: string;
  price: string;
  owner: string;
  mintDate: string;
  stats: {
    power: number;
    speed: number;
    intelligence: number;
    agility: number;
  };
  attributes: Array<{
    traitType: string;
    value: string;
  }>;
}

export interface RoadmapItem {
  phase: string;
  title: string;
  tagline: string;
  description: string;
  status: "Completed" | "In Progress" | "Upcoming";
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}
