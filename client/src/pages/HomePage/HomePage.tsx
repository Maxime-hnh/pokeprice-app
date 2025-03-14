import { Accordion, Container, Group, Image, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import styles from './HomePage.module.scss';
import { useNavigate } from "react-router-dom";
import { serieService } from "../../_services/serie.service";
import { cardStore } from "../../_store/card.store";
import { observer } from "mobx-react-lite";
import { serieStore } from "../../_store/serie.store";
import { setStore } from "../../_store/set.store";
import PikachuLoader from "../../_components/PikachuLoader";

const HomePage = observer(() => {

  const { getSeries } = serieService;
  const { series } = serieStore;
  const { setSet } = setStore;
  const { setFilteredCards } = cardStore;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const openSet = (setId: number) => {
    setFilteredCards([]);
    setSet(null);
    navigate(`/set/${setId}`)
  };

  const loadSeries = async () => {
    try {
      if (!series || series.length === 0) {
        setIsLoading(true)
        await getSeries();
      }
      return;
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSeries();
  }, []);

  if (isLoading) return <PikachuLoader />
  return (
    <Container p={0}>
      <Accordion variant="separated" multiple radius={"lg"} defaultValue={[]}>
        {series?.length > 0
          && series.map(serie =>
            <Accordion.Item
            className={styles.test}
              key={serie.id}
              value={serie.id.toString()}
            >
              <Accordion.Control py={"sm"}>
                <Group>
                  <Image
                    src={"/pokeball.png"}
                    w={30}
                  />
                  <Title className={styles.title} order={3}>{serie.name}</Title>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <SimpleGrid mt={"sm"} cols={{ base: 1, xs: 2, sm: 3, md: 4, xl: 4 }} spacing={"xs"}>
                  {serie.sets?.length > 0
                    && serie.sets.map(set =>
                      <Paper
                        withBorder
                        shadow="md"
                        h={125}
                        mah={125}
                        key={set.id}
                        className={styles.set_container}
                        bg={"white"}
                        p={"md"}
                        radius={"xl"}
                        display={"flex"}
                        style={{ cursor: 'pointer', justifyContent: 'center', alignItems: 'center' }}
                        onClick={() => openSet(set.id)}
                      >
                        {set.logo
                          ? <Image
                            mah={80}
                            className={styles.set_logo}
                            key={set.id}
                            src={set.logo + ".png"}
                            fit="contain"
                            alt={""}
                          />
                          : <Text fw={"bold"} ta={"center"} c={"black"}>{set.name}</Text>
                        }
                      </Paper>
                    )}
                </SimpleGrid>
              </Accordion.Panel>
            </Accordion.Item>
          )}
      </Accordion>
    </Container >
  );

});

export default HomePage;