import { useState, useEffect } from "react";
import api from "../services/api";

const STATS_DEFAULTS = [
  { value: "15+", label: "Years Experience" },
  { value: "250+", label: "Projects Completed" },
  { value: "100%", label: "Quality Commitment" },
  { value: "180+", label: "Satisfied Clients" },
];

let cachedStats = null;
let fetchPromise = null;

export function useStats() {
  const [stats, setStats] = useState(cachedStats || STATS_DEFAULTS);
  const [loading, setLoading] = useState(!cachedStats);

  useEffect(() => {
    let isMounted = true;

    if (cachedStats) {
      setStats(cachedStats);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = api
        .get("/public/stats")
        .then((res) => {
          if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            cachedStats = res.data;
          } else {
            cachedStats = STATS_DEFAULTS;
          }
          return cachedStats;
        })
        .catch(() => {
          cachedStats = STATS_DEFAULTS;
          return cachedStats;
        })
        .finally(() => {
          fetchPromise = null;
        });
    }

    fetchPromise.then((data) => {
      if (isMounted) {
        setStats(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, loading };
}

export default useStats;
