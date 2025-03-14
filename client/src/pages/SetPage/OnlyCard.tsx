import { ActionIcon, Box, Group, Image, Paper, SimpleGrid, Skeleton, Stack, Text } from "@mantine/core";
import styles from './SetPage.module.scss';
import { tcgdexService } from "../../_services/tcgdex.service";
import { searchService } from "../../_services/search.service";
import { formatCardCount, getRarityLogo, growLogoSizeList } from "../../_helpers/helpers";
import { setStore } from "../../_store/set.store";
import { cardStore } from "../../_store/card.store";
import { observer } from "mobx-react-lite";
import FilterCard from "./FilterCard";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { userCardVariantsService } from "../../_services/user-cards-variants.service";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { authStore } from "../../_store/auth.store";
import { Card } from "../../_interfaces/card.interface";


interface OnlyCardProps {
  handleImageLoad: (cardId: number) => void;
  loadedImages: Record<string, boolean>;
  cards?: Card[];
  withFilterBar: boolean;
}

const OnlyCard = observer(({ handleImageLoad, loadedImages, cards, withFilterBar }: OnlyCardProps) => {

  const { set } = setStore;
  const { isLoggedIn } = authStore;
  const { filteredCards, myWishList } = cardStore;
  const { getImageUrl } = tcgdexService;
  const { searchOnEbay, searchOnVinted } = searchService;
  const { linkOrUpdateUserCardVariant, existInWishList, getAllWishListUserCardsByUserId, unlinkUserCardVariant } = userCardVariantsService;
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const displayCards = cards ?? filteredCards

  const addToWishList = async (cardId: number, cardVariantId: number) => {
    try {
      if (!isLoggedIn) {
        return notifications.show({
          message: "Vous devez être connecté pour ajouter la carte",
          color: 'red'
        })
      };
      setIsLoading(prev => ({ ...prev, [cardId]: true }))
      if (existInWishList(myWishList, cardId, cardVariantId)) {
        await unlinkUserCardVariant(cardId, cardVariantId);
        await loadWishListCards();
      } else {
        await linkOrUpdateUserCardVariant(cardId, cardVariantId, { type: "wishList" });
        await loadWishListCards();
        notifications.show({
          message: `Carte ajoutée à la wish list !`,
          color: 'green'
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(prev => ({ ...prev, [cardId]: false }))
    }
  };

  const loadWishListCards = async () => {
    if (isLoggedIn) {
      await getAllWishListUserCardsByUserId();
    };
    return;
  };

  useEffect(() => {
    loadWishListCards();
  }, [isLoggedIn]);

  return (
    <Stack>
      {withFilterBar && <FilterCard />}
      <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 5, lg: 6, xl: 7 }} spacing={"xs"}>
        {displayCards?.length > 0
          ? displayCards.map(card =>
            <Paper
              key={card.id}
              pos={"relative"}
              w={"100%"}
              pt={"160%"}
              style={{ overflow: "hidden" }}
              className={styles.onlyCard_img}
              withBorder
              radius={"0.7rem 0.7rem 1.5rem 1.5rem"}
              shadow="md"
            >
              {!loadedImages[card.id] && (
                <Skeleton
                  w={"100%"}
                  h={"100%"}
                  pos={"absolute"}
                  top={0}
                  left={0}
                />
              )}
              <Box bg={"white"}
                pos={"absolute"}
                top={0}
                left={0}
                w={"100%"}
                h={"100%"}
                display={loadedImages[card.id] ? "block" : "none"}

              >
                <Box pos={"relative"}>

                  <Image
                    src={getImageUrl(card.image, "png", "low")}
                    onLoad={() => handleImageLoad(card.id)}
                    fit={"cover"}
                  />
                  <Group
                    bg={"white"}
                    pos={"absolute"}
                    bottom={-1}
                    left={0}
                    px={"0.3rem"}
                    py={"0.1rem"}
                    gap={5}
                    style={{ borderRadius: "0 1rem 0 0", borderBottom: "1px solid white" }}
                  >
                    <Text fz={"xs"} fw={700}>
                      {formatCardCount(card, set?.cardCount.official! ?? card.set!.cardCount.official!)}
                    </Text>
                    <Image
                      src={getRarityLogo(card.rarity)}
                      w={growLogoSizeList.includes(card.rarity) ? 17 : 10}
                    />
                  </Group>
                </Box>

              </Box>
              <ActionIcon
                style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
                radius={"xl"}
                color="white"
                pos={"absolute"}
                size={"lg"}
                top={3}
                right={4}
                onClick={() => addToWishList(card.id, card.variants[0].cardVariantId)}
                loading={isLoading[card.id]}
                loaderProps={{ size: "xs", color: "red" }}
              >
                {existInWishList(myWishList, card.id, card.variants[0].cardVariantId)
                  ? <IconHeartFilled color="red" />
                  : <IconHeart color={"red"} />
                }
              </ActionIcon>

              <Group bottom={10} left={0} pos={"absolute"} justify="space-evenly" w={"100%"}>

                <Image
                  w={50}
                  src={"/assets/ebay-logo.svg"}
                  onClick={() =>
                    searchOnEbay(card.ebaySearchContent!)
                  }
                  style={{ cursor: 'pointer' }}
                />
                <Image
                  w={50}
                  src={"/assets/vinted-logo.svg"}
                  onClick={() =>
                    searchOnVinted(card.ebaySearchContent!)
                  }
                  style={{ cursor: 'pointer' }}
                />
              </Group>
            </Paper>
          )
          : Array.from({ length: 30 }).map((_, index) => (
            <Paper
              key={index}
              pos={"relative"}
              w={"100%"}
              pt={"160%"}
              style={{ overflow: "hidden" }}
              className={styles.onlyCard_img}
              withBorder
              radius={"0.7rem 0.7rem 1.5rem 1.5rem"}
              shadow="md"
            >
              <Skeleton
                w={"100%"}
                h={"100%"}
                pos={"absolute"}
                top={0}
                left={0}
              />
            </Paper>
          ))
        }
      </SimpleGrid >
    </Stack>
  )
});

export default OnlyCard;