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
  })}
  style={{
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
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
      background: 'rgba(26, 17, 40, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '12px',
      padding: '2rem',
      width: '280px',
      textDecoration: 'none',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        border: '1px solid rgba(139, 92, 246, 0.6)',
        boxShadow: '0 10px 40px rgba(168, 85, 247, 0.3)',
      },
    })}>
      <h3 className={css({ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' })}>
        {title}
      </h3>
      <p className={css({ color: 'rgba(255,255,255,0.6)' })}>
        {description}
      </p>
    </Link>
  );
}

export default Home;