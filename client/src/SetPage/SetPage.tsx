import { Accordion, Box, Button, Center, Group, Image, Input, Overlay, Paper, SegmentedControl, SimpleGrid, Skeleton, Stack, Text, Title, useMantineColorScheme } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Set } from "../_interfaces/set.interface";
import { tcgdexService } from "../_services/tcgdex.service";
import styles from './SetPage.module.scss';
import { ebayService } from "../_services/ebay.service";
import { IconBook, IconCards, IconId, IconList, IconPlayCardStarFilled, IconSearch } from "@tabler/icons-react";
import { authStore } from "../_store/auth.store";
import AppContext from "../App/AppContext";
import { sanitizeKey } from "../_helpers/helpers";
import OnlyCard from "./OnlyCard";
import DetailsCard from "./DetailsCard";
import CardList from "./CardsList";
import { setService } from "../_services/set.service";
import { Card } from "../_interfaces/card.interface";
import BinderList from "./BinderList";

enum CardView {
  LIST = "list",
  DETAILS = "details",
  BINDER = "binder",
  ONLYCARD = "onlyCard",
}

const SetPage = () => {

  const { setId } = useParams();
  const { isMobile } = useContext(AppContext);
  const { getImageUrl } = tcgdexService;
  const { getSetById } = setService;
  const { searchOnEbay } = ebayService;
  const { loggedUser } = authStore;

  const [set, setSet] = useState<Set | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const { colorScheme } = useMantineColorScheme();
  const [myCards, setMyCards] = useState<string[]>([]);
  const [view, setView] = useState<CardView>(CardView.DETAILS)

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});


  const loadData = async () => {
    //set
    const setData = await getSetById(setId!)
    if (setData) {
      setSet(setData);
      setFilteredCards(setData.cards);

      //favs
      if (loggedUser) {
        setIsLoading(true);
        // const favData = await getMyCards(setData.id);
        // if (favData) {
        //   setMyCards(favData)
        //   setIsLoading(false);
        // }
      }
    };

    return;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    if (set?.cards) {
      const filtered = set.cards.filter((card) =>
        card.name.toLowerCase().includes(value)
      );
      setFilteredCards(filtered);
    }
  };

  const handleImageLoad = (cardId: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [cardId]: true,
    }));
  };

  const handleFavoriteToggle = async (setId: string, cardId: string) => {
    if (!myCards.includes(sanitizeKey(cardId))) {
      // await linkCardById(setId, cardId);
      setMyCards([...myCards, sanitizeKey(cardId)]);
    } else {
      // await unLinkCardById(setId, cardId);
      setMyCards(myCards.filter(id => id !== sanitizeKey(cardId)));
    }
  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <div>
      <Stack w={"100%"} mb={"md"} gap={"xs"}>
        <Group align="center" justify="center">
          {set?.logo
            ? <Image
              src={getImageUrl(set.logo, 'png')}
              w={150}
              maw={150}
              mb={"sm"}
            />
            : <Title>{set?.name}</Title>
          }
        </Group>
        <Input
          leftSection={<IconSearch color={colorScheme === "dark" ? "yellow" : "#495057"} />}
          placeholder="Rechercher un pokémon..."
          value={searchValue}
          onChange={handleSearchChange}

        />
        <SegmentedControl onChange={(value) => setView(value as CardView)} size="xs" fullWidth radius="xl" data={[
          {
            value: CardView.DETAILS,
            label: (
              <Center>
                <IconId color={colorScheme === "dark" ? "yellow" : "#495057"} />
              </Center>
            )
          },
          {
            value: CardView.BINDER,
            label: (
              <Center>
                <IconBook color={colorScheme === "dark" ? "yellow" : "#495057"} />
              </Center>
            )
          },
          {
            value: CardView.LIST,
            label: (
              <Center>
                <IconList color={colorScheme === "dark" ? "yellow" : "#495057"} />
              </Center>
            )
          },
          {
            value: CardView.ONLYCARD,
            label: (
              <Center>
                <IconPlayCardStarFilled color={colorScheme === "dark" ? "yellow" : "#495057"} />
              </Center>
            )
          },
        ]} />
      </Stack>
      {view === CardView.DETAILS
        ? <SimpleGrid cols={{ base: 2, xs: 3, md: 3, lg: 4, xl: 5 }} spacing={"xs"}>
          {filteredCards?.length > 0
            && filteredCards.map(card =>
              isMobile ?
                <DetailsCard
                  key={card.id}
                  set={set!}
                  data={card}
                  myCards={myCards}
                  handleFavoriteToggle={handleFavoriteToggle}
                  handleImageLoad={handleImageLoad}
                  loadedImages={loadedImages}
                  isLoading={isLoading}
                />
                : <Box
                  key={card.id}
                  pos={"relative"}
                  w={"100%"}
                  pt={"140%"}
                  style={{ overflow: "hidden" }}
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
                  <Paper
                    pos={"absolute"}
                    top={0}
                    left={0}
                    w={"100%"}
                    h={"100%"}
                    display={loadedImages[card.id] ? "block" : "none"}
                    withBorder
                    shadow="md"
                    bg={colorScheme === "dark" ? "#101010" : "#fff"}
                  >
                    <Stack
                      w={"100%"}
                      h={"100%"}
                      align="center"
                      justify="space-between"
                      p={"sm"}
                    >
                      <Group justify="space-between" w={"100%"}>
                        <Text style={{ zIndex: 999 }}>{card.localId}/{set?.cardCount.official}</Text>
                        {isLoading
                          ? <Skeleton radius={"xl"} w={24} h={24} />
                          : <></>
                          // : <Image
                          //   style={{ zIndex: 999 }}
                          //   w={24}
                          //   h={24}
                          //   src={myCards.includes(sanitizeKey(card.id))
                          //     ? "/assets/pokeball-red.svg"
                          //     : "/assets/pokeball-gray.svg"
                          //   }
                          //   onClick={() => handleFavoriteToggle(set!.id, card.id)}
                          // />
                        }
                      </Group>
                      <Image
                        className={styles.card_img}
                        src={getImageUrl(card.image, "png", "low")}
                        onClick={() =>
                          searchOnEbay(card.name, card.id, card.localId, set?.cardCount.official)
                        }
                        onLoad={() => handleImageLoad(card.id)}
                        fit={"cover"}
                        w={"60%"}
                      />
                      <Group justify="space-between" w={"100%"}>

                        <Text
                          fw={"bold"}
                          style={{ zIndex: 999 }}
                        >
                          50.00 €
                        </Text>
                        <Button
                          leftSection={<IconSearch />}
                          variant="outline"
                          color="yellow"
                          style={{ zIndex: 999 }}
                        >
                          Ebay
                        </Button>
                      </Group>
                      {/* {myCards.includes(sanitizeKey(card.id)) &&
                        <Overlay color={colorScheme === "dark" ? "#000" : "#fff"} backgroundOpacity={0.35} blur={2} />
                      } */}
                    </Stack>
                  </Paper>
                </Box>
            )}
        </SimpleGrid>
        : view === CardView.BINDER
          ? <BinderList set={set!} />
          : view === CardView.ONLYCARD
            ? <OnlyCard
              set={set!}
              filteredCards={filteredCards}
              myCards={myCards}
              handleImageLoad={handleImageLoad}
              loadedImages={loadedImages}
            />
            : <Accordion multiple variant="contained">
              {filteredCards?.length > 0
                && filteredCards.map(card =>
                  <CardList
                    key={card.id}
                    set={set!}
                    data={card}
                    myCards={myCards}
                    handleFavoriteToggle={handleFavoriteToggle}
                    handleImageLoad={handleImageLoad}
                    loadedImages={loadedImages}
                    isLoading={isLoading}
                  />
                )}
            </Accordion>


      }
    </div>
  )
}

export default SetPage;