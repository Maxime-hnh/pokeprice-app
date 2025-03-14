import { useEffect, useState } from "react";
import { userCardVariantsService } from "../../_services/user-cards-variants.service";
import { authStore } from "../../_store/auth.store";
import { cardService } from "../../_services/card.service";
import { Card } from "../../_interfaces/card.interface";
import OnlyCard from "../SetPage/OnlyCard";
import { Button, Container, Group, Image, SimpleGrid, Text, Title } from "@mantine/core";
import styles from '../../BuildingMessage.module.scss';
import BuildingMessage from "../../_components/BuildingMessage";

const WishListPage = () => {

  const { isLoggedIn } = authStore;
  const { getCardsByIdsForWishList } = cardService;
  const { getAllWishListUserCardsByUserId } = userCardVariantsService;
  const [wishCards, setWishCards] = useState<Card[]>([])


  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const handleImageLoad = (cardId: number) => {
    setLoadedImages((prev) => ({
      ...prev,
      [cardId]: true,
    }));
  };

  const loadCards = async () => {
    if (isLoggedIn) {
      const data = await getAllWishListUserCardsByUserId();
      if (data && data.length > 0) {
        const ids = data.map(ucv => ucv.cardId)
        const cardsFromWishList = await getCardsByIdsForWishList(ids);
        setWishCards(cardsFromWishList)
      }
    };
    return;
  };

  useEffect(() => {
    loadCards();
  }, [isLoggedIn]);

  console.log(wishCards)

  return (
    <>
      {!isLoggedIn ?
        <Container>
          <BuildingMessage
            imgSrc="/assets/pokemon_starters.png"
            imgAlt="Oeuf pokémon"
            title="Connexion Requise"
            textContent={<>
              Vous devez être connecté pour accéder à votre Wish List.
              <br />
              <br />
              Connectez-vous pour voir les
              cartes Pokémon que vous avez marquées comme souhaitées et pour gérer votre liste. Si
              vous n'avez pas de compte, inscrivez-vous dès maintenant pour commencer à construire
              votre collection de rêve ! 🚀
            </>}
            buttonMessage="Connexion"
            redirectTo="/login"
            withCredit={true}
          />
        </Container>
        : wishCards
          && wishCards.length > 0
          ? <OnlyCard handleImageLoad={handleImageLoad} loadedImages={loadedImages} cards={wishCards} withFilterBar={false} />
          : <></>
      }
    </>

  )
}
export default WishListPage;