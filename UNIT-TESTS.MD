# Unit tests

Unit tests for the front-end are written if deemed appropriate by the developer making a code change and/or the developer reviewing a code change. Code coverage is explicitely NOT deemed a useful metric for this project.

## Possible criteria for a unit of code that merits unit tests
- A unit of code that, when not properly implemented, could result in critical failures that are difficult to detect.
- A unit of code that's difficult to document without runnable examples.
- A unit of code that's specifically meant for widespread re-use.

## Criteria to keep in mind when writing unit tests
[based on this article](https://www.ponicode.com/shift-left/a-beginner-guide-to-understanding-unit-testing)
- **Independent**: unit tests should test an isolated unit of code. Mocks are only used if there is no feasable alternative.
- **Repeatable**: unit tests should be deterministic.
- **Readable**: when a test fails, it needs to be easy to identify the point of failure. 
- **Exhaustive**: unit tests should target an exhaustive range of scenarios.
- **Maintainable**: unit tests should not be tightly coupled to the implementation of the unit of code it is meant to test.

## Current candidates for unit tests
In order of priority:
- [ ] [`/src/services/service-data.ts`](/src/services/service-data.ts)
- [ ] [`/src/services/service-data-enricher.ts`](/src/services/service-data-enricher.ts)
- [ ] all other code directly or indirectly exported by [`/src/services/index.ts`](/src/services/index.ts)
- [ ] all code in [`/src/stores`](/src/stores)
- [ ] all code in [`/src/helpers`](/src/helpers)
- [ ] all code in [`/src/features/shared`](/src/features/shared)
- [ ] [`/src/nl-design-system/components/Pagination.vue`](/src/nl-design-system/components/Pagination.vue)
