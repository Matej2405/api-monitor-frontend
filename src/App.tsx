import { css } from '../styled-system/css';
import Dashboard from './pages/Dashboard'; // NEW - one page

function App() {
  return (
    <div className={css({ minHeight: '100vh' })}>
      <Dashboard />
    </div>
  );
}

export default App;