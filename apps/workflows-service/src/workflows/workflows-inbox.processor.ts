import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InboxService } from "../inbox/inbox.service";
import { EntityManager } from "typeorm";
import { Inbox } from "../inbox/entities/inbox.entity";
import { Workflow } from "./entities/workflow.entity";

@Injectable()
export class WorkflowsInboxProcessor {
    private readonly logger = new Logger(WorkflowsInboxProcessor.name);
    constructor(
        private readonly inboxService: InboxService,
    ){}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async processInboxMessages(){
        this.logger.debug(`processing workflows inbox messages`);

        await this.inboxService.processInboxMessages(
            async (messages, manager) => {
                return Promise.all(
                    messages.map((message) => {
                        if(message.pattern === 'workflows.create'){
                            return this.createWorkflow(message, manager);
                        }
                    })
                );
            },
            {
                take: 100,
            },
        );
    };
    
async createWorkflow(message: Inbox , manager : EntityManager){
    const workflowsRepository = manager.getRepository(Workflow);

    const workflow = workflowsRepository.create({
        ...message.payload,
    });
    const newWorkflowEntity = await workflowsRepository.save([workflow]);
    this.logger.debug(
        `Created workflow with id ${newWorkflowEntity[0].id} for building ${newWorkflowEntity[0].buildingId}`,
    );

    await manager.update(Inbox , message.id , {
        status: 'processed',
    });
}
}