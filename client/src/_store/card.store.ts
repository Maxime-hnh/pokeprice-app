import { makeAutoObservable } from "mobx";
import { Card } from "../_interfaces/card.interface";
import { FetchedUserCardVariantProps } from "../_interfaces/user-card-variants.interface";

class CardStore {
  myCards: FetchedUserCardVariantProps[] = [];
  filteredCards: Card[] = [];

  constructor() {
    makeAutoObservable(this);
  };

  setMyCards = (cards: FetchedUserCardVariantProps[]) => {
    this.myCards = cards;
  };

  setFilteredCards = (filteredCards: Card[]) => {
    this.filteredCards = filteredCards;
  };


}

export const cardStore = new CardStore();