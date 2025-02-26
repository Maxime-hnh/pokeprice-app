import { ActionIcon, Container, Group, TextInput } from "@mantine/core";
import { IconSend2 } from "@tabler/icons-react";
import { useState } from "react";
import { dbFirebaseServie } from "../_services/dbFirebase.service";

const AdminPage = () => {
  const [serieValue, setSerieValue] = useState<string>("");
  const { insertCards } = dbFirebaseServie;

  const handleSubmit = async () => {
    await insertCards(serieValue);
  }

  return (
    <Container>

      <Group gap={0}>
        <TextInput
          value={serieValue}
          onChange={(e) => setSerieValue(e.target.value)}
        />
        <ActionIcon onClick={handleSubmit}>
          <IconSend2 />
        </ActionIcon>
      </Group>
    </Container>
  )
}
export default AdminPage;