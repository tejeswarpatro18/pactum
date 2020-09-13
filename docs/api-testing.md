# API Testing (REST)

API Testing in general can greatly improve the efficiency of our testing strategy helping us to deliver software faster than ever. It has many aspects but generally consists of making a request & validating the response. 

* It can be performed at different levels of software development life cycle.
* It can be performed independent of the language used to develop the application. (*java based applications API can be tested in other programming languages*)
* In market there are numerous tools available that allows us to test our APIs for different test types.

Instead of using different tools for each test type, **pactum** comes with all the popular features in a single bundle.

##### Why pactum?

* Extremely lightweight.
* Quick & easy to send requests & validate responses.
* Easy to chain multiple requests.
* Fully customizable Retry Mechanism.
* Out of the box Data Management.
* Works with any of the test runners like **mocha**, **cucumber**, **jest**.
* Ideal for *component testing*, *contract testing* & *e2e testing*.
* Ability to control the behavior of external services with a powerful mock server. (*learn more at [Component Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)*)

Lets get started with API Testing.

## Table of contents

* [Getting Started](#getting-started)
* [API](#api)
  * [Request Making](#request-making)
  * [Response Validation](#response-validation)
  * [Nested Dependent HTTP Calls](#nested-dependent-http-calls)
  * [Retry Mechanism](#retry-mechanism)
  * [Data Management](#data-management)


## Getting Started

To get started we need to have NodeJS (>=8) installed in our system.

```shell
# create a new folder (optional)
mkdir pactum-api-testing
cd pactum-api-testing

# initialize (optional)
npm init -y

# install pactum as a dev dependency
npm install --save-dev pactum

# install a test runner to run pactum tests
# mocha / jest / cucumber
npm install mocha -g

# Create a js file
touch http.test.js
```

Copy the below code

```javascript
const pactum = require('pactum');

it('should be a teapot', async () => {
  await pactum
    .get('http://httpbin.org/status/418')
    .expectStatus(418);
});
```

Running the test

```shell
# mocha is a test framework to execute test cases
mocha http.test.js
```

## API

Tests in **pactum** are clear and comprehensive. It uses numerous descriptive methods to build your requests and expectations.

Tests can be written in two styles

* Chaining the request & expectations
* Breaking the request & expectations (BDD Style)

#### Chaining

We can build the request & expectations by chaining the descriptive methods offered by this library.

```javascript
it('should have a user with name bolt', () => {
  return pactum
    .get('http://localhost:9393/api/users')
    .withQueryParam('name', 'bolt')
    .expectStatus(200)
    .expectJson({
      "id": 1,
      "name": "bolt",
      "createdAt": "2020-08-19T14:26:44.169Z"
    })
    .expectJsonSchema({
      type: 'object',
      properties: {
        id: {
          type: 'number'
        }
      }
    })
    .expectResponseTime(100);
});
```

#### Breaking

When you want to make your tests much more clearer, you can break your spec into multiple steps. This will come into handy when integrating **pactum** with **cucumber**.

Use `pactum.spec()` to get an instance of the spec. With **spec** you can build your request & expectations in multiple steps.

Once the request is built, perform the request by calling `.toss()` method and wait for the promise to resolve. 

**Assertions should be made after the request is performed & resolved**.

Assertions can be made either by using `pactum.expect` or `spec.response()`.

```javascript
const pactum = require('pactum');
const expect = pactum.expect;

describe('should have a user with name bolt', () => {

  let spec = pactum.spec();
  let response;

  it('given a user is requested', () => {
    spec.get('http://localhost:9393/api/users');
  });

  it('with name bolt', () => {
    spec.withQueryParam('name', 'bolt');
  });

  it('should return a response', async () => {
    response = await spec.toss();
  });

  it('should return a status 200', () => {
    expect(response).to.have.status(200);
  });

  it('should return a valid user', async () => {
    spec.response().to.have.jsonLike({ name: 'snow'});
  });

  it('should return a valid user schema', async () => {
    expect(response).to.have.jsonSchema({ type: 'object'});
  });

  it('should return response within 100 milliseconds', async () => {
    spec.response().to.have.responseTimeLessThan(100);
  });

});
```

### Request Making

The request method indicates the method to be performed on the resource identified by the given Request-URI.

```javascript
await pactum.get('http://httpbin.org/status/200');
await pactum.post('http://httpbin.org/status/200');
await pactum.put('http://httpbin.org/status/200');
await pactum.patch('http://httpbin.org/status/200');
await pactum.del('http://httpbin.org/status/200');
await pactum.head('http://httpbin.org/status/200');
```

To pass additional parameters to the request, we can chain or use the following methods individually to build our request.

| Method                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `withQueryParam`          | single query parameter                    |
| `withQueryParams`         | multiple query parameters                 |
| `withHeader`              | single request headers                    |
| `withHeaders`             | multiple request headers                  |
| `withBody`                | request body                              |
| `withJson`                | request json object                       |
| `withGraphQLQuery`        | graphQL query                             |
| `withGraphQLVariables`    | graphQL variables                         |
| `withForm`                | object to send as form data               |
| `withMultiPartFormData`   | object to send as multi part form data    |
| `withRequestTimeout`      | sets request timeout                      |
| `__setLogLevel`           | sets log level for troubleshooting        |

#### Query Params

Use `withQueryParam` or `withQueryParams` methods to pass query parameters to the request. We are allowed to call the `query-param` methods multiple times fo the same request.

```javascript
it('get random male user from India', async () => {
  await pactum
    .get('https://randomuser.me/api')
    .withQueryParam('gender', 'male')
    .withQueryParams({
      'country': 'IND'
    })
    .expectStatus(200);
});
```

#### Headers

Use `withHeader` or `withHeaders` methods to pass headers to the request. We are allowed to call the `header` methods multiple times fo the same request.

```javascript
it('get all comments', async () => {
  await pactum
    .get('https://jsonplaceholder.typicode.com/comments')
    .withHeader('Authorization', 'Basic abc')
    .withHeader('Accept', '*')
    .withHeaders({
      'Content-Type': 'application/json'
    })
    .expectStatus(200);
});
```

#### Body (JSON)

Use `withBody` or `withJson` methods to pass body to the request.

```javascript
it('post body', async () => {
  await pactum
    .post('https://jsonplaceholder.typicode.com/posts')
    .withBody('{ "title": "foo", "content": "bar"}')
    .expectStatus(201);
});
```

```javascript
it('post json object', async () => {
  await pactum
    .post('https://jsonplaceholder.typicode.com/posts')
    .withJson({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .expectStatus(201)
    .toss();
});
```

#### Form Data

Use `withForm` or `withMultiPartFormData` to pass form data to the request.

##### withForm

* Under the hood, pactum uses `phin.form`
* `content-type` header will be auto updated to `application/x-www-form-urlencoded`

```javascript 
it('post with form', async () => {
  await pactum
    .post('https://httpbin.org/forms/posts')
    .withForm({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .expectStatus(201)
    .toss();
});
```

##### withMultiPartFormData

* Under the hood it uses [form-data](https://www.npmjs.com/package/form-data)
* `content-type` header will be auto updated to `multipart/form-data`

```javascript
it('post with multipart form data', async () => {
  await pactum
    .post('https://httpbin.org/forms/posts')
    .withMultiPartFormData('file', fs.readFileSync('a.txt'), { contentType: 'application/js', filename: 'a.txt' })
    .expectStatus(201)
    .toss();
});
```

We can also directly use the form-data object.

```javascript
const form = new pactum.request.FormData();
form.append(/* form data */);
it('post with multipart form data', async () => {
  await pactum
    .post('https://httpbin.org/forms/posts')
    .withMultiPartFormData(form)
    .expectStatus(201)
    .toss();
});
```

#### GraphQL

Use `withGraphQLQuery` or `withGraphQLVariables` to pass form graphql data to the request. *Works for only POST requests.*

```javascript
it('post graphql query & variables', async () => {
  await pactum
    .post('https://jsonplaceholder.typicode.com/posts')
    .withGraphQLQuery(
      `
        query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }
      `
    )
    .withGraphQLVariables({
      "episode": "JEDI"
    })
    .expectStatus(201)
    .toss();
});
```

#### RequestTimeout

By default pactum request will timeout after 3000 ms. To increase the timeout for the current request use `withRequestTimeout` method. **Make Sure To Increase The Test Runners Timeout As Well**


```javascript
it('some action that will take more time to complete', async () => {
  // increase mocha timeout here
  await pactum
    .post('https://jsonplaceholder.typicode.com/posts')
    .withJson({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .withRequestTimeout(5000)
    .expectStatus(201)
    .toss();
});
```



### Response Validation

Expectations help to assert the response received from the server.

| Method                  | Description                             |
| ----------------------- | --------------------------------------- |
| `expect`                | runs custom expect handler              |
| `expectStatus`          | check HTTP status                       |
| `expectHeader`          | check HTTP header key + value           |
| `expectHeaderContains`  | check HTTP header key + partial value   |
| `expectBody`            | check exact match of body               |
| `expectBodyContains`    | check body contains the value           |
| `expectJson`            | check exact match of json               |
| `expectJsonLike`        | check loose match of json               |
| `expectJsonSchema`      | check json schema                       |
| `expectJsonQuery`       | check json using **json-query**         |
| `expectJsonQueryLike`   | check json like using **json-query**    |
| `expectResponseTime`    | check response time                     |

#### Status & Headers & Response Time

Expecting Status Code & Headers from the response.

```javascript
const expect = pactum.expect;

it('get post with id 1', async () => {
  const response = await pactum
    .get('https://jsonplaceholder.typicode.com/posts/1')
    .expectStatus(200)
    .expectHeader('content-type', 'application/json; charset=utf-8')
    .expectHeader('connection', /\w+/)
    .expectHeaderContains('content-type', 'application/json');

  expect(response).to.have.status(200);
  expect(response).to.have.header('connection', 'close');
});
```

##### expectResponseTime

Checks if the request is completed within a specified duration (ms).

#### JSON

Most REST APIs will return a JSON response. This library has few methods to validate a JSON response in many aspects.

##### expectJson

Performs deep equal.

```javascript
it('get post with id 1', async () => {
  const response = await pactum
    .get('https://jsonplaceholder.typicode.com/posts/1')
    .expectStatus(200)
    .expectJson({
      "userId": 1,
      "id": 1,
      "title": "some title",
      "body": "some body"
    });
});
```

##### expectJsonLike

Performs partial deep equal. 

* Allows Regular Expressions.
* Order of items in an array doesn't matter.

```javascript
it('posts should have a item with title -"some title"', async () => {
  const response = await pactum
    .get('https://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .expectJsonLike([
      {
        "userId": /\d+/,
        "title": "some title"
      }
    ]);
});
```

##### expectJsonQuery

Allows validation of specific part in a JSON. See [json-query](https://www.npmjs.com/package/json-query) for more usage details.

* Performs deep equal or strict equal.
* Order of items in an array matters.

```javascript
it('get people', async () => {
  const response = await pactum
    .get('https://some-api/people')
    .expectStatus(200)
    .expectJson({
      people: [
        { name: 'Matt', country: 'NZ' },
        { name: 'Pete', country: 'AU' },
        { name: 'Mike', country: 'NZ' }
      ]
    })
    .expectJsonQuery('people[country=NZ].name', 'Matt')
    .expectJsonQuery('people[*].name', ['Matt', 'Pete', 'Mike']);
});
```

##### expectJsonQueryLike

Allows validation of specific part in a JSON. See [json-query](https://www.npmjs.com/package/json-query) for more usage details.

* Performs partial deep equal.
* Order of items in an array doesn't matter.

```javascript
it('get people', async () => {
  const response = await pactum
    .get('https://some-api/people')
    .expectStatus(200)
    .expectJson({
      people: [
        { name: 'Matt', country: 'NZ' },
        { name: 'Pete', country: 'AU' },
        { name: 'Mike', country: 'NZ' }
      ]
    })
    .expectJsonQuery('people[*].name', ['Matt', 'Pete', 'Mike']);
    .expectJsonQueryLike('people[*].name', ['Mike', 'Matt']);
});
```

##### expectJsonSchema

Allows validation of schema of a JSON. See [json-schema](https://json-schema.org/learn/) for more usage details.

```javascript
it('get people', async () => {
  const response = await pactum
    .get('https://some-api/people')
    .expectStatus(200)
    .expectJson({
      people: [
        { name: 'Matt', country: 'NZ' },
        { name: 'Pete', country: 'AU' },
        { name: 'Mike', country: 'NZ' }
      ]
    })
    .expectJsonSchema({
      properties: {
        "people": "array"
      }
    });
});
```

#### Custom Expect Handlers

You can also add custom expect handlers to this library for making much more complicated assertions that are ideal to your requirement. You can bring your own assertion library or take advantage of popular libraries like [chai](https://www.npmjs.com/package/chai).

##### AdHoc

You can simply pass a function as a parameter to `expect` method & then write your own logic that performs assertions. A *context* object is passed to the handler function which contains *req* (request) & *res* (response) objects.

```javascript
const chai = require('chai');
const expect = chai.expect;

const pactum = require('pactum');
const _expect = pactum.expect;

it('post should have a item with title -"some title"', async () => {
  const response = await pactum
    .get('https://jsonplaceholder.typicode.com/posts/5')
    .expect((ctx) => {
      const res = ctx.res;
      _expect(res).to.have.status(200);
      expect(res.json.title).equals('some title');
    });
});
```

##### Common

There might be a use case you wanted to perform same set of assertions. For such scenarios, you can add custom expect handlers that you can use at different places. A *context* object is passed to the handler function which contains *req* (request) & *res* (response) objects & *data* (custom data).

```javascript
const chai = require('chai');
const expect = chai.expect;

const pactum = require('pactum');
const _expect = pactum.expect;
const handler = pactum.handler;

before(() => {
  handler.addExpectHandler('to have user details', (ctx) => {
    const res = ctx.res;
    const user = res.json;
    expect(user).deep.equals({ id: 1 });
    _expect(res).to.have.status(200);
    _expect(res).to.have.responseTimeLessThan(500);
    _expect(res).to.have.jsonSchema({ /* some schema */ });
  });
});

it('should have a post with id 5', async () => {
  const response = await pactum
    .get('https://jsonplaceholder.typicode.com/posts/5')
    .expect('to have user details');
});

it('should have a post with id 5', async () => {
  const response = await pactum
    .get('https://jsonplaceholder.typicode.com/posts/6')
    .expect('to have user details');
});
```

You are also allowed to pass custom data to common expect handlers.

```javascript
before(() => {
  handler.addExpectHandler('to have user details', (ctx) => {
    const res = ctx.res;
    const req = ctx.req;
    const data = ctx.data;
    /*
     Add custom logic to perform based on req (request) & data (custom data passed)
     */
  });
});

it('should have a post with id 5', async () => {
  const response = await pactum
    .get('https://jsonplaceholder.typicode.com/posts/5')
    .expect('to have user details', 5); // data = 5
});

it('should have a post with id 5', async () => {
  const response = await pactum
    .get('https://jsonplaceholder.typicode.com/posts/6')
    .expect('to have user details', { id: 6 }); // data = { id: 6 }
});
```

### Request Settings

This library also offers us to set default options for all the requests that are sent through it.

#### setBaseUrl

Sets the base URL for all the HTTP requests.

```javascript
const pactum = require('pactum');
const request = pactum.request;

before(() => {
  request.setBaseUrl('http://localhost:3000');
});

it('should have a post with id 5', async () => {
  // request will be sent to http://localhost:3000/api/projects
  await pactum
    .get('/api/projects');
});
```

#### setDefaultTimeout

Sets the default timeout for all the HTTP requests.
The default value is **3000 ms**

```javascript
pactum.request.setDefaultTimeout(5000);
```

#### setDefaultHeader

Sets default headers for all the HTTP requests.

```javascript
pactum.request.setDefaultHeader('Authorization', 'Basic xxxxx');
pactum.request.setDefaultHeader('content-type', 'application/json');
```

### Nested Dependent HTTP Calls

API testing is naturally asynchronous, which can make tests complex when these tests need to be chained. **Pactum** allows us to return custom data from the response that can be passed to next tests using [json-query](https://www.npmjs.com/package/json-query) or custom handler functions.

Use `returns` method to return custom response from the received JSON.

#### json-query

```javascript
const pactum = require('pactum');

it('should return all posts and first post should have comments', async () => {
  const postID = await pactum
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .returns('[0].id');
  await pactum
    .get(`http://jsonplaceholder.typicode.com/posts/${postID}/comments`)
    .expectStatus(200);
});
```

Use multiple `returns` methods to return array of custom response from the received JSON.

```javascript
const pactum = require('pactum');

it('first & second posts should have comments', async () => {
  const ids = await pactum
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .returns('[0].id')
    .returns('[1].id');
  await pactum
    .get(`http://jsonplaceholder.typicode.com/posts/${ids[0]}/comments`)
    .expectStatus(200);
  await pactum
    .get(`http://jsonplaceholder.typicode.com/posts/${ids[1]}/comments`)
    .expectStatus(200);
});
```

#### AdHoc Handler

We can also use a custom handler function to return data. A *context* object is passed to the handler function which contains *req* (request) & *res* (response) objects. 

```javascript
const pactum = require('pactum');

it('should return all posts and first post should have comments', async () => {
  const postID = await pactum
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .returns((ctx) => { return ctx.res.json[0].id });
  await pactum
    .get(`http://jsonplaceholder.typicode.com/posts/${postID}/comments`)
    .expectStatus(200);
});
```

#### Common Handler

We can also use a custom common handler function to return data & use it at different places.

```javascript
const pactum = require('pactum');
const handler = pactum.handler;

before(() => {
  handler.addReturnHandler('user id', (ctx) => {
    const res = ctx.res;
    return res.json[0].id;
  });
});

it('should return all posts and first post should have comments', async () => {
  const postID = await pactum
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .returns('user id');
  await pactum
    .get(`http://jsonplaceholder.typicode.com/posts/${postID}/comments`)
    .expectStatus(200);
});
```

**Note**: *While evaluating the string passed to the returns function, the library sees if there is handler function with the name. If not found it will execute the json-query.*

### Retry Mechanism

Not all APIs perform simple CRUD operations. Some operations take time & for such scenarios **pactum** allows us to add custom retry handlers that will wait for specific conditions to happen before attempting to make assertions on the response. (*Make sure to update test runners default timeout*) 

Use `retry` method to specify your retry strategy. It accepts options object as an argument. If the strategy function returns true, it will perform the request again.

##### retryOptions

| Property  | Type       | Description                                |
| --------- | ---------- | ------------------------------------------ |
| count     | `number`   | number of times to retry - defaults to 3   |
| delay     | `number`   | delay between retries - defaults to 1000ms |
| strategy  | `function` | retry strategy function - returns boolean  |
| strategy  | `string`   | retry strategy handler name                | 

#### AdHoc Handler

We can use a custom handler function to return a boolean. A *context* object is passed to the handler function which contains *req* (request) & *res* (response) objects. 


```javascript
await pactum
  .get('https://jsonplaceholder.typicode.com/posts/12')
  .retry({
    count: 2,
    delay: 2000,
    strategy: ({res}) => { return res.statusCode === 202 }
  })
  .expectStatus(200);
```

#### Common Handler

We can also use a custom common handler function to return data & use it at different places.

```javascript
const pactum = require('pactum');
const handler = pactum.handler;

before(() => {
  handler.addRetryHandler('on 404', (ctx) => {
    const res = ctx.res;
    if (res.statusCode === 404) {
      return true;
    } else {
      return false
    }
  });
});

it('should get posts', async () => {
  await pactum
    .get('http://jsonplaceholder.typicode.com/posts')
    .retry({
      strategy: 'on 404'
    })
    .expectStatus(200);
});
```

### Data Management

As the functionality of the application grows, the scope of the testing grows with it. At one point test data management becomes complex.

Lets say you have a numerous test cases around adding a new user to your system. To add a new user you post the following JSON to `/api/users` endpoint.

```json
{
  "FirstName": "Jon",
  "LastName": "Snow",
  "Age": 26,
  "House": "Castle Black"
}
```

Now lets assume, your application no longer accepts the above JSON. It needs a new field `Gender` in the JSON. It will be tedious to update all you existing test cases to add the new field.

```json
{
  "FirstName": "Jon",
  "LastName": "Snow",
  "Age": 26,
  "Gender": "male",
  "House": "Castle Black"
}
```


To solve this kind of problems, **pactum** comes with a concept of *Data Templates* & *Data Maps* to manage your test data. It helps us to re-use data across tests.

#### Data Template

A Data Template is a standard format for a particular resource. Once a template is defined, we can be use it across all the tests to perform a request.

Use `stash.loadDataTemplates` to add a data template. To use the template in the tests, use `@DATA:TEMPLATE@` as key & name of the template as value.

```javascript
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.loadDataTemplates({
    'User:New': {
      "FirstName": "Jon",
      "LastName": "Snow",
      "Age": 26,
      "Gender": "male",
      "House": "Castle Black"
    }
  })
});

it('adds a new user', async () => {
  await pactum
    .post('/api/users')
    .withJson({
      '@DATA:TEMPLATE@': 'User:New'
    })
    .expectStatus(200);
    /*
      The value of the template will be posted to /api/users
      {
        "FirstName": "Jon",
        "LastName": "Snow",
        "Age": 26,
        "Gender": "male",
        "House": "Castle Black"
      }
    */
});
```

The exact resource is not going to be used across every test. Every test might need specific values. This library supports overriding of specific values & extending the data template. This allows tests to be customized as much as you'd like when using templates.

```javascript
it('should not add a user with negative age', async () => {
  await pactum
    .post('/api/users')
    .withJson({
      '@DATA:TEMPLATE@': 'User:New',
      '@OVERRIDES@': {
        'Age': -1,
        'House': 'WinterFell'
      }
    })
    .expectStatus(400);
    /*
      The value of the template with overridden values will be posted to /api/users
      {
        "FirstName": "Jon",
        "LastName": "Snow",
        "Age": -1,
        "Gender": "male",
        "House": "WinterFell"
      }
    */
});
```

Templates can also reference other templates. *Be cautious not to create circular dependencies*

```javascript
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.loadDataTemplates({
    'User:New': {
      "FirstName": "Jon",
      "LastName": "Snow",
      "Age": 26,
      "Gender": "male",
      "House": "Castle Black"
    },
    'User:New:WithEmptyAddress': {
      '@DATA:TEMPLATE@': 'User:New',
      '@OVERRIDES@': {
        'Address': []
      }
    },
    'User:New:WithAddress': {
      '@DATA:TEMPLATE@': 'User:New',
      '@OVERRIDES@': {
        'Address': [
          {
            '@DATA:TEMPLATE@': 'Address:New'
          }
        ]
      }
    },
    'Address:New': {
      'Street': 'Kings Road',
      'Country': 'WestRos'
    }
  });
});

it('should add a user with address', async () => {
  await pactum
    .post('/api/users')
    .withJson({
      '@DATA:TEMPLATE@': 'User:WithAddress',
      '@OVERRIDES@': {
        'Age': 36,
        'Address': [
          {
            'Country': 'Beyond The Wall',
            'Zip': 524004
          }
        ]
      }
    })
    .expectStatus(400);
    /*
      The value of the template with overridden values will be posted to /api/users
      {
        "FirstName": "Jon",
        "LastName": "Snow",
        "Age": 36,
        "Gender": "male",
        "House": "WinterFell",
        "Address": [
          {
            'Street': 'Kings Road',
            'Country': 'Beyond The Wall',
            'Zip': 524004       
          }
        ]
      }
    */
});
```

#### Data Map

A Data Map is a collection of data that can be referenced in data templates or in your tests. Major difference between a data template & a data map is

* When a data template is used, current object will be replaced.
* When a data map is used, current objects value will be replaced.

Use `stash.loadDataMaps` to add a data map. To use the map in the tests or in the template, use `@DATA:MAP::<json-query>@` as the value.

```javascript
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.loadDataMaps({
    'User': {
      'FirstName': 'Jon',
      'LastName': 'Snow',
      'Country': 'North'
    }
  });
  stash.loadDataTemplates({
    'User:New': {
      "FirstName": "@DATA:MAP::User.FirstName@",
      "LastName": "@DATA:MAP::User.LastName@",
      "Age": 26,
      "Gender": "male",
      "House": "Castle Black"
    }
  });
});

/*
  The template `User:New` will be 
  {
    "FirstName": "Jon",
    "LastName": "Snow",
    "Age": 26,
    "Gender": "male",
    "House": "Castle Black"
  }
*/
```

It's perfectly legal to refer other data maps from a data map. *Be cautious not to create circular dependencies*

```javascript
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.loadDataMaps({
    'User': {
      'Default': {
        'FirstName': '@DATA:MAP::User.FirstNames[0]@',
        'LastName': '@DATA:MAP::User.LastNames[0]@',
        'Country': 'North'
      },
      'FirstNames': [ 'Jon', 'Ned', 'Ary' ],
      'LastNames': [ 'Stark', 'Sand', 'Snow' ]
    }
  });
});
```

## Next

----------------------------------------------------------------------------------------------------------------

<a href="https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing" >
  <img src="https://img.shields.io/badge/NEXT-Component%20Testing-blue" alt="Component Testing" align="right" style="display: inline;" />
</a>