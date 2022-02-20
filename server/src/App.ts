import express, { Express } from 'express';
import { Server } from 'http';
import { json } from 'body-parser';
import { inject, injectable } from 'inversify';
import { TYPES } from './common/Types';
import { ILogger } from './logger/ILogger';
import { IExceptionFilter } from './errors/IExceptionFilter';
import { PageController } from './entity/page/controller/PageController';
import { ConfigService } from './config/ConfigService';

@injectable()
export class App {
	app: Express;
	server: Server;
	protocol: string;
	host: string;
	port: string | number;

	constructor(
		@inject(TYPES.ILogger)
		private logger: ILogger,

		@inject(TYPES.PageController)
		private pageController: PageController,

		@inject(TYPES.ExceptionFilter)
		private exceptionFilter: IExceptionFilter,

		@inject(TYPES.ConfigService)
		private configService: ConfigService,
	) {
		this.app = express();
		this.protocol = process.env.PROTOCOL || 'http';
		this.host = process.env.HOST || 'localhost';
		this.port = process.env.PORT || process.env.PORT || 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/', this.pageController.router);
	}

	useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilter();

		/**
		 * @todo connection with DB
		 */

		this.server = this.app.listen(this.port);
		this.logger.log(`Server started at ${this.protocol}://${this.host}:${this.port}`);
	}

	close(): void {
		this.server.close();
	}
}
