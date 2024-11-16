import React, { useState } from 'react';
import { Paper, TextInput, Textarea, Button, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMessageStore } from '../store/messageStore';

export const SimulatorPanel: React.FC = () => {
  const [from, setFrom] = useState('');
  const [content, setContent] = useState('');
  const addMessage = useMessageStore((state) => state.addMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !content) {
      notifications.show({
        title: 'Error',
        message: 'Please fill in all fields',
        color: 'red',
      });
      return;
    }

    addMessage({
      id: Date.now().toString(),
      from,
      content,
      timestamp: new Date(),
      isRead: false,
    });

    notifications.show({
      title: 'Message Received',
      message: 'New SMS message has been received',
      color: 'green',
    });

    setFrom('');
    setContent('');
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="From Number"
            placeholder="+1 (555) 000-0000"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Textarea
            label="Message Content"
            placeholder="Type your message here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minRows={3}
          />
          <Button type="submit">Simulate Incoming Message</Button>
        </Stack>
      </form>
    </Paper>
  );
};