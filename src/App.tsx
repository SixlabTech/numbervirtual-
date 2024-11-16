import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { SimulatorPanel } from './components/SimulatorPanel';

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <Header />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
          <MessageList />
          <SimulatorPanel />
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;