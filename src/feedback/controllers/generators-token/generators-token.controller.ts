import { Controller, Get, HttpStatus, Logger, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeneratorsTokenService } from '../../../feedback/services/generators-token/generators-token.service';
@ApiTags('GeneratorsToken')
@Controller('generators-token')
export class GeneratorsTokenController {
    private readonly logger = new Logger();
    private readonly generateTokenService: GeneratorsTokenService;
    constructor(_generateTokenService: GeneratorsTokenService) {
      this.generateTokenService = _generateTokenService;
    }
    @Get()
    @ApiOperation({ summary: 'get token jwt', description: 'Permite la generacion de token aleatorio', operationId: 'getGenerateToken' })  
    async getGenerateToken(@Res() response: any) {
      try {
        this.logger.log(`[controller - getGenerateToken ] OK`);
        const responseToken = await this.generateTokenService.GeneratorsTokenService();
        return response.status(HttpStatus.OK).send({payload: responseToken});
      } catch(error) {
      this.logger.error(`[controller - getGenerateToken ] Error ${JSON.stringify(error)}`);
      return response.status(500).send({
        code: error.code,
        error: {
          message: error.message
        }
      });
    }
    }
}
