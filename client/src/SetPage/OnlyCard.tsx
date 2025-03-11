import { Box, Group, Image, Paper, SimpleGrid, Skeleton, Text } from "@mantine/core";
import styles from './SetPage.module.scss';
import { tcgdexService } from "../_services/tcgdex.service";
import { searchService } from "../_services/search.service";
import { useMemo } from "react";
import { formatCardCount, getRarityLogo, growLogoSizeList } from "../_helpers/helpers";
import { setStore } from "../_store/set.store";
import { cardStore } from "../_store/card.store";
import { observer } from "mobx-react-lite";


interface OnlyCardProps {
  handleImageLoad: (cardId: number) => void;
  loadedImages: Record<string, boolean>;
}

const OnlyCard = observer(({ handleImageLoad, loadedImages }: OnlyCardProps) => {

  const { set } = setStore;
  const { filteredCards } = cardStore;
  const { getImageUrl } = tcgdexService;
  const { searchOnEbay, searchOnVinted } = searchService;
  const reversedCards = useMemo(() => [...filteredCards].reverse(), [filteredCards]);

  return (
    <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 5, lg: 6, xl: 7 }} spacing={"xs"}>
      {reversedCards?.length > 0
        ? reversedCards.map(card =>
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
                    {formatCardCount(card, set!.cardCount.official!)}
                  </Text>
                  <Image
                    src={getRarityLogo(card.rarity)}
                    w={growLogoSizeList.includes(card.rarity) ? 17 : 10}
                  />
                </Group>
              </Box>

            </Box>

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
        : Array.from({ length: 16 }).map((_, index) => (
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
  )
});

export default OnlyCard;