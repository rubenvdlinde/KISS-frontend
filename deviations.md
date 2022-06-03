# Deviations
This file describes any or all deviations that we have made on [VNG API standards](https://www.gemmaonline.nl/index.php/Ontwikkelagenda_API-standaarden) in order to get our solution to work.

## [Contactmomenten](https://contactmomenten-api.vng.cloud/api/v1/schema/#operation/klantcontactmoment_create)
- We expand the Contactmoment object with a "status" property in order to register the result of a conversation between the KCC employee and client. The value of this field is a string, possible options for this string can be regsiterd as "selectielijst".