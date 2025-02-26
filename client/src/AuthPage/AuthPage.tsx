import { Button, Container, Group, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconMail, IconPassword } from "@tabler/icons-react"
import { observer } from "mobx-react-lite"
import styles from './AuthPage.module.scss';
import { useLocation, useNavigate } from "react-router-dom"
import { notifications } from "@mantine/notifications"
import { AuthenticationRequest, authService } from "../_services/auth.service"

const AuthPage = observer(() => {

  const { login } = authService;
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<AuthenticationRequest>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value: string) =>
        value.trim().length === 0 ? "Veuillez renseigner un email" : null,
      password: (value: string) =>
        value.trim().length === 0 ? "Veuillez renseigner un mot de passe" : null,
    },
  })

  const handleSubmit = async (values: AuthenticationRequest) => {
    await login(values)
    navigate(location.state.from);
    notifications.show({ message: "Connexion réussie !", color: "green" })
  };

  return (
    <Container>
      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
        className={styles.form}
      >
        <Paper p={"md"} w={{ base: "100%", sm: "50%" }}>
          <Stack gap={"xl"}>
            <Title ta="start" className={styles.title}>Bienvenue</Title>
            <Text ta={"justify"}>Veuillez renseigner votre adresse email et mot de passe pour vous identifier ou créer un compte.</Text>
            <TextInput
              data-autofocus
              label="Email"
              name="email"
              placeholder="Adresse email"
              key={form.key('email')}
              {...form.getInputProps('email')}
              size="md"
              leftSection={<IconMail />}
            />

            <PasswordInput
              label="Mot de passe"
              name="password"
              key={form.key('password')}
              {...form.getInputProps('password')}
              size="md"
              leftSection={<IconPassword />}
            />
            <Group justify="center">
              <Button style={{ flex: 1 }} size="md" bg={"dark"} radius={"xl"} type="submit">Inscription / Connexion</Button>
            </Group>
          </Stack>
        </Paper>
      </form>
    </Container >
  )
})

export default AuthPage