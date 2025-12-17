// src/utils/strava.js

const CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
const REFRESH_TOKEN = import.meta.env.VITE_STRAVA_REFRESH_TOKEN;

const TOKEN_ENDPOINT = 'https://www.strava.com/oauth/token';
const ATHLETES_ENDPOINT = 'https://www.strava.com/api/v3/athlete/activities';
const STATS_ENDPOINT = (id) => `https://www.strava.com/api/v3/athletes/${id}/stats`;

// 1. Get a fresh Access Token
const getAccessToken = async () => {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error("MISSING ENV VARIABLES: Check your .env file.");
    throw new Error("Missing Strava Credentials");
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error("Strava Auth Error:", data);
    throw new Error("Failed to get access token");
  }

  return data;
};

// 2. Fetch Athlete Stats
export const getStravaStats = async () => {
  try {
    const tokenData = await getAccessToken();
    const access_token = tokenData.access_token;
    
    // First get the athlete ID
    const athleteResponse = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const athlete = await athleteResponse.json();

    // Then use ID to get stats
    const statsResponse = await fetch(STATS_ENDPOINT(athlete.id), {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const stats = await statsResponse.json();

    return {
      run_total: stats.all_run_totals?.count || 0,
      distance_total: ((stats.all_run_totals?.distance || 0) / 1000).toFixed(1),
      count_total: stats.all_run_totals?.count || 0
    };
  } catch (error) {
    console.error("Error in getStravaStats:", error);
    return null;
  }
};

// 3. Fetch Recent Activities
export const getRecentActivities = async () => {
  try {
    const tokenData = await getAccessToken();
    const access_token = tokenData.access_token;

    const response = await fetch(`${ATHLETES_ENDPOINT}?per_page=2`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    
    if (!response.ok) return []; 

    const activities = await response.json();
    return Array.isArray(activities) ? activities : [];
  } catch (error) {
    console.error("Error in getRecentActivities:", error);
    return []; 
  }
};