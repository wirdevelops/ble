import { useAnalytics } from '@/context/AppContext';

// Event types
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  SEARCH: 'search',
  BOOKMARK: 'bookmark',
  NOTIFICATION_CLICK: 'notification_click',
  PROFILE_VIEW: 'profile_view',
  EVENT_VIEW: 'event_view',
  EVENT_RSVP: 'event_rsvp',
  TALENT_CONTACT: 'talent_contact',
  MESSAGE_SEND: 'message_send',
  BOOKING_REQUEST: 'booking_request',
} as const;

// Analytics tracking functions
export function trackPageView(pageName: string) {
  const { logEvent } = useAnalytics();
  logEvent(ANALYTICS_EVENTS.PAGE_VIEW, { pageName });
}

export function trackSearch(query: string, filters?: Record<string, any>) {
  const { logEvent } = useAnalytics();
  logEvent(ANALYTICS_EVENTS.SEARCH, { query, filters });
}

export function trackBookmark(itemId: string, itemType: string, action: 'add' | 'remove') {
  const { logEvent } = useAnalytics();
  logEvent(ANALYTICS_EVENTS.BOOKMARK, { itemId, itemType, action });
}

export function trackNotificationClick(notificationId: string, notificationType: string) {
  const { logEvent } = useAnalytics();
  logEvent(ANALYTICS_EVENTS.NOTIFICATION_CLICK, { notificationId, notificationType });
}

export function trackProfileView(profileId: string, profileType: string) {
  const { logEvent } = useAnalytics();
  logEvent(ANALYTICS_EVENTS.PROFILE_VIEW, { profileId, profileType });
}

export function trackEventView(eventId: string, eventType: string) {
  const { logEvent } = useAnalytics();
  logEvent(ANALYTICS_EVENTS.EVENT_VIEW, { eventId, eventType });
}

export function trackEventRSVP(eventId: string, response: 'yes' | 'no' | 'maybe') {
  const { logEvent } = useAnalytics();
  logEvent(ANALYTICS_EVENTS.EVENT_RSVP, { eventId, response });
}

export function trackTalentContact(talentId: string, contactMethod: string) {
  const { logEvent } = useAnalytics();
  logEvent(ANALYTICS_EVENTS.TALENT_CONTACT, { talentId, contactMethod });
}

export function trackMessageSend(recipientId: string, messageType: string) {
  const { logEvent } = useAnalytics();
  logEvent(ANALYTICS_EVENTS.MESSAGE_SEND, { recipientId, messageType });
}

export function trackBookingRequest(talentId: string, serviceType: string) {
  const { logEvent } = useAnalytics();
  logEvent(ANALYTICS_EVENTS.BOOKING_REQUEST, { talentId, serviceType });
}
