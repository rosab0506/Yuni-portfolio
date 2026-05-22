import { useEffect } from 'react';

export function useTrackVisit() {
  useEffect(() => {
    const page = window.location.pathname;

    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          console.warn('[useTrackVisit] Failed:', err);
        }
      })
      .catch((err) => {
        console.warn('[useTrackVisit] Network error:', err);
      });
  }, []);
}
