**Unit tests for the front-end are written if deemed appropriate by the developer making a code change and/or the developer reviewing a code change. Possible criteria for code that merits unit tests are:**
- Code that's difficult to document without working examples
- Code that's specifically meant for broad re-use. In this case the possibility of extracting this code into a seperate package should also be taken into account.
- If and when code is in deed seperated into a package, unit tests for this code are mandatory.

**Current candidates for unit tests are:**
- [ ] all code in [`/src/services`](/src/services)
- [ ] all code in [`/src/stores`](/src/stores)
- [ ] all code in [`/src/helpers`](/src/helpers)
- [ ] all code in [`/src/features/shared`](/src/features/shared)
- [ ] [`/src/nl-design-system/components/Pagination.vue`](/src/nl-design-system/components/Pagination.vue)
