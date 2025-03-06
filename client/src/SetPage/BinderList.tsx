import { Chip, Container, Divider, Grid, Group, LoadingOverlay, Paper, Text } from "@mantine/core";
import { Fragment, useEffect, useState } from "react";
import { Card, CardWithVariantId } from "../_interfaces/card.interface";
import { Box, Image, Skeleton } from "@mantine/core"
import styles from './SetPage.module.scss';
import { tcgdexService } from "../_services/tcgdex.service";
import { FetchedUserCardVariantProps } from "../_interfaces/user-card-variants.interface";
import { userCardVariantsService } from "../_services/user-cards-variants.service";
import { authService } from "../_services/auth.service";
import { countOwnedCards } from "../_helpers/helpers";
import { notifications } from "@mantine/notifications";

interface BinderListProps {
  cards: Card[];
  myCards: FetchedUserCardVariantProps[];
  handleImageLoad: (cardId: number) => void;
  loadedImages: Record<string, boolean>;
};

interface PocketNumberProps {
  pocket: number;
  span: number;
  totalSize: number
}

const BinderList = ({ cards, handleImageLoad, loadedImages }: BinderListProps) => {

  const { getImageUrl } = tcgdexService;
  const [pocketNumber, setPocketNumber] = useState<PocketNumberProps>({ pocket: 12, span: 3, totalSize: 24 })

  let firstPageSize = pocketNumber.pocket;
  const pageSize = pocketNumber.totalSize;
  const options: Record<number, PocketNumberProps> = {
    12: { pocket: 12, span: 3, totalSize: 24 },
    9: { pocket: 9, span: 4, totalSize: 18 },
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cardVariantIdIsLoading, setCardVariantIdIsLoading] = useState<{ [key: string]: boolean }>({})
  const { ownedCardVariant, unlinkUserCardVariant, linkUserCardVariant, getAllUserCardsByUserId } = userCardVariantsService;
  const [myCards, setMyCards] = useState<FetchedUserCardVariantProps[]>([]);

  const loadUserCardVariants = async () => {
    if (authService.loggedUserValue) {
      setIsLoading(true);
      const favData = await getAllUserCardsByUserId();
      if (favData) {
        setMyCards(favData)
        setIsLoading(false);
      }
    };
    return;
  }

  useEffect(() => {
    loadUserCardVariants();
  }, []);


  const duplicatedCards: CardWithVariantId[] = cards.flatMap((card) =>
    card.variants.map((variant) => ({
      ...card,
      variantType: variant.cardVariant.type,
      cardVariantId: variant.cardVariantId,
    }))
  );
  const ownedCardsCount = countOwnedCards(duplicatedCards, myCards);


  const firstPage = duplicatedCards.slice(0, firstPageSize);
  const remainingCards = duplicatedCards.slice(firstPageSize);
  const pages: any[] = [];
  for (let i = 0; i < remainingCards.length; i += pageSize) {
    pages.push(remainingCards.slice(i, i + pageSize));
  };


  const handleFavoriteToggle = async (cardId: number, cardVariantId: number) => {
    if (!authService.loggedUserValue) {
      return notifications.show({ message: "Vous devez être connecté pour ajouter la carte", color: 'red' })
    }
    const key = `${cardId}_${cardVariantId}`
    setCardVariantIdIsLoading(prev => ({ ...prev, [key]: true }));

    if (ownedCardVariant(myCards, cardId, cardVariantId)) {
      await unlinkUserCardVariant(cardId, cardVariantId);
      await loadUserCardVariants();
    } else {
      await linkUserCardVariant(cardId, cardVariantId);
      await loadUserCardVariants();
    }
    setCardVariantIdIsLoading(prev => ({ ...prev, [key]: false }));
  }

  const CardWithSkeleton = (card: any) => {
    return (
      <Box
        pos={"relative"}
        w={"100%"}
        pt={"140%"}
        style={{ overflow: "hidden" }}
        className={styles.onlyCard_img}

      >
        {(!loadedImages[card.id] || isLoading) && (
          <Skeleton
            w={"100%"}
            h={"100%"}
            pos={"absolute"}
            top={0}
            left={0}
          />
        )}
        <LoadingOverlay
          visible={cardVariantIdIsLoading[`${card.id}_${card.cardVariantId}`]}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ type: 'bars' }}
        />

        <Image
          display={loadedImages[card.id] ? "block" : "none"}
          pos={"absolute"}
          top={0}
          left={0}
          w={"100%"}
          h={"100%"}
          src={getImageUrl(card.image, "png", "low")}
          onClick={() =>
            handleFavoriteToggle(card.id, card.cardVariantId)
          }
          onLoad={() => handleImageLoad(card.id)}
          opacity={ownedCardVariant(myCards, card.id, card.cardVariantId) ? 1 : 0.5}
          fit={"cover"}
        />
      </Box>
    )
  };


  return (
    <Container mx={{ base: 0, xl: "auto" }} px={0}>
      <Group my={"xs"}>
        <Chip.Group
          value={String(pocketNumber.pocket)}
          onChange={(val) => setPocketNumber(options[Number(val)])}
        >
          <Group>
            <Chip
              styles={{ iconWrapper: { display: 'none' } }}
              icon={<></>}
              value="12"
              color="#222"
            >
              12 pochettes
            </Chip>
            <Chip
              styles={{ iconWrapper: { display: 'none' } }}

              icon={<></>}
              value="9"
              color="#222"
            >
              9 pochettes
            </Chip>
          </Group>
        </Chip.Group>
      </Group>
      <Group justify="center"><Text mb={"xs"} fz={"md"} className="titleFont">{`${ownedCardsCount}/${duplicatedCards.length}`}</Text></Group>
      {/* Première page (seulement 12 cartes à droite) */}
      <Grid gutter="xl">
        <Grid.Col span={6}>
          <Paper w={"100%"} h={"100%"} bg={"#f1f3f5"} radius={"md"}></Paper>
        </Grid.Col>

        <Grid.Col span={6}>
          <Grid>
            {firstPage.map((card: any) => (
              <Grid.Col key={card.id + card.variantType} span={pocketNumber.span} p={{ base: 3, md: 5, lg: 5, xl: 8 }}>
                {CardWithSkeleton(card)}
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
      </Grid>
      <Divider my={10} size={"md"} label={`1/${pages.length + 1}`} labelPosition="center" />

      {/* Pages normales (12 cartes à gauche, 12 cartes à droite) */}
      {pages.map((page, pageIndex) => {
        const leftSide = page.slice(0, pocketNumber.pocket);
        const rightSide = page.slice(pocketNumber.pocket, pocketNumber.totalSize);
        return (
          <Fragment key={pageIndex}>
            <Grid key={pageIndex + 1} gutter="md">
              <Grid.Col span={6}>
                <Grid>
                  {leftSide.map((card: any) => (
                    <Grid.Col key={card.id + card.variantType} span={pocketNumber.span} p={{ base: 3, md: "xs" }}>
                      {CardWithSkeleton(card)}
                    </Grid.Col>
                  ))}
                </Grid>
              </Grid.Col>
              <Grid.Col span={6}>
                <Grid>
                  {rightSide.map((card: any) => (
                    <Grid.Col key={card.id + card.variantType} span={pocketNumber.span} p={{ base: 3, md: "xs" }}>
                      {CardWithSkeleton(card)}
                    </Grid.Col>
                  ))}
                </Grid>
              </Grid.Col>
            </Grid>
            <Divider my={10} size={"md"} label={`${pageIndex + 2}/${pages.length + 1}`} labelPosition="center" />
          </Fragment>
        );
      })}
    </Container>
  );

};

export default BinderList;