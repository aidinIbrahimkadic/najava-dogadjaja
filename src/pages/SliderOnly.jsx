import React, { useEffect } from 'react';
import { useGetUpcomingEvents } from '../features/front/useUpcomingEvents';
import CalendarSpinner from '../ui/CalendarSpinner';
import PosterCarouselEmbed from '../ui/Front/PosterCarouselEmbed';

// jesmo li u iframu?
function inIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export default function SliderOnly() {
  // UX za embed i forsiranje da linkovi idu u top
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyMargin = document.body.style.margin;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.margin = '0';

    // <base target="_top"> (dodaj samo ako smo u iframe-u i ako već ne postoji)
    let baseEl = null;
    if (inIframe() && !document.querySelector('base[data-embed-top]')) {
      baseEl = document.createElement('base');
      baseEl.setAttribute('target', '_top');
      baseEl.setAttribute('data-embed-top', '1');
      document.head.appendChild(baseEl);
    }

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.margin = prevBodyMargin;
      if (baseEl && baseEl.parentNode) baseEl.parentNode.removeChild(baseEl);
    };
  }, []);

  const { upcomingEvents = [], isLoading } = useGetUpcomingEvents();
  if (isLoading) return <CalendarSpinner />;

  return <PosterCarouselEmbed upcomingEvents={upcomingEvents} />;
}
