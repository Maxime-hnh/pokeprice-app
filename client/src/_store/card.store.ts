import { makeAutoObservable } from "mobx";
import { Card } from "../_interfaces/card.interface";
import { FetchedUserCardVariantProps } from "../_interfaces/user-card-variants.interface";

class CardStore {
  myCards: FetchedUserCardVariantProps[] = [];
  cards: Card[] = [];
  filteredCards: Card[] = [];

  constructor() {
    makeAutoObservable(this);
  };

  setMyCards = (cards: FetchedUserCardVariantProps[]) => {
    this.myCards = cards;
  };

  setCards = (cards: Card[]) => {
    this.cards = cards;
  };

  setFilteredCards = (filteredCards: Card[]) => {
    this.filteredCards = filteredCards;
  };


}

export const cardStore = new CardStore();