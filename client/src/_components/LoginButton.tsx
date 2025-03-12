import { ActionIcon, Button, Popover } from "@mantine/core";
import { IconLogout, IconPower, IconUser } from "@tabler/icons-react";
import { authStore } from "../_store/auth.store";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const LoginButton = observer(() => {

  const { clearToken, isLoggedIn } = authStore;
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();


  const handleLogout = () => {
    clearToken();
    setOpened(!opened);
    window.location.reload();
  };

  const handleLogin = () => {
    navigate('/login', { state: { from: window.location.pathname } });
    setOpened(!opened)
  }

  return (
    <>
      {!isLoggedIn ?
        <Button
          color="dark"
          onClick={handleLogin}
        >
          Connexion
        </Button>
        : <ActionIcon
          onClick={handleLogout}
          radius={"xl"}
          size={"xl"}
          color="dark"
        >
          <IconLogout size={24} />
        </ActionIcon>
      }
    </>
  )
});

export default LoginButton;