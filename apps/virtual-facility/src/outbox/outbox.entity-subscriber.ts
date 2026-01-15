import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { OutboxProcessor } from "./outbox.processor";
import { Outbox } from "./entities/outbox.entity";

@EventSubscriber()
export class OutboxEntitySubscriber implements EntitySubscriberInterface<Outbox> {
    constructor(
        datasource : DataSource,
        private readonly outboxProcessor: OutboxProcessor,
    ){
        datasource.subscribers.push(this);
    }

    listenTo(){
        return Outbox;
    }

    async afterInsert(event: InsertEvent<Outbox>){
        await this.outboxProcessor.dispatchWorkflowEvent(event.entity);
        await event.manager.delete(Outbox, event.entity.id);
    }
}