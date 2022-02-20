import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/ILogger';
import { TYPES } from '../common/Types';
import { HttpError } from './HttpError';
import { IExceptionFilter } from './IExceptionFilter';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		const msg = err.message;

		if (err instanceof HttpError) {
			const code = err.statusCode;
			this.logger.error(`[${err.context}] Error ${code}: ${msg}`);
			res.status(code).send({ err: msg });
		} else {
			this.logger.error(`Error: ${msg}`);
			res.status(500).send({ err: msg });
		}
	}
}
