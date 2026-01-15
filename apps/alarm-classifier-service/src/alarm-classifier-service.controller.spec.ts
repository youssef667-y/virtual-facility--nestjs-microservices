import { Test, TestingModule } from '@nestjs/testing';
import { AlarmClassifierServiceController } from './alarm-classifier-service.controller';
import { AlarmClassifierServiceService } from './alarm-classifier-service.service';

describe('AlarmClassifierServiceController', () => {
  let alarmClassifierServiceController: AlarmClassifierServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AlarmClassifierServiceController],
      providers: [AlarmClassifierServiceService],
    }).compile();

    alarmClassifierServiceController = app.get<AlarmClassifierServiceController>(AlarmClassifierServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(alarmClassifierServiceController.getHello()).toBe('Hello World!');
    });
  });
});
