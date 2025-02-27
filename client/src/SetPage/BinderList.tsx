import { Container, Divider, Grid, Group, LoadingOverlay, Paper, Text } from "@mantine/core";
import { Fragment, useEffect, useState } from "react";
import { Card, CardWithVariantId } from "../_interfaces/card.interface";
import { Box, Image, Skeleton } from "@mantine/core"
import styles from './SetPage.module.scss';
import { tcgdexService } from "../_services/tcgdex.service";
import { FetchedUserCardVariantProps } from "../_interfaces/user-card-variants.interface";
import { userCardVariantsService } from "../_services/user-cards-variants.service";
import { authService } from "../_services/auth.service";
import { countOwnedCards } from "../_helpers/helpers";

interface BinderListProps {
  cards: Card[];
  myCards: FetchedUserCardVariantProps[];
  handleImageLoad: (cardId: number) => void;
  loadedImages: Record<string, boolean>;
}

const BinderList = ({ cards, handleImageLoad, loadedImages }: BinderListProps) => {

  const { loggedUser } = authService;
  const { getImageUrl } = tcgdexService;

  const firstPageSize = 12;
  const pageSize = 24;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cardVariantIdIsLoading, setCardVariantIdIsLoading] = useState<{ [key: string]: boolean }>({})
  const { ownedCardVariant, unlinkUserCardVariant, linkUserCardVariant, getAllUserCardsByUserId } = userCardVariantsService;
  const [myCards, setMyCards] = useState<FetchedUserCardVariantProps[]>([]);

  const loadUserCardVariants = async () => {
    if (loggedUser) {
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
    <Container mx={{ base: 0, xl: "auto" }}>
      <Group justify="center"><Text mb={"xs"} fz={"md"} className="titleFont">{`${ownedCardsCount}/${duplicatedCards.length}`}</Text></Group>
      {/* Première page (seulement 12 cartes à droite) */}
      <Grid gutter="xl">
        <Grid.Col span={6}>
          <Paper w={"100%"} h={"100%"} bg={"#f1f3f5"} radius={"md"}></Paper>
        </Grid.Col>

        <Grid.Col span={6}>
          <Grid>
            {firstPage.map((card: any) => (
              <Grid.Col key={card.id + card.variantType} span={3} p={{ base: 3, md: "xs" }}>
                {CardWithSkeleton(card)}
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
      </Grid>
      <Divider my={10} size={"md"} label={`1/${pages.length + 1}`} labelPosition="center" />

      {/* Pages normales (12 cartes à gauche, 12 cartes à droite) */}
      {pages.map((page, pageIndex) => {
        const leftSide = page.slice(0, 12);
        const rightSide = page.slice(12, 24);
        return (
          <Fragment key={pageIndex}>
            <Grid key={pageIndex + 1} gutter="md">
              <Grid.Col span={6}>
                <Grid>
                  {leftSide.map((card: any) => (
                    <Grid.Col key={card.id + card.variantType} span={3} p={{ base: 3, md: "xs" }}>
                      {CardWithSkeleton(card)}
                    </Grid.Col>
                  ))}
                </Grid>
              </Grid.Col>
              <Grid.Col span={6}>
                <Grid>
                  {rightSide.map((card: any) => (
                    <Grid.Col key={card.id + card.variantType} span={3} p={{ base: 3, md: "xs" }}>
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


{/* <Paper p={"md"} shadow="md" withBorder mb={"xs"}>
        <Group>
          <Input
            leftSection={<IconSearch />}
            placeholder="Rechercher un pokémon..."

          />
          <Stack>
            <Group gap={"xs"}>
              <Image
                w={15}
                h={15}
                src={"/assets/rarities/rarity_common.png"}
              />
              Peu Commune
            </Group>
            <Group gap={"xs"}>
              <Image
                w={15}
                h={15}
                src={"/assets/rarities/rarity_uncommon.png"}
              />
              Commune
            </Group>
            <Group gap={"xs"}>
              <Image
                w={15}
                h={15}
                src={"/assets/rarities/rarity_holo.png"}
              />
              Holographique
            </Group>
            <Group gap={"xs"}>
              <Image
                w={15}
                h={15}
                src={"/assets/rarities/rarity_double_rare.png"}
              />
              Double Rare
            </Group>
          </Stack>
          <Stack>
            <Group gap={"xs"}>
              <Image
                w={15}
                h={15}
                src={"/assets/rarities/rarity_AR.png"}
              />
              Illustration Rare
            </Group>
            <Group gap={"xs"}>
              <Image
                w={15}
                h={15}
                src={"/assets/rarities/rarity_ultra_rare.png"}
              />
              Ultra Rare
            </Group>
            <Group gap={"xs"}>
              <Image
                w={15}
                h={15}
                src={"/assets/rarities/rarity_SAR.png"}
              />
              Illustration Spéciale Rare
            </Group>
            <Group gap={"xs"}>
              <Image
                w={15}
                h={15}
                src={"/assets/rarities/rarity_hyper_rare.png"}
              />
              Hyper Rare
            </Group>
          </Stack>
          <Group gap={"xs"}>
            <Image
              w={15}
              h={15}
              src={"/assets/rarities/rarity_high_tech_rare.png"}
            />
            High-Tech Rare
          </Group>
        </Group>
      </Paper> */}