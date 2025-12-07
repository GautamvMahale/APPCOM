
import { useState, useCallback } from 'react';
import { ActivityEvent, ActivityType } from '@/types/activity';

export function useActivityActions(
  setEvents: React.Dispatch<React.SetStateAction<ActivityEvent[]>>,
  addEvent: (type: ActivityType, details?: string) => ActivityEvent
) {
  // Event handlers for real-time activity
  const handleAddEvent = useCallback((type: ActivityType, details?: string) => {
    const newEvent = addEvent(type, details);
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
  }, [addEvent, setEvents]);
  
  // For demo purposes - add a test event
  const addTestEvent = useCallback((type: ActivityType, details?: string) => {
    handleAddEvent(type, details);
  }, [handleAddEvent]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, [setEvents]);

  return { handleAddEvent, clearEvents, addTestEvent };
}
