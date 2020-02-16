import { RouteDefinition, RequestMethod } from './ControllerDecorator'
import { RequestParamHandler } from 'express'

export function httpMethod(
    requestMethod: RequestMethod,
    path: string,
    middlewares?: Array<RequestParamHandler>
) {
    return function(target, propertyKey: string): void {
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor)
        }
        const routes = Reflect.getMetadata(
            'routes',
            target.constructor
        ) as Array<RouteDefinition>
        routes.push({
            requestMethod,
            path,
            middlewares:
                Array.isArray(middlewares) && middlewares.length
                    ? middlewares
                    : [],
            methodName: propertyKey,
        })
        Reflect.defineMetadata('routes', routes, target.constructor)
    }
}
