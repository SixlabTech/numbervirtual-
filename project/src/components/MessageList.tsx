import React from 'react';
import { Paper, Text, Stack, Badge, Group } from '@mantine/core';
import { format } from 'date-fns';
import { useMessageStore } from '../store/messageStore';

export const MessageList: React.FC = () => {
  const messages = useMessageStore((state) => state.messages);
  const markAsRead = useMessageStore((state) => state.markAsRead);

  return (
    <Stack gap="md">
      {messages.length === 0 ? (
        <Text c="dimmed" ta="center" mt="xl">
          No messages yet. They will appear here when received.
        </Text>
      ) : (
        messages.map((message) => (
          <Paper
            key={message.id}
            shadow="sm"
            p="md"
            withBorder
            onClick={() => markAsRead(message.id)}
            style={{ cursor: 'pointer' }}
          >
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                From: {message.from}
              </Text>
              {!message.isRead && (
                <Badge color="blue" variant="light">
                  New
                </Badge>
              )}
            </Group>
            <Text size="sm">{message.content}</Text>
            <Text size="xs" c="dimmed" mt="xs">
              {format(message.timestamp, 'PPpp')}
            </Text>
          </Paper>
        ))
      )}
    </Stack>
  );
};