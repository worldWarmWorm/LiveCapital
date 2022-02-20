import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './App';
import { TYPES } from './common/Types';
import { ConfigService } from './config/ConfigService';
import { IConfigService } from './config/IConfigService';
import { IPageController } from './entity/page/controller/IPageController';
import { PageController } from './entity/page/controller/PageController';
import { ExceptionFilter } from './errors/ExceptionFilter';
import { IExceptionFilter } from './errors/IExceptionFilter';
import { ILogger } from './logger/ILogger';
import { LoggerService } from './logger/LoggerService';

export interface IBootstrap {
	container: Container;
	app: App;
}

export const binds: ContainerModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IPageController>(TYPES.PageController).to(PageController);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrap> {
	const container = new Container();
	container.load(binds);
	const app = container.get<App>(TYPES.Application);
	await app.init();
	return { container, app };
}

export const build: Promise<IBootstrap> = bootstrap();
