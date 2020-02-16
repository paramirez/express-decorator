import { Router, Response, Request, NextFunction } from 'express'

export interface IMakeError {
    status?: number
    message: string
    extra?: any
}

export function MakeBadRequest(message: string, data?: any) {
    return MakeError({ status: 400, message, extra: data })
}

export function MakeError(error: IMakeError) {
    error.status === error.status ? error.status : 500
    error.extra = error.extra ? error.extra : {}
    return error
}

export function ErrorMiddleware(
    error: IMakeError,
    request: Request,
    response: Response,
    next: NextFunction
) {
    response.status(error.status ? error.status : 500).json({
        message: error.message,
        ...error.extra,
    })
}

import { RequestParamHandler } from 'express'
import { RouteDefinition } from './ControllerDecorator'

// Iterate over all our controllers and register our routes
export function defineRoutes(router: Router, Controllers: any[]) {
    const generalRoutes = []

    Controllers.forEach(controller => {
        const instance = new controller()
        const prefix = Reflect.getMetadata('prefix', controller)
        const routes: Array<RouteDefinition> = Reflect.getMetadata(
            'routes',
            controller
        )
        const middlewares: Array<RequestParamHandler> = Reflect.getMetadata(
            'middlewares',
            controller
        )
        const generalRoute = {
            name: instance.constructor.name.split('Controller')[0],
            path: prefix,
            routes: routes.map(route => {
                return {
                    method: route.requestMethod.toUpperCase(),
                    path: route.path,
                }
            }),
        }
        generalRoutes.push(generalRoute)
        routes.forEach(route => {
            if (
                (Array.isArray(route.middlewares) &&
                    route.middlewares.length) ||
                middlewares.length
            ) {
                const applyMiddlewares = []
                    .concat(middlewares)
                    .concat(route.middlewares ? route.middlewares : [])
                router[route.requestMethod.toLowerCase()](
                    prefix + route.path,
                    ...applyMiddlewares,
                    (req: Request, res: Response, next: NextFunction) => {
                        instance[route.methodName](req, res, next)
                    }
                )
            } else {
                router[route.requestMethod.toLowerCase()](
                    prefix + route.path,
                    (req: Request, res: Response, next: NextFunction) => {
                        instance[route.methodName](req, res, next)
                    }
                )
            }
        })
    })

    router.get(
        '/',
        (request: Request, response: Response, next: NextFunction) => {
            response.json({ modules: generalRoutes })
        }
    )

    router.use(ErrorMiddleware)
}
