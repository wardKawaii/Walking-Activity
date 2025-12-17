import React, { useEffect, useState } from 'react';
import { getStravaStats, getRecentActivities } from '../utils/strava';
import { SiStrava } from 'react-icons/si'; // <--- 1. IMPORT THIS

const StravaCard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Update this with your actual profile ID
  const STRAVA_PROFILE_URL = "https://www.strava.com/athletes/169502837?utm_source=ios_share&utm_medium=social&share_sig=5F6C453F1765383236&_branch_match_id=1527334972863592903&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXLy4pSixL1EssKNDLyczL1g%2F3dksKNE3Mi4pMsq8rSk1LLSrKzEuPTyrKLy9OLbJ1zijKz00FAJEk5CA9AAAA";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getStravaStats();
        const activitiesData = await getRecentActivities();

        if (!statsData) {
            setError(true);
        } else {
            setStats(statsData);
            setActivities(activitiesData);
        }
      } catch (err) {
        console.error("Component Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- RENDERING ---

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={{...styles.header, justifyContent: 'center', padding: '20px 0'}}>
          <p style={{color: '#888'}}>Updating Stats...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={styles.card}>
        <div style={styles.header}>
            <h3 style={styles.heading}>My Strava</h3>
            {/* <--- 2. UPDATED LOGO HERE ---> */}
            <SiStrava style={{ color: '#fc4c02', fontSize: '24px' }} />
        </div>
        <div style={{textAlign: 'center', padding: '20px 0', color: '#666'}}>
            <p>Unable to load live data.</p>
            <a href={STRAVA_PROFILE_URL} target="_blank" rel="noreferrer" style={styles.button}>
                Visit Profile
            </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h3 style={styles.heading}>Recent Activity</h3>
          <span style={styles.badge}>Running</span>
        </div>
        
        {/* <--- 3. UPDATED LOGO HERE TOO ---> */}
        <SiStrava style={{ color: '#fc4c02', fontSize: '28px' }} />
        
      </div>

      {/* Main Stats Grid */}
      <div style={styles.grid}>
        <div style={styles.statBox}>
          <span style={styles.statValue}>{stats.run_total}</span>
          <span style={styles.statLabel}>Total Runs</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statValue}>{stats.distance_total}km</span>
          <span style={styles.statLabel}>Distance</span>
        </div>
      </div>

      {/* Recent Activity List */}
      <div style={styles.list}>
        <h4 style={styles.subHeading}>LATEST RUNS</h4>
        {activities.length > 0 ? (
            activities.slice(0, 2).map((activity) => (
            <div key={activity.id} style={styles.listItem}>
                <span>🏃 {activity.name}</span>
                <span style={styles.highlight}>
                {(activity.distance / 1000).toFixed(1)} km
                </span>
            </div>
            ))
        ) : (
            <p style={{fontSize: '0.8rem', color: '#999'}}>No recent runs found.</p>
        )}
      </div>

      {/* Button */}
      <a 
        href={STRAVA_PROFILE_URL} 
        target="_blank" 
        rel="noreferrer"
        style={styles.button}
      >
        View Full Profile
      </a>
    </div>
  );
};

// Styles
const styles = {
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
    border: '1px solid #eaeaea',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', // Changed from 'start' to 'center' for better alignment with icon
    marginBottom: '15px',
  },
  heading: { margin: 0, fontSize: '1.1rem', color: '#333' },
  badge: { 
    background: '#fc4c02', 
    color: 'white', 
    padding: '2px 8px', 
    borderRadius: '10px', 
    fontSize: '0.7rem',
    marginTop: '4px',
    display: 'inline-block'
  },
  // Note: I removed the styles.logo object since we are using inline styles on the icon now
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '15px',
  },
  statBox: {
    background: '#f8f9fa',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: { fontSize: '1.2rem', fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: '0.8rem', color: '#666' },
  list: { marginBottom: '15px' },
  subHeading: { fontSize: '0.75rem', color: '#888', marginBottom: '8px' },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    marginBottom: '6px',
    color: '#444'
  },
  highlight: { fontWeight: 'bold', color: '#fc4c02' },
  button: {
    display: 'block',
    textAlign: 'center',
    background: '#fc4c02',
    color: 'white',
    textDecoration: 'none',
    padding: '10px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'opacity 0.2s'
  }
};

export default StravaCard;