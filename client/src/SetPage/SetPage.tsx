import { Center, CloseButton, Group, Image, Input, SegmentedControl, Skeleton, Stack, Title, useMantineColorScheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tcgdexService } from "../_services/tcgdex.service";
import { IconBook, IconList, IconPlayCardStarFilled, IconSearch } from "@tabler/icons-react";
import OnlyCard from "./OnlyCard";
import { setService } from "../_services/set.service";
import BinderList from "./BinderList";
import AccordionList from "./AccordionList";
import { setStore } from "../_store/set.store";
import { observer } from "mobx-react-lite";
import { cardStore } from "../_store/card.store";

enum CardView {
  LIST = "list",
  DETAILS = "details",
  BINDER = "binder",
  ONLYCARD = "onlyCard",
};

const SetPage = observer(() => {

  const { setId } = useParams();
  const { getImageUrl } = tcgdexService;
  const { getSetById } = setService;

  const { set } = setStore;
  const { cards, setFilteredCards } = cardStore;
  const [searchValue, setSearchValue] = useState<string>("");
  const { colorScheme } = useMantineColorScheme();
  const [view, setView] = useState<CardView>(CardView.ONLYCARD)

  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value === "") {
      setFilteredCards(cards);
      return;
    };

    const filtered = cards.filter((card) =>
      card.name.toLowerCase().includes(value)
    );
    setFilteredCards(filtered);
  };

  const handleImageLoad = (cardId: number) => {
    setLoadedImages((prev) => ({
      ...prev,
      [cardId]: true,
    }));
  };

  useEffect(() => {
    getSetById(Number(setId!))
  }, [])

  return (
    <div>
      <Stack w={"100%"} mb={"md"} gap={"xs"}>
        <Group align="center" justify="center">
          {!set ?
            <Skeleton w={150} h={60} />
            : set.logo
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
          onChange={(e) => handleSearchChange(e.target.value.toLowerCase())}
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => handleSearchChange("")}
              style={{ display: searchValue ? undefined : 'none' }}
            />
          }

        />
        <SegmentedControl
          radius="xl"
          size="xs"
          fullWidth
          disabled={!set}
          onChange={(value) => setView(value as CardView)}
          data={[
            {
              value: CardView.ONLYCARD,
              label: (
                <Center>
                  <IconPlayCardStarFilled color={colorScheme === "dark" ? "yellow" : "#495057"} />
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

          ]} />
      </Stack>
      <div style={{ display: view === CardView.ONLYCARD ? "block" : "none" }}>
        <OnlyCard handleImageLoad={handleImageLoad} loadedImages={loadedImages} />
      </div>
      <div style={{ display: view === CardView.BINDER ? "block" : "none" }}>
        <BinderList loadedImages={loadedImages} handleImageLoad={handleImageLoad} />
      </div>
      <div style={{ display: view === CardView.LIST ? "block" : "none" }}>
        <AccordionList />
      </div>
    </div>
  )
});

export default SetPage;