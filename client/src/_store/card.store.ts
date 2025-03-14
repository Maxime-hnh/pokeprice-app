import { makeAutoObservable } from "mobx";
import { Card, Rarity } from "../_interfaces/card.interface";
import { FetchedUserCardVariantProps } from "../_interfaces/user-card-variants.interface";

class CardStore {
  myCards: FetchedUserCardVariantProps[] = [];
  myWishList: FetchedUserCardVariantProps[] = [];
  cards: Card[] = [];
  filteredCards: Card[] = [];
  uniqueRarities: Rarity[] = [];

  constructor() {
    makeAutoObservable(this);
  };

  setMyCards = (cards: FetchedUserCardVariantProps[]) => {
    this.myCards = cards;
  };

  setMyWishList = (wishList: FetchedUserCardVariantProps[]) => {
    this.myWishList = wishList;
  };

  setCards = (cards: Card[]) => {
    this.cards = cards;
  };

  setFilteredCards = (filteredCards: Card[]) => {
    this.filteredCards = filteredCards;
  };

  setUniqueRarities = () => {
    this.uniqueRarities = Array.from(new Set(this.cards.map(card => card.rarity)));
  }


}

export const cardStore = new CardStore();