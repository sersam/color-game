import axios from 'axios';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const AUTH_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1';

export const authenticateUser = async (code) => {
    const response = await axios.post(AUTH_URL, new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
};

export const fetchUserProfile = async (token) => {
    const response = await axios.get(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const fetchUserPlaylists = async (token) => {
    const response = await axios.get(`${API_URL}/me/playlists`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};