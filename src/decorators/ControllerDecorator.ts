import 'reflect-metadata'
import { httpMethod } from './HttpMethod'
import { RequestParamHandler } from 'express'

export enum RequestMethod {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

export interface RouteDefinition {
    path: string
    requestMethod: RequestMethod
    methodName: string
    middlewares: Array<RequestParamHandler>
}

export function Controller(
    prefix: string = '/',
    middlewares?: Array<RequestParamHandler>
) {
    return function(target: any) {
        Reflect.defineMetadata('prefix', prefix, target)

        if (!Reflect.hasMetadata('routes', target)) {
            Reflect.defineMetadata('routes', [], target)
        }

        if (!Reflect.hasMetadata('middlewares', target)) {
            if (Array.isArray(middlewares) && middlewares.length)
                Reflect.defineMetadata('middlewares', middlewares, target)
            else Reflect.defineMetadata('middlewares', [], target)
        }
    }
}

export function Get(path: string, middlewares?: Array<RequestParamHandler>) {
    return httpMethod(RequestMethod.GET, path, middlewares)
}

export function Post(path: string, middlewares?: Array<RequestParamHandler>) {
    return httpMethod(RequestMethod.POST, path, middlewares)
}

export function Put(path: string, middlewares?: Array<RequestParamHandler>) {
    return httpMethod(RequestMethod.PUT, path, middlewares)
}

export function Delete(path: string, middlewares?: Array<RequestParamHandler>) {
    return httpMethod(RequestMethod.DELETE, path, middlewares)
}

export function Patch(path: string, middlewares?: Array<RequestParamHandler>) {
    return httpMethod(RequestMethod.PATCH, path, middlewares)
}
