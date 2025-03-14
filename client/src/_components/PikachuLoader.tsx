import { Container, Image } from "@mantine/core";

const PikachuLoader = () => {
  return (
    <Container
      w={"100%"}
      pos={"absolute"}
      left={"50%"}
      top={"50%"}
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <Image
        src={"/assets/pikachu-pokemon.gif"}
      />
    </Container >
  )
};

export default PikachuLoader;