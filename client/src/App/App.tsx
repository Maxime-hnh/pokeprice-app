import {
  AppShell,
  AppShellMain,
  AppShellSection,
  Box,
  createTheme,
  Group,
  Image,
  Loader,
  MantineProvider,
  MantineThemeOverride,
} from '@mantine/core';
import dayjs from 'dayjs';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import "@mantine/notifications/styles.css";
import "../global.css";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useWindowSize from '../_components/utils/useWindowSize';
import { Suspense, useEffect, useState } from 'react';
import { MOBILE_SIZE } from '../_helpers/constants';
import AppContext from './AppContext';
import { Notifications } from '@mantine/notifications';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import SetPage from '../pages/SetPage/SetPage';
import { ModalsProvider } from '@mantine/modals';
import LoginButton from '../_components/LoginButton';
import AdminPage from '../pages/AdminPage/AdminPage';
import ProtectedRoute from '../_components/security/ProtectedRoute';
import FooterLayout from '../_components/FooterLayout';
import NavBarMobile from '../_components/NavbarMobile';
import HomePage from '../pages/HomePage/HomePage';
import AuthPage from '../pages/AuthPage/AuthPage';
import WishListPage from '../pages/WishListPage/WishListPage';
import CollectionDashboardPage from '../pages/CollectionDashboardPage/CollectionDashboardPage';

const App = () => {

  dayjs.extend(customParseFormat);

  const themeMantine: MantineThemeOverride = createTheme({
    autoContrast: true,
    components: {
      // Paper: {
      //   styles: (theme: any) => ({
      //     root: {
      //       backgroundColor: theme === 'dark'
      //         ? "#101010"
      //         : "red"
      //     }
      //   })
      // }
      AppShell: {
        styles: (theme: any) => ({
          main: {
            paddingInlineEnd: "0",
            paddingInlineStart: "0",
            paddingBottom: "0"
          }
        })
      }
    }

  });

  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const isMobile = window.innerWidth < MOBILE_SIZE;
    setIsMobile(isMobile);
    const vh = window.innerHeight * 0.01;
    if (isMobile) document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [width]);


  return (
    <MantineProvider theme={themeMantine} defaultColorScheme="light">
      <Notifications autoClose={4000} zIndex={1000000} />
      <ModalsProvider />
      <AppContext.Provider value={{
        isMobile,
      }}>

        <AppShell
          id='appShell'
          header={{ height: 60 }}
          navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
          padding={{ base: "xs", md: "md" }}
        >

          <AppShell.Header zIndex={9999} className={"appShell_header"}>
            <Group justify={isMobile ? "center" : "space-between"} h="100%" px="md">
              <Image
                w={120}
                src={"/assets/poketrack_logo.png"}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/')}
              />
              {!isMobile && <LoginButton />}
            </Group>
          </AppShell.Header>

          {/* <AppShell.Navbar py="md" px={4} >
          </AppShell.Navbar> */}

          <AppShell.Main h={"calc(100dvh - 59px - 1rem)"} style={{ overflow: "scroll" }}>
            <Box style={{ paddingLeft: "0.625rem", paddingRight: "0.625rem" }} mih={"calc(100dvh - 59px - 0.75rem)"}>
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/set/:setId" element={<SetPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/wishlist" element={<WishListPage />} />
                  <Route path="/table" element={<CollectionDashboardPage />} />
                  {/* <Route path="/admin" element={<AdminPage />} />
                 */}

                  <Route element={<ProtectedRoute requiredRole="admin" />}>
                    <Route path="/admin" element={<AdminPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </Box>
            <AppShellSection>
              <FooterLayout />
            </AppShellSection>
            {isMobile && <NavBarMobile />}
          </AppShell.Main>

        </AppShell>

      </AppContext.Provider>
    </MantineProvider>
  );
}

export default App;
