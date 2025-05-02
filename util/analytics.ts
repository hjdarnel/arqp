import ReactGA from 'react-ga4';

const useAnalyticsEventTracker = (category = 'engagement') => {
  const eventTracker = (
    action = 'search',
    label = 'search_term',
    value?: number,
  ) => {
    ReactGA.event({ category, action, label, value });
  };
  return eventTracker;
};

export default useAnalyticsEventTracker;
