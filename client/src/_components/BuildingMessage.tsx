import { Image, Container, Title, Text, Button, SimpleGrid, Group, Stack } from '@mantine/core';
import styles from './BuildingMessage.module.scss';
import { useNavigate } from 'react-router-dom';

interface ConstructionMessageProps {
  imgSrc: string;
  imgAlt: string;
  title: string;
  textContent: React.ReactNode;
  buttonMessage: string;
  redirectTo?: string;
  width?: number;
  height?: number;
  withCredit?: boolean;
}

const BuildingMessage = ({ imgSrc, imgAlt, title, textContent, buttonMessage, redirectTo, width, height, withCredit }: ConstructionMessageProps) => {

  const navigate = useNavigate();

  return (
    <Container className={styles.root} h={"calc(100dvh - 59px - 0.75rem)"}>
      <SimpleGrid spacing={{ base: 20, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Stack justify='center'>
          <Group pos={"relative"} justify='center'>
            <Image h={height} w={width} src={imgSrc} className={styles.mobileImage} alt={imgAlt} />
            <Image src={imgSrc} className={styles.desktopImage} alt={imgAlt} />
            {withCredit
              && <Text
                fz={10}
                pos={"absolute"}
                right={0}
                bottom={-5}
                component="a"
                href='/credit.html'
                td={"underline"}
                c={"blue"}
              >
                Crédit
              </Text>
            }
          </Group>
        </Stack>
        <div>
          <Title className={styles.title}>{title}</Title>
          <Text c="dimmed" size="lg" ta={"justify"}>
            {textContent}
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="xl"
            className={styles.control}
            onClick={() => navigate(`${redirectTo}`)}
          >
            {buttonMessage}
          </Button>

        </div>
      </SimpleGrid>
    </Container>
  )
}
export default BuildingMessage;