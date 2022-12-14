# Unit tests

Unit tests for the front-end are written if deemed appropriate by the developer making a code change and/or the developer reviewing a code change. Code coverage is explicitely NOT deemed a useful metric for this project.

## Possible criteria for a unit of code that merits unit tests
- A unit of code that, when not properly implemented, could result in critical failures that are difficult to detect.
- A unit of code that's difficult to reason about without runnable examples.
- A unit of code that's specifically meant for widespread re-use.

## Criteria to keep in mind when writing unit tests
[based on this article](https://www.ponicode.com/shift-left/a-beginner-guide-to-understanding-unit-testing)
- **Independent**: unit tests should test an isolated unit of code. Mocks should only be used if there is no feasable alternative.
- **Repeatable**: unit tests should be deterministic.
- **Readable**: when a test fails, it needs to be easy to identify the point of failure. 
- **Exhaustive**: unit tests should target an exhaustive range of scenarios.
- **Maintainable**: unit tests should NOT be tightly coupled to the implementation of the unit of code it is meant to test.

## Current candidates for unit tests
In order of priority:
- [ ] [`/src/services/service-data.ts`](/src/services/service-data.ts)
  - [ ] `ServiceResult.fromPromise`: test if the correct result type is returned for a pending, a resolved and an rejected Promise.
  - [ ] `ServiceResult.fromSubmitter`: test if the starting state is init, test for the three stages of a Promise on the submit function, test if the state goes back to init after the reset function is called.
  - [ ] `ServiceResult.fromFetcher`: Test for the three stages of a Promise on the fetcher, test if the unique id is preferred over the url, test for the loading boolean: does it initialize as false if there's a value in the cache? Does it switch to true if the uniqueId changes?
- [ ] [`/src/services/service-data-enricher.ts`](/src/services/service-data-enricher.ts): test with two sample enrichers, for the following scenarios:
  - [ ] start with an object of type `Left`, NOT having the necessary key to retrieve data of type `Right`
  - [ ] start with an object of type `Right`, NOT having the necessary key to retrieve data of type `Left`
  - [ ] start with an object of type `Left`, having the necessary key to retrieve data of type `Right`. The enricher returns a resolved promise
  - [ ] start with an object of type `Left`, having the necessary key to retrieve data of type `Right`. The enricher returns a forever pending promise
  - [ ] start with an object of type `Left`, having the necessary key to retrieve data of type `Right`. The enricher returns a rejected promise
  - [ ] start with an object of type `Right`, having the necessary key to retrieve data of type `Left`. The enricher returns a resolved promise
  - [ ] start with an object of type `Right`, having the necessary key to retrieve data of type `Left`. The enricher returns a forever pending promise
  - [ ] start with an object of type `Right`, having the necessary key to retrieve data of type `Left`. The enricher returns a rejected promise
- [ ] all other code directly or indirectly exported by [`/src/services/index.ts`](/src/services/index.ts)
- [ ] all code in [`/src/stores`](/src/stores)
- [ ] all code in [`/src/helpers`](/src/helpers)
- [ ] all code in [`/src/features/shared`](/src/features/shared)
- [ ] [`/src/nl-design-system/components/Pagination.vue`](/src/nl-design-system/components/Pagination.vue)
