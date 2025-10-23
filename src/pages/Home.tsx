import { css } from '../../styled-system/css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className={css({ textAlign: 'center', paddingTop: '4rem' })}>
     <h1 
  className={css({
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    fontFamily: 'Michroma, sans-serif',
  })}
  style={{
    background: 'linear-gradient(135deg, #E1207A 0%, #9103EB 100%)', // Their colors
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }}
>
  API Performance Monitor
</h1>
      
      <p className={css({ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginBottom: '3rem' })}>
        Real-time insights into your API requests and problems
      </p>

      <div className={css({ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' })}>
        <HomeCard
          title="List View"
          description="View API requests in a card-based layout"
          link="/requests/list"
        />
        <HomeCard
          title="Table View"
          description="View API requests in a sortable table"
          link="/requests/table"
        />
        <HomeCard
          title="Problems"
          description="Monitor and track API issues"
          link="/problems"
        />
      </div>
    </div>
  );
}

interface HomeCardProps {
  title: string;
  description: string;
  link: string;
}

function HomeCard({ title, description, link }: HomeCardProps) {
  return (
    <Link to={link} className={css({
      display: 'block',
      background: 'rgba(26, 23, 38, 0.6)', // Updated
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(145, 3, 235, 0.3)', // Updated to their purple
      borderRadius: '16px', // Slightly more rounded
      padding: '2rem',
      width: '280px',
      textDecoration: 'none',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        border: '1px solid rgba(225, 32, 122, 0.6)', // Pink on hover
        boxShadow: '0 10px 40px rgba(225, 32, 122, 0.3)',
      },
    })}>
      <h3 className={css({ 
        color: 'white', 
        fontSize: '1.5rem', 
        marginBottom: '0.5rem',
        fontFamily: 'Michroma, sans-serif', // Use display font for card titles
      })}>
        {title}
      </h3>
      <p className={css({ color: 'rgba(255,255,255,0.7)' })}>
        {description}
      </p>
    </Link>
  );
}

export default Home;