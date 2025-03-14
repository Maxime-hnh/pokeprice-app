import { Container } from "@mantine/core";
import BuildingMessage from "../../_components/BuildingMessage";

const CollectionDashboardPage = () => {
  return (
    <Container>
      <BuildingMessage
        imgSrc="/assets/egg-pokemon.svg"
        imgAlt="Oeuf pokémon"
        title="Patience, Dresseur..."
        textContent={<>
          Un nouvel espace est en cours d'incubation... 🥚✨
          <br />
          Notre laboratoire travaille dur pour faire éclore une page révolutionnaire dédiée au suivi de ton <strong>investissement</strong> Pokémon !
          <br />
          <br />
          Reviens bientôt, l'œuf est en train d'éclore... 🐣🔜
        </>}
        buttonMessage="Retour à l'accueil"
        redirectTo="/"
        height={250}
        width={250}
      />
    </Container>
  )
}
export default CollectionDashboardPage;