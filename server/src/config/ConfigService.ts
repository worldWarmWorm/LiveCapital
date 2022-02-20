import { IConfigService } from './IConfigService';
import { DotenvParseOutput, DotenvConfigOutput, config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/Types';
import { ILogger } from '../logger/ILogger';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error("[ConfigService] File .env couldn't be read or is missing");
		} else {
			this.logger.log('[ConfigService] Configuration .env is uploaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
