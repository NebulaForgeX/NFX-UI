import type { EventNamesOf } from "@/events/EventEmitter";

import { defineEvents, EventEmitter } from "@/events/EventEmitter";
import { singleton } from "@/utils/singleton";

export const queryEvents = defineEvents({
  RESET_ACTIVE_QUERIES: "QUERY:RESET_ACTIVE_QUERIES",
});

type QueryDomainEvent = EventNamesOf<typeof queryEvents>;

class QueryDomainEmitter extends EventEmitter<QueryDomainEvent> {
  constructor() {
    super(queryEvents);
  }

  resetActiveQueries(onDone?: () => void) {
    this.emit(queryEvents.RESET_ACTIVE_QUERIES, onDone);
  }
}

export const queryEventEmitter = new (singleton(QueryDomainEmitter))();
