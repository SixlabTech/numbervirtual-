import React from 'react';
import { Group, Title, Paper, CopyButton, Button, Text } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useMessageStore } from '../store/messageStore';

export const Header: React.FC = () => {
  const virtualNumber = useMessageStore((state) => state.virtualNumber);

  return (
    <Paper shadow="sm" p="md" withBorder mb="md">
      <Group justify="space-between">
        <div>
          <Title order={3}>Virtual Phone Number</Title>
          <Group gap="xs" mt={4}>
            <Text size="lg" fw={500}>
              {virtualNumber}
            </Text>
            <CopyButton value={virtualNumber} timeout={2000}>
              {({ copied, copy }) => (
                <Button
                  color={copied ? 'teal' : 'blue'}
                  size="compact-xs"
                  variant="subtle"
                  onClick={copy}
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </Button>
              )}
            </CopyButton>
          </Group>
        </div>
      </Group>
    </Paper>
  );
};