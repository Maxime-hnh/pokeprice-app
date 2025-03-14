import { ActionIcon, Box, Group, Button, Popover, Stack } from '@mantine/core';
import styles from './NavbarMobile.module.scss';
import { useContext } from 'react';
import AppContext from '../App/AppContext';
import { IconGraphFilled, IconHeartFilled, IconHomeFilled, IconUserFilled } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconPower } from "@tabler/icons-react";
import { authStore } from "../_store/auth.store";
import { useState } from "react";

enum TabName {
  HOME = "/",
  WISHLIST = "/wishlist",
  TABLE = "/table",
  PROFILE = "/profile"
}

const NavBarMobile = () => {

  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabName>(location.pathname as TabName);
  const handleSetActive = (tabName: TabName) => {
    setActiveTab(tabName);
  };
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();
  const { isLoggedIn, clearToken } = authStore;
  const [opened, setOpened] = useState(false);

  const handleLogout = () => {
    clearToken();
    setOpened(!opened);
    window.location.reload();
  };

  const handleLogin = () => {
    navigate('/login', { state: { from: window.location.pathname } });
    setOpened(!opened)
  }

  if (!isMobile) return null;
  return (
    <Box className={styles.navbar_container}>
      <Group justify='space-evenly' w={"100%"}>
        <ActionIcon
          variant='transparent'
          size={"lg"}
          color='white'
          onClick={() => {
            navigate('/')
            handleSetActive(TabName.HOME)
          }}
        >
          <IconHomeFilled
            size={30}
            color={activeTab === TabName.HOME ? "#ffcd00" : "#fff"}
          />
        </ActionIcon>

        <ActionIcon
          variant='transparent'
          size={"lg"}
          color='white'
          onClick={() => {
            navigate('/wishlist')
            handleSetActive(TabName.WISHLIST)
          }}
        >
          <IconHeartFilled size={30}
            color={activeTab === TabName.WISHLIST ? "#ffcd00" : "#fff"}
          />
        </ActionIcon>

        <ActionIcon
          variant='transparent'
          size={"lg"}
          color='white'
          onClick={() => {
            navigate('/table')
            handleSetActive(TabName.TABLE)
          }}
        >
          <IconGraphFilled
            size={30}
            color={activeTab === TabName.TABLE ? "#ffcd00" : "#fff"}
          />
        </ActionIcon>

        <Popover
          trapFocus
          withArrow
          width={200}
          position="bottom"
          shadow="md"
          opened={opened}
          onChange={setOpened}
        >
          <Popover.Target>
            <ActionIcon
              variant='transparent'
              size={"lg"}
              color='white'
              onClick={() => setOpened((o) => !o)}
            >
              <IconUserFilled size={30} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            {!isLoggedIn
              ? <Button
                color="dark"
                type="button"
                variant="light"
                w={"100%"}
                leftSection={<IconPower />}
                onClick={handleLogin}
              >
                Connexion
              </Button>
              : <Button
                color="red"
                type="button"
                variant="light"
                w={"100%"}
                leftSection={<IconPower />}
                onClick={handleLogout}
              >
                Me déconnecter
              </Button>
            }
          </Popover.Dropdown>
        </Popover>
      </Group>
    </Box >
  )
}
export default NavBarMobile;