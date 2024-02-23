


export function triggerEvent(eventName, eventLabel, additionalInfo) {
    this.$gtag('event', eventName, { event_label: eventLabel, additional_info: JSON.stringify(additionalInfo)})
}