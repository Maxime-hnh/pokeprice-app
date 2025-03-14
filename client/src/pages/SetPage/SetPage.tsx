import { Center, Group, Image, SegmentedControl, Skeleton, Stack, Title, useMantineColorScheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tcgdexService } from "../../_services/tcgdex.service";
import { IconBook, IconList, IconPlayCardStarFilled } from "@tabler/icons-react";
import OnlyCard from "./OnlyCard";
import { setService } from "../../_services/set.service";
import BinderList from "./BinderList";
import AccordionList from "./AccordionList";
import { setStore } from "../../_store/set.store";
import { observer } from "mobx-react-lite";

enum CardView {
  LIST = "list",
  DETAILS = "details",
  BINDER = "binder",
  ONLYCARD = "onlyCard",
};

const SetPage = observer(() => {

  const { setId } = useParams();
  const { set } = setStore;
  const { getImageUrl } = tcgdexService;
  const { getSetById } = setService;

  const { colorScheme } = useMantineColorScheme();
  const [view, setView] = useState<CardView>(CardView.ONLYCARD);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});


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

        <SegmentedControl
          radius="md"
          size="xs"
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
        <OnlyCard handleImageLoad={handleImageLoad} loadedImages={loadedImages} withFilterBar={true} />
      </div>
      <div style={{ display: view === CardView.BINDER ? "block" : "none" }}>
        <BinderList loadedImages={loadedImages} handleImageLoad={handleImageLoad} />
      </div>
      <div style={{ display: view === CardView.LIST ? "block" : "none" }}>
        <AccordionList />
      </div>
    </div >
  )
});

export default SetPage;