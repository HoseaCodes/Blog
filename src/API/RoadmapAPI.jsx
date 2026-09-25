import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/*
  Data for /admin/roadmap. Follows the ProjectsAPI shape (tuple per value, a
  `loading` flag, a `cancelled` guard in the effect) with two differences: it
  needs the token, and /api/roadmap is admin-only, so a non-admin session gets
  403 and is left with empty arrays rather than an error banner — PrivateRoute
  has already redirected such a user away from the page.

  One request returns the whole roadmap. There are around twenty documents and
  the page draws every part of it at once, so three round trips would buy
  nothing.
*/
function RoadmapAPI(token) {
  const [curricula, setCurricula] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [settings, setSettings] = useState({});
  const [callback, setCallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setCurricula([]);
      setPrograms([]);
      setAlternatives([]);
      setSettings({});
      setLoading(false);
      return undefined;
    }

    const getRoadmap = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/roadmap', {
          headers: { Authorization: token },
        });
        if (cancelled) return;
        setCurricula(res.data.curricula || []);
        setPrograms(res.data.programs || []);
        setAlternatives(res.data.alternatives || []);
        setSettings(res.data.settings || {});
        setError(null);
      } catch (err) {
        if (cancelled) return;
        // 403 is the expected answer for a signed-in non-admin, not a fault.
        if (err.response && err.response.status !== 403) {
          console.error('Error fetching roadmap:', err);
          setError(err.response.data?.msg || err.message);
        }
        setCurricula([]);
        setPrograms([]);
        setAlternatives([]);
        setSettings({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getRoadmap();
    return () => {
      cancelled = true;
    };
  }, [token, callback]);

  // Re-fetch after a write. Stable identity so it can sit in a dep array.
  const refresh = useCallback(() => setCallback((c) => !c), []);

  return {
    curricula: [curricula, setCurricula],
    programs: [programs, setPrograms],
    alternatives: [alternatives, setAlternatives],
    settings: [settings, setSettings],
    callback: [callback, setCallback],
    loading: [loading, setLoading],
    error: [error, setError],
    refresh,
  };
}

export default RoadmapAPI;
