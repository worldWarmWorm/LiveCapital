import { inject, injectable } from 'inversify';
import { BaseController } from '../../../common/BaseController';
import { TYPES } from '../../../common/Types';
import { ILogger } from '../../../logger/ILogger';
import { IPageController } from './IPageController';
import 'reflect-metadata';

@injectable()
export class PageController extends BaseController implements IPageController {
	constructor(
		@inject(TYPES.ILogger)
		private loggerService: ILogger,
	) {
		super(loggerService);
	}

	title(): string {
		return 'Title';
	}
}
