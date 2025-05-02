// Simple Event Emitter for application-wide events
// Provides publish-subscribe pattern functionality

type EventCallback = (data: any) => void;

/**
 * Simple event emitter implementation for internal application events
 */
export class EventEmitter {
  private events: Record<string, EventCallback[]> = {};

  /**
   * Subscribe to an event
   * @param eventName The name of the event to subscribe to
   * @param callback The callback function to execute when the event is emitted
   * @returns A function to unsubscribe from the event
   */
  subscribe(eventName: string, callback: EventCallback): () => void {
    // Initialize the event array if it doesn't exist
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    // Add the callback to the event listeners
    this.events[eventName].push(callback);
    
    // Return an unsubscribe function
    return () => {
      this.events[eventName] = this.events[eventName].filter(
        (cb) => cb !== callback
      );
    };
  }

  /**
   * Emit an event with data
   * @param eventName The name of the event to emit
   * @param data The data to pass to the event callbacks
   */
  emit(eventName: string, data?: any): void {
    // If there are no subscribers, do nothing
    if (!this.events[eventName]) {
      return;
    }
    
    // Call each subscriber with the data
    this.events[eventName].forEach((callback) => {
      callback(data);
    });
  }

  /**
   * Remove all event listeners for a specific event
   * @param eventName The name of the event to clear
   */
  clearEvent(eventName: string): void {
    delete this.events[eventName];
  }

  /**
   * Remove all event listeners
   */
  clearAllEvents(): void {
    this.events = {};
  }
  
  /**
   * Get the number of subscribers for a specific event
   * @param eventName The name of the event
   * @returns The number of subscribers
   */
  getSubscriberCount(eventName: string): number {
    return this.events[eventName]?.length || 0;
  }
}

// Export a singleton instance for application-wide events
export const globalEventEmitter = new EventEmitter();

// Default export for class usage
export default EventEmitter; 