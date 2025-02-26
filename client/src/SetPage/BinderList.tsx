import { Box, Card, Container, Divider, Grid, Group, Image, Paper, Text } from "@mantine/core";
import { Set } from "../_interfaces/set.interface";
import { tcgdexService } from "../_services/tcgdex.service";
import { Fragment } from "react";

interface BinderListProps {
  set: Set;
}

const BinderList = ({ set }: BinderListProps) => {

  const firstPageSize = 12;
  const pageSize = 24;
  const { getImageUrl } = tcgdexService;

  const cards = set.cards.flatMap((card) =>
    card.variants.length > 0
      ? card.variants.map((variant) => ({
        ...card,
        variantType: variant.cardVariant.type,
        cardVariantId: variant.cardVariantId,
      }))
      : [card]
  );

  const firstPage = cards.slice(0, firstPageSize);
  const remainingCards = cards.slice(firstPageSize);

  const pages: any[] = [];
  for (let i = 0; i < remainingCards.length; i += pageSize) {
    pages.push(remainingCards.slice(i, i + pageSize));
  }

  return (
    <Container mx={{ base: 0, xl: 200 }}>
      {/* Première page (seulement 12 cartes à droite) */}
      <Grid gutter="xl">
        <Grid.Col span={6}>
          <Paper w={"100%"} h={"100%"} bg={"#f1f3f5"} radius={"md"}></Paper>
        </Grid.Col>

        <Grid.Col span={6}>
          <Grid>
            {firstPage.map((pokemon: any) => (
              <Grid.Col key={pokemon.id + pokemon.variantType} span={3} p={{ base: 3, md: "xs" }}>
                <Image src={getImageUrl(pokemon.image, "png", "low")} alt={pokemon.name} />
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
                  {leftSide.map((pokemon: any) => (
                    <Grid.Col key={pokemon.id + pokemon.variantType} span={3} p={{ base: 3, md: "xs" }}>
                      <Image src={getImageUrl(pokemon.image, "png", "low")} alt={pokemon.name} />
                    </Grid.Col>
                  ))}
                </Grid>
              </Grid.Col>
              <Grid.Col span={6}>
                <Grid>
                  {rightSide.map((pokemon: any) => (
                    <Grid.Col key={pokemon.id + pokemon.variantType} span={3} p={{ base: 3, md: "xs" }}>
                      <Image src={getImageUrl(pokemon.image, "png", "low")} alt={pokemon.name} />
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

}

export default BinderList;