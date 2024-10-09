import { Controller, Get, HttpStatus, Logger, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
dayjs.extend(utc);
dayjs.extend(timezone);

@Controller('healthcheck')
export class HealthCheckController {
    private readonly health: HealthCheckService;
    private readonly mongooseHealth: MongooseHealthIndicator;
    private readonly logger = new Logger();
    constructor(health: HealthCheckService, mongooseHealth: MongooseHealthIndicator) {
        this.health = health;
        this.mongooseHealth = mongooseHealth;
    }
  @Get()
  @ApiTags('health')
  @ApiOperation({ summary: 'Healthcheck', description: 'Chequeo de Estado Api', operationId: 'healthcheck' })
  async healthcheck(@Res() response: any): Promise<any> {
    this.logger.log(`[controller -  healthcheck ] Ok`);
    try {
      const { status } = await this.health.check([ () => this.mongooseHealth.pingCheck('mongodb') ]);
      return response.status(HttpStatus.OK).send({
          uptime: process.uptime(),
          date: dayjs().tz('America/Santiago').unix(),
          message: '[backend - (up)]',
          statusBD: status
      });
    } catch (error) {
      this.logger.error(`${error.response.error}`);
      return response.status(error.response.status).send({
        time: new Date().toISOString(),
        error: {
          code: error.response.status,
          message: 'Error en la peticion.'
        }
      });
    }
  }
}