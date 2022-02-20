import { Response, Router } from 'express';
import { injectable } from 'inversify';
import { ILogger } from '../logger/ILogger';
import { ExpressReturnType, IControllerRoute } from './interface/IControllerRoute';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	created(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			const method = route.method;
			const path = route.path;

			this.logger.log(`[${method}] ${path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const routeHandler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, routeHandler] : routeHandler;
			this.router[method](path, pipeline);
		}
	}
}
