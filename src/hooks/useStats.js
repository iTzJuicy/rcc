import { useState, useEffect } from "react";
import api from "../services/api";

let cachedStats = null;
let fetchPromise = null;

export function useStats() {
  const [stats, setStats] = useState(cachedStats || []);
  const [loading, setLoading] = useState(!cachedStats);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (cachedStats) {
      setStats(cachedStats);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = api.getStats().then((data) => {
        cachedStats = data;
        return cachedStats;
      }).finally(() => {
        fetchPromise = null;
      });
    }

    fetchPromise.then((data) => {
      if (isMounted) {
        setStats(data);
        setLoading(false);
      }
    }).catch((loadError) => {
      if (isMounted) {
        setError(loadError);
        setLoading(false);
        console.error("Failed to load site statistics.", loadError);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, loading, error };
}

export default useStats;
