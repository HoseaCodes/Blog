import { useState, useEffect, useCallback } from 'react';
import { apiLocal } from '../lib/stormGate';

/*
  Data for /admin/roadmap.

  Uses `apiLocal` (the Storm-Gate authed axios from src/lib/stormGate.js), the
  same client ListUser, UserAPI, PointsAPI and StoreAPI use. It attaches the
  bearer token from the Storm-Gate SDK's own session.

  It deliberately does NOT follow AdminBlogs, which sets
  `Authorization: token` by hand from GlobalState's `accesstoken` cookie value:
  that cookie is not reliably readable from JS, so the header goes out empty and
  the request never even reaches the route. Don't reintroduce a token argument
  here — there is nothing for the caller to pass.

  One request returns the whole roadmap. There are around twenty documents and
  the page draws every part of it at once, so three round trips would buy
  nothing.
*/
function RoadmapAPI() {
  const [curricula, setCurricula] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [settings, setSettings] = useState({});
  const [callback, setCallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const getRoadmap = async () => {
      setLoading(true);
      try {
        const res = await apiLocal.get('/api/roadmap');
        if (cancelled) return;
        setCurricula(res.data.curricula || []);
        setPrograms(res.data.programs || []);
        setAlternatives(res.data.alternatives || []);
        setSettings(res.data.settings || {});
        setError(null);
      } catch (err) {
        if (cancelled) return;
        const status = err.response?.status;
        // 401/403 is the expected answer for a signed-out or non-admin visitor,
        // not a fault: PrivateRoute has already redirected such a user away.
        // Anything else is worth showing, because an empty page with no
        // explanation is indistinguishable from "you have no curricula".
        if (status !== 401 && status !== 403) {
          console.error('Error fetching roadmap:', err);
          setError(err.response?.data?.msg || err.message);
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
  }, [callback]);

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
