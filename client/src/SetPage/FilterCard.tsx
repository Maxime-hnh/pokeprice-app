import { ActionIcon, CloseButton, Group, Image, Input, Menu, Switch, Text, useMantineColorScheme } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { IconCheck, IconFilter, IconSearch, IconSortAscendingNumbers, IconSortDescendingNumbers, IconX } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { cardStore } from "../_store/card.store";
import { getRarityLogo, growLogoSizeList } from "../_helpers/helpers";
import { cardService } from "../_services/card.service";
import AppContext from "../App/AppContext";


const FilterCard = observer(() => {

  const { cards, filteredCards, setFilteredCards, uniqueRarities } = cardStore;
  const { filterByRarity } = cardService;
  const { isMobile } = useContext(AppContext);

  const [switchValues, setSwitchValues] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchValue, setSearchValue] = useState<string>("");
  const { colorScheme } = useMantineColorScheme();

  const sortCards = (order: "asc" | "desc") => {
    const sorted = [...filteredCards].sort((a, b) => {
      return order === "asc" ? a.id - b.id : b.id - a.id;
    });

    setFilteredCards(sorted);
    setSortOrder(order);
  };

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


  const handleFilter = (rarities: string[]) => {
    setSwitchValues(rarities);

    const filtered = filterByRarity(rarities)
    if (sortOrder === "asc") {
      setFilteredCards(filtered);
    } else {
      setFilteredCards(filtered.reverse())
    }
  };

  useEffect(() => {
    setSwitchValues(uniqueRarities)
  }, [uniqueRarities.length])


  return (
    <Group gap={"xs"} justify="flex-start">
      <Input
        radius={"xl"}
        size="sm"
        leftSection={<IconSearch size={17} color={colorScheme === "dark" ? "yellow" : "#495057"} />}
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
        style={{ flex: isMobile ? 1 : '' }}
        styles={{ input: { fontSize: 16 } }}
        w={isMobile ? '' : 350}
      />
      <Menu closeOnItemClick={false} shadow="md" width={225} transitionProps={{ transition: 'rotate-right', duration: 150 }} offset={1}>
        <Menu.Target>
          <ActionIcon size={"lg"} color="#495057" radius={"xl"}>
            <IconFilter color="white" size={20} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              sortOrder === "desc"
                ? <IconSortAscendingNumbers size={14} />
                : <IconSortDescendingNumbers size={14} />
            }
            onClick={() => sortCards(sortOrder === "desc" ? "asc" : "desc")}
          >
            {sortOrder === "desc" ?
              "Trier par ordre croissant"
              : "Trier par ordre décroissant"
            }
          </Menu.Item>
          {uniqueRarities.length > 0 &&
            <Switch.Group
              value={switchValues}
              onChange={(val) => handleFilter(val)}
            >
              {uniqueRarities.map((rarity, index) => (
                <Menu.Item
                  key={index}
                  leftSection={
                    <Switch
                      color="teal"
                      value={rarity}
                      size="sm"
                      thumbIcon={
                        switchValues.includes(rarity) ? (
                          <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
                        ) : (
                          <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
                        )
                      }
                    />
                  }
                >
                  <Group gap={"xs"}>
                    <Image
                      src={getRarityLogo(rarity)}
                      w={growLogoSizeList.includes(rarity) ? 17 : 10}

                    />
                    <Text fz={"xs"}>{rarity === "Illustration spéciale rare" ? "SAR" : rarity}</Text>
                  </Group>
                </Menu.Item>
              ))}
            </Switch.Group>
          }
        </Menu.Dropdown>
      </Menu>

    </Group>
  )
});

export default FilterCard;