import { RANK_TIERS } from "@/lib/ranked";

export const RANK_IMAGES = {
  Bronze: "https://media.base44.com/images/public/6a894c10a93a96a97b229b0e/63500aa3d_generated_image.png",
  Silver: "https://media.base44.com/images/public/6a894c10a93a96a97b229b0e/ca70749a6_generated_image.png",
  Gold: "https://media.base44.com/images/public/6a894c10a93a96a97b229b0e/fc3be6b5e_generated_image.png",
  Platinum: "https://media.base44.com/images/public/6a894c10a93a96a97b229b0e/9ffe8312e_generated_image.png",
  Diamond: "https://media.base44.com/images/public/6a894c10a93a96a97b229b0e/74bd0075b_generated_image.png",
  Master: "https://media.base44.com/images/public/6a894c10a93a96a97b229b0e/023cb1908_generated_image.png"
};

export function roundRankTier(wins) {
  if (wins >= 9) return 5;
  if (wins >= 7) return 4;
  if (wins >= 5) return 3;
  if (wins >= 3) return 2;
  if (wins >= 1) return 1;
  return 0;
}

export function rankNameForWins(wins) {
  return RANK_TIERS[roundRankTier(wins)].name;
}

export function rankImageForWins(wins) {
  return RANK_IMAGES[rankNameForWins(wins)];
}
