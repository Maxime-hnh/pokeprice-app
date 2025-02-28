import { Set, Card } from '@prisma/client';

export interface CardCount {
  holo: number;
  total: number;
  normal: number;
  firstEd: number;
  reverse: number;
  official: number;
};

export interface SetWithCards extends Set {
  cards: Card[];
}