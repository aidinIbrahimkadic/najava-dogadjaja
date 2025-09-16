import React, { useEffect } from 'react';
import { useGetUpcomingEvents } from '../features/front/useUpcomingEvents';
import CalendarSpinner from '../ui/CalendarSpinner';
import PosterCarouselEmbed from '../ui/Front/PosterCarouselEmbed';

// helper: jesmo li u iframu?
function inIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export default function SliderOnly() {
  // UI prilagodbe za embed
  useEffect(() => {
    // bez margina/scrolla u embedu
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyMargin = document.body.style.margin;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.margin = '0';

    // ako smo u iframu, forsiraj da svi <a> otvaraju parent (top)
    let baseEl = null;
    if (inIframe()) {
      baseEl = document.createElement('base');
      baseEl.setAttribute('target', '_top');
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

  return <PosterCarouselEmbed upcomingEvents={upcomingEvents || []} />;
}
