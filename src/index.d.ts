import { BasicInteraction, MockInteraction, PactInteraction } from './exports/mock';
import * as Spec from './models/Spec';

export * as consumer from './exports/consumer';
export * as expect from './exports/expect';
export * as handler from './exports/handler';
export * as matchers from './exports/matcher';
export * as mock from './exports/mock';
export * as provider from './exports/provider';
export * as request from './exports/request';
export * as settings from './exports/settings';
export * as stash from './exports/stash';
export * as state from './exports/state';

/**
 * returns instance of spec
 */
export function spec(): Spec;

/**
 * runs the specified state handler
 * @example
 * await pactum
 *  .setState('there are users in the system')
 *  .get('/api/users')
 *  .expectStatus(200);
 */
export function setState(name: string, data?: any): Spec;

/**
 * adds a basic mock interaction to the server & auto removed after execution
 * @example
 * await pactum
 *  .useInteraction({
 *    get: '/api/address/4'
 *    return: {
 *      city: 'WinterFell'
 *    }
 *  })
 *  .get('/api/users/4')
 *  .expectStatus(200);
 */
export function useInteraction(interaction: BasicInteraction): Spec;

/**
 * adds a mock interaction to the server & auto removed after execution
 * @example
 * await pactum
 *  .useMockInteraction({
 *    withRequest: {
 *      method: 'GET',
 *      path: '/api/projects/1'
 *    },
 *    willRespondWith: {
 *      status: 200,
 *      body: {
 *        id: 1,
 *        name: 'fake'
 *      }
 *    }
 *  })
 *  .get('http://localhost:9393/projects/1')
 *  .expectStatus(200);
 */
export function useMockInteraction(interaction: MockInteraction): Spec;

/** 
 * adds a pact interaction to the server & auto removed after execution
 * @example
 * await pactum
 *  .usePactInteraction({
 *    provider: 'project-provider',
 *    state: 'when there is a project with id 1',
 *    uponReceiving: 'a request for project 1',
 *    withRequest: {
 *      method: 'GET',
 *      path: '/api/projects/1'
 *    },
 *    willRespondWith: {
 *      status: 200,
 *      body: {
 *        id: 1,
 *        name: 'fake'
 *      }
 *    }
 *  })
 *  .get('http://localhost:9393/projects/1')
 *  .expectStatus(200);
 */
export function usePactInteraction(interaction: PactInteraction): Spec;

/**
 * The GET method requests a representation of the specified resource.
 * @example
 * await pactum
 *  .get('https://jsonplaceholder.typicode.com/posts')
 *  .withQueryParam('postId', 1)
 *  .expectStatus(200)
 *  .expectJsonLike({
 *    userId: 1,
 *    id: 1
 *   });
 */
export function get(url: string): Spec;

/**
 * The HEAD method asks for a response identical to that of a GET request, but without the response body.
 */
export function head(url: string): Spec;

/**
 * The PATCH method is used to apply partial modifications to a resource.
 * @example
 * await pactum
 *  .patch('https://jsonplaceholder.typicode.com/posts/1')
 *  .withJson({
 *    title: 'foo'
 *  })
 *  .expectStatus(200);
 */
export function patch(url: string): Spec;

/**
 * The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
 * @example
 * await pactum
 *  .post('https://jsonplaceholder.typicode.com/posts')
 *  .withJson({
 *    title: 'foo',
 *    body: 'bar',
 *    userId: 1
 *  })
 *  .expectStatus(201);
 */
export function post(url: string): Spec;

/**
 * The PUT method replaces all current representations of the target resource with the request payload.
 * @example
 * await pactum
 *  .put('https://jsonplaceholder.typicode.com/posts/1')
 *  .withJson({
 *    id: 1,
 *    title: 'foo',
 *    body: 'bar',
 *    userId: 1
 *  })
 *  .expectStatus(200);
 */
export function put(url: string): Spec;

/**
 * The DELETE method deletes the specified resource.
 * @example
 * await pactum
 *  .del('https://jsonplaceholder.typicode.com/posts/1')
 *  .expectStatus(200);
 */
export function del(url: string): Spec;

export namespace pactum { }