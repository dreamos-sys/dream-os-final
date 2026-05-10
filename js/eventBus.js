class EventBus {
  constructor() {
    this.subscribers = new Map();
  }
  subscribe(event, callback, moduleId) {
    if (!this.subscribers.has(event)) this.subscribers.set(event, new Map());
    this.subscribers.get(event).set(moduleId || 'anonymous', callback);
    return () => this.unsubscribe(event, moduleId);
  }
  unsubscribe(event, moduleId) {
    const eventMap = this.subscribers.get(event);
    if (eventMap) eventMap.delete(moduleId);
  }
  emit(event, data) {
    const eventMap = this.subscribers.get(event);
    if (eventMap) {
      eventMap.forEach(cb => cb(data));
    }
  }
}
// Singleton
window.DreamEventBus = new EventBus();
