import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy, RmqRecord } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WORKFLOWS_SERVICE } from "../constants";
import { Outbox } from "./entities/outbox.entity";
import { OutboxService } from "./outbox.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { lastValueFrom } from "rxjs";

@Injectable()
export class OutboxProcessor {
    private readonly logger = new Logger(OutboxProcessor.name);

    constructor(
        private readonly outboxService: OutboxService,
        @Inject(WORKFLOWS_SERVICE)
        private readonly workflowsService: ClientProxy,
        @InjectRepository(Outbox)
        private readonly outboxRepository: Repository<Outbox>,
    ){}


    @Cron(CronExpression.EVERY_10_SECONDS)
    async processOutboxMessages(){
        this.logger.debug(`processing outbox messages`);

        const target = String(WORKFLOWS_SERVICE.description);
        const messages = await this.outboxService.getUnprocessedMessages({
            target,
            take: 100,
        });

        await Promise.all(
            messages.map(async (message) => {
                await this.dispatchWorkflowEvent(message);
                await this.outboxRepository.delete(message.id);
            }
        )
    );
    }

    async dispatchWorkflowEvent(outbox: Outbox){
        if(outbox.id == null ) throw new Error('Outbox id is missing');
        const rmqRecord = new RmqRecord(outbox.payload, {
            messageId: String(outbox.id),
        });
        await lastValueFrom(this.workflowsService.emit(outbox.type , rmqRecord));
    }
}