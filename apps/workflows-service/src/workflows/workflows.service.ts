import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Workflow } from './entities/workflow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkflowDto, UpdateWorkflowDto } from '@app/workflows';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowsRepository: Repository<Workflow>,
  ){}
  async create(createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    const workflow = this.workflowsRepository.create({
      ...createWorkflowDto
    });
    const newWorkflow = await this.workflowsRepository.save(workflow);

    this.logger.debug(
      `Created workflow with id ${newWorkflow.id} for building ${newWorkflow.buildingId}`,
    )
    return newWorkflow;
  }

  async findAll(): Promise<Workflow[]> {
    return this.workflowsRepository.find();
  }

  async findOne(id: number): Promise<Workflow> {
    const workflow = await this.workflowsRepository.findOne({where: {id}});
    if(!workflow) throw new NotFoundException(`Workflow with id ${id} not found`);
    return workflow;
  }

  async update(id: number, updateWorkflowDto: UpdateWorkflowDto): Promise<Workflow> {
    const workflow = await this.workflowsRepository.preload({
      id:+id,
      ...updateWorkflowDto
    });
    if(!workflow) throw new NotFoundException(`Workflow with id ${id} not found`);
    return this.workflowsRepository.save(workflow);
  }

  async remove(id: number): Promise<Workflow> {
    const workflow = await this.findOne(id);
    return this.workflowsRepository.remove(workflow);
  }
}
