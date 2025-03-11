import { Accordion, Container, Group, Image, Loader, Pill, Table, Text } from "@mantine/core";
import { useState } from "react";
import { tcgdexService } from "../_services/tcgdex.service";
import { searchService } from "../_services/search.service";
import { IconRefresh } from "@tabler/icons-react";
import dayjs from "dayjs";
import { formatCardCount, getRarityLogo, growLogoSizeList } from "../_helpers/helpers";
import { setStore } from "../_store/set.store";
import { cardStore } from "../_store/card.store";
import { observer } from "mobx-react-lite";

const AccordionList = observer(() => {

  const { set } = setStore;
  const { filteredCards } = cardStore;
  const { getImageUrl } = tcgdexService;
  const { searchOnEbay, searchOnVinted } = searchService;
  const [priceIsLoading, setPriceIsLoading] = useState<boolean>(false);

  return (
    <Container mx={{ base: 0, xl: "auto" }} px={0}>
      <Group gap={"xs"} my={"xs"}>
        <Text>Prix moyen du set :</Text>
        <Text c={"green"} fw={"bold"}>{`${filteredCards.reduce((sum, card) => sum + (Number(card.averagePrice) || 0), 0).toFixed(2)} €`}</Text>
      </Group>
      <Accordion multiple variant="contained">
        {filteredCards?.length > 0
          && filteredCards.map(card => (
            <Accordion.Item key={card.id} value={card.id.toString()}>
              <Accordion.Control>
                <Group align="flex-start" wrap="nowrap" gap={3} justify="space-between" mr={15}>
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
                    ? <Pill fz={"xs"}>{`Prix moyen : ${card.averagePrice} €`}</Pill>
                    : <Pill bg={"#fa52521a"} c={"#fa5252"} fw={"bold"} fz={"xs"}>Prix inconnu</Pill>
                  }
                </Group>
              </Accordion.Control>

              <Accordion.Panel>
                <Group align="flex-start" pos={"relative"} wrap="nowrap">
                  <Image
                    w={"25%"}
                    src={getImageUrl(card.image, "png", "low")}
                    onClick={() =>
                      searchOnEbay(card.ebaySearchContent!)
                    }
                    fit={"cover"}
                  />
                  <Table variant="vertical" layout="fixed" verticalSpacing={1}>
                    <Table.Caption>
                      <Group
                        gap={3}
                        wrap="nowrap"
                        align="center"
                        justify="center"
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
                    </Table.Caption>

                    <Table.Tbody>

                      <Table.Tr>
                        <Table.Th fz={"xs"}>Nom </Table.Th>
                        <Table.Td>{card.name}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th fz={"xs"}>Prix le + faible </Table.Th>
                        {card.lowestPrice && <Table.Td c={"green"}>{Number(card.lowestPrice).toFixed(2)} €</Table.Td>}
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th fz={"xs"}>Prix moyen </Table.Th>
                        {card.averagePrice && <Table.Td c={"blue"}>{Number(card.averagePrice).toFixed(2)} €</Table.Td>}
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th fz={"xs"}>Prix le + élevé </Table.Th>
                        {card.highestPrice && <Table.Td c={"red"}>{Number(card.highestPrice).toFixed(2)} €</Table.Td>}
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>
                          <Group justify="flex-end">

                            <Image
                              w={50}
                              src={"/assets/ebay-logo.svg"}
                              onClick={() =>
                                searchOnEbay(card.ebaySearchContent!)
                              }
                              style={{ cursor: 'pointer' }}
                            />
                          </Group>
                        </Table.Th>
                        <Table.Td c={"red"}>
                          <Image
                            w={50}
                            src={"/assets/vinted-logo.svg"}
                            onClick={() =>
                              searchOnVinted(card.ebaySearchContent!)
                            }
                            style={{ cursor: 'pointer' }}
                          />
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>

                </Group>
              </Accordion.Panel >

            </Accordion.Item >
          ))}
      </Accordion>
    </Container>
  );
});

export default AccordionList;