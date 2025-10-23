import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { css } from '../styled-system/css';
import RequestsList from './pages/RequestsList';
import RequestsTable from './pages/RequestsTable';
import Problems from './pages/Problems';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className={css({ minHeight: '100vh' })}>
        {/* Navigation */}
        <nav className={css({
          background: 'rgba(26, 17, 40, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          padding: '1rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        })}>
          <div className={css({
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          })}>
            <Link 
              to="/" 
              className={css({
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textDecoration: 'none',
            })}
            style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            }}
    >
  API Monitor
</Link>
            
            <div className={css({ display: 'flex', gap: '1rem', marginLeft: 'auto' })}>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/requests/list">List View</NavLink>
              <NavLink to="/requests/table">Table View</NavLink>
              <NavLink to="/problems">Problems</NavLink>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className={css({ padding: '2rem', maxWidth: '1400px', margin: '0 auto' })}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/requests/list" element={<RequestsList />} />
            <Route path="/requests/table" element={<RequestsTable />} />
            <Route path="/problems" element={<Problems />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

function NavLink({ to, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={css({
        color: 'white',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        transition: 'all 0.2s',
        '&:hover': {
          background: 'rgba(168, 85, 247, 0.2)',
        },
      })}
    >
      {children}
    </Link>
  );
}

export default App;