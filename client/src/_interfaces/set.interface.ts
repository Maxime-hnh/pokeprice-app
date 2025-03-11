import { Card } from "./card.interface";

export interface CardCount {
  total?: number;
  official?: number;
  reverse?: number;
  holo?: number;
  firstEd?: number;
};

interface Legal {
  standard: boolean;
  expanded: boolean;
}

export interface Set {
  id: number;
  uid: string;
  code: string;
  name: string;
  logo: string | undefined;
  symbol: string;
  cardCount: CardCount;
  tcgOnline: string;
  releaseDate: string;
  legal: Legal;

  cards: Card[]
  serieId: number;
};