import { ActionIcon, Box, Container, Flex, Group, Image, rem, Stack, Text } from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconPointFilled
} from "@tabler/icons-react";
import styles from "./FooterLayout.module.scss"
import React from "react";
import useWindowSize from "./utils/useWindowSize";

const FooterLayout = () => {

  const { width } = useWindowSize();

  const redirectToGitHub = () => {
    window.open('https://github.com/Maxime-hnh', '_blank');
  };

  const redirectToLinkedIn = () => {
    window.open('https://www.linkedin.com/in/maxime-huynh1993/', '_blank');
  }

  // const data = [
  //   {
  //     title: 'Contact',
  //     links: [
  //       { label: 'email', link: '#' },
  //       { label: 'tel', link: '#' },
  //     ],
  //   },
  //   ...
  // ];

  // const groups = data.map((group) => {
  //   const links = group.links.map((link, index) => (
  //     <Text
  //       c="dimmed"
  //       fz={"sm"}
  //       display={"block"}
  //       py={"3px"}
  //       key={index}
  //       className={styles.footer_link}
  //       component="a"
  //       href={link.link}
  //       onClick={(event) => event.preventDefault()}
  //     >
  //       {link.label}
  //     </Text>
  //   ));

  //   return (
  //     <Box w={170} key={group.title}>
  //       <Text fw={700} fz={"lg"} c={"white"} mb={10} className={styles.title}>{group.title}</Text>
  //       {links}
  //     </Box>
  //   );
  // });


  return (
    <footer id={"footerLayout"} className={styles.container}>
      <Container className={styles.inner}>
        <Box className={styles.logo} maw={200}>
          <Image
            style={{ cursor: 'pointer' }}
            radius={'xs'}
            w={"48px"}
            src="/assets/my_logo_signature_222.png"
            alt="logo"
            onClick={redirectToGitHub}
          />
          <Text
            fw={"bold"}
            mt={{ base: "xs", sm: "sm" }}
            size="xs"
            c="dimmed"
            className={styles.description}
          >
            Powered by Maxime Huynh
          </Text>
        </Box>
        {/* <Flex wrap={"wrap"} className={styles.groups}>{groups}</Flex> */}
      </Container>
      <Container className={styles.afterFooter} mt={"xl"} py={"xl"}>
        <Stack w={"100%"}>
          <Flex
            justify={"space-between"}
            direction={{ base: "column-reverse", sm: "row" }}
            align={{ base: "center", sm: "initial" }}
          >

            <Text c="dimmed" size="sm">
              © 2025 Tous droits réservés.
            </Text>
            <Group gap={0} className={styles.social} justify="flex-end" wrap="nowrap">
              <ActionIcon size="lg" color="gray" variant="subtle" onClick={redirectToGitHub}>
                <IconBrandGithub style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon>
              <ActionIcon size="lg" color="gray" variant="subtle" onClick={redirectToLinkedIn}>
                <IconBrandLinkedin style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Flex>
          <Flex
            justify={"center"}
            direction={{ base: "column", xs: "row", sm: "row" }}
            align={{ base: "center", sm: "initial" }}
            gap={"xs"}
          >
            <Group gap={"xs"}>
              <Text
                c="dimmed"
                size="sm"
                className={styles.footer_link}
                component="a"
                href={"/politiquedeconfidentialite.html"}
              >
                Politique de Confidentialité
              </Text>
              <IconPointFilled color={"#868e96"} />
              <Text
                c="dimmed"
                size="sm"
                className={styles.footer_link}
                component="a"
                href={"/CGU.html"}
              >
                CGU
              </Text>
            </Group>
            {width > 575 && <IconPointFilled color={"#868e96"} />}
            <Text
              c="dimmed"
              size="sm"
              className={styles.footer_link}
              component="a"
              href={"/mentionslegales.html"}
            >
              Mentions Légales
            </Text>
          </Flex>
        </Stack>
      </Container>
    </footer>
  )
}


export default FooterLayout