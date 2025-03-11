import { ActionIcon, Container, Group, TextInput } from "@mantine/core";
import { IconSend2 } from "@tabler/icons-react";
import { useState } from "react";

const AdminPage = () => {
  const [serieValue, setSerieValue] = useState<string>("");

  const handleSubmit = async () => {
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