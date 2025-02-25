import { useState, useEffect } from 'react';

/**
 * A hook that returns whether a media query matches the current viewport
 * @param query The media query to check
 * @returns A boolean indicating whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window === 'undefined') return;
    
    // Create a media query list
    const media = window.matchMedia(query);
    
    // Set the initial value
    setMatches(media.matches);
    
    // Create a callback function to handle changes
    const listener = () => setMatches(media.matches);
    
    // Add the listener to the media query
    media.addEventListener("change", listener);
    
    // Clean up the listener when the component unmounts
    return () => media.removeEventListener("change", listener);
  }, [query]);
  
  return matches;
} 