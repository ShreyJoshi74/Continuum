/** The page contract from BRD-TRD §13 — `layout` is data, not a client branch. */
export interface CardItem {
  id: string;
  title: string;
  artwork: { landscape: string; portrait: string };
  badges: string[];
  progressPct?: number;
  durationSec?: number;
}

export interface Rail {
  railId: string;
  title: string;
  layout: "landscape" | "portrait";
  items: CardItem[];
}

export interface HomePage {
  pageId: "home";
  version: string;
  rails: Rail[];
}
