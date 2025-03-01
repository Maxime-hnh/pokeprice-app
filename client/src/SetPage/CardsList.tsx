import { Accordion, Badge, Group, Image, Loader, Pill, Skeleton, Stack, Text, useMantineColorScheme } from "@mantine/core";
import { Set } from "../_interfaces/set.interface";
import { useState } from "react";
import { tcgdexService } from "../_services/tcgdex.service";
import { searchService } from "../_services/search.service";
import { IconArrowRightBar, IconRefresh, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { Card } from "../_interfaces/card.interface";
import { formatCardCount, getRarityLogo, growLogoSizeList } from "../_helpers/helpers";

interface CardListProps {
  set: Set;
  data: Card;
  handleImageLoad: (cardId: number) => void;
  loadedImages: Record<string, boolean>;
}

const CardsList = ({ set, data, handleImageLoad, loadedImages }: CardListProps) => {

  const [card, setCard] = useState<Card>(data)
  const { getImageUrl } = tcgdexService;
  const { searchOnEbay } = searchService;
  const [priceIsLoading, setPriceIsLoading] = useState<boolean>(false);

  // const updatePrices = async (serieId: string, setId: string, cardId: string) => {
  //   try {
  //     setPriceIsLoading(true);
  //     const updatedCard = await updateEbayPrices(serieId, setId, cardId)
  //     if (updatedCard) {
  //       setCard(updatedCard)
  //       notifications.show({ message: `Les prix de la carte ${card.name} ont été mis à jour`, color: "green" })
  //     }
  //   } catch (error) {
  //     notifications.show({ message: "Une erreur est survenue pendant la MAJ du prix", color: "red" })
  //   } finally {
  //     setPriceIsLoading(false);
  //   }
  // }

  return (
    <Accordion.Item key={card.id} value={card.id.toString()}>
      <Accordion.Control>
        <Group align="center" gap={3} justify="space-between" mr={15}>
          <Group>
            <Text fz={"xs"} className="titleFont">{card.name}</Text>
            <Group gap={"xs"}>
              <Text fz={"xs"}>{formatCardCount(card, set!.cardCount.official!)}</Text>
              <Image
                src={getRarityLogo(card.rarity)}
                w={growLogoSizeList.includes(card.rarity) ? 17 : 12}
              />
            </Group>
          </Group>
          {card.averagePrice
            && <Pill fz={"xs"}>{`Prix moyen : ${card.averagePrice} €`}</Pill>
          }
        </Group>
      </Accordion.Control>

      <Accordion.Panel>
        <Group pos={"relative"}>
          <Image
            w={"25%"}
            src={getImageUrl(card.image, "png", "low")}
            onClick={() =>
              searchOnEbay(card.ebaySearchContent!)
            }
            fit={"cover"}
          />
          <Stack justify="flex-start" align="flex-start" gap={0}>
            <Stack gap={0}>
              {card.averagePrice !== card.lowestPrice
                && <Text c={"green"} fz={"sm"} fw={"bold"}>{`Prix le plus faible : ${card.lowestPrice} €`}</Text>

              }
              {card.averagePrice
                && <Text c={"blue"} fz={"sm"} fw={"bold"}>{`Prix moyen : ${card.averagePrice} €`}</Text>

              }
              {card.averagePrice !== card.highestPrice
                && <Text c={"red"} fz={"sm"} fw={"bold"}>{`Prix le plus élevé : ${card.highestPrice} €`}</Text>

              }
            </Stack>
            <Group
              gap={3}
              pos={"absolute"}
              bottom={0}
              wrap="nowrap"
              align="center"
            // onClick={() => updatePrices(set.serie.id, set.id, card.id)}
            >
              <IconRefresh
                color="#828282"
                size={12}
                style={{
                  transition: "transform 0.3s ease-in-out",
                  transform: priceIsLoading ? "rotate(360deg)" : "rotate(0deg)",
                  animation: priceIsLoading ? "spin 1s linear infinite" : "none",
                }}
              />
              <Text fz={10} c={"dimmed"}>Dernière MAJ :</Text>
              {priceIsLoading
                ? <Loader color="blue" size="xs" type="dots" />
                : <Text fz={10} c={"dimmed"}>{`${dayjs(card.updatedAt).format('DD/MM/YYYY HH:mm')}`}</Text>
              }
            </Group>
          </Stack>

        </Group>
      </Accordion.Panel>

    </Accordion.Item>
  )
}
export default CardsList;