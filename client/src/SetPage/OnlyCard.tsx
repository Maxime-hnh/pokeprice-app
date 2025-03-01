import { Avatar, Box, Group, Image, Paper, SimpleGrid, Skeleton, Text, Title } from "@mantine/core";
import styles from './SetPage.module.scss';
import { tcgdexService } from "../_services/tcgdex.service";
import { searchService } from "../_services/search.service";
import { Set } from "../_interfaces/set.interface";
import { IconSearch } from "@tabler/icons-react";
import { Card } from "../_interfaces/card.interface";
import { FetchedUserCardVariantProps } from "../_interfaces/user-card-variants.interface";
import { useMemo } from "react";
import { formatCardCount } from "../_helpers/helpers";


interface OnlyCardProps {
  set: Set;
  filteredCards: Card[];
  myCards: FetchedUserCardVariantProps[];
  handleImageLoad: (cardId: number) => void;
  loadedImages: Record<string, boolean>;
}

const OnlyCard = ({ set, filteredCards, handleImageLoad, loadedImages }: OnlyCardProps) => {

  const { getImageUrl } = tcgdexService;
  const { searchOnEbay, searchOnVinted } = searchService;
  const reversedCards = useMemo(() => [...filteredCards].reverse(), [filteredCards]);

  return (
    <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 5, lg: 6, xl: 7 }} spacing={"xs"}>
      {reversedCards?.length > 0
        && reversedCards.map(card =>
          <Paper
            key={card.id}
            pos={"relative"}
            w={"100%"}
            pt={"160%"}
            style={{ overflow: "hidden" }}
            className={styles.onlyCard_img}
            withBorder
            radius={"0.6rem"}
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
              <Image
                src={getImageUrl(card.image, "png", "low")}
                onLoad={() => handleImageLoad(card.id)}
                fit={"cover"}
              />
              <Box
                bg={"white"}
                pos={"absolute"}
                bottom={46}
                left={0}
                px={"0.3rem"}
                py={"0.1rem"}
                style={{ borderRadius: "0 0.3rem 0 0" }}
              >
                <Text fz={"md"} fw={700}>
                  {formatCardCount(card, set!.cardCount.official!)}
                </Text>
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
      }
    </SimpleGrid >
  )
}

export default OnlyCard;