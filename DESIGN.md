# DESIGN DESICION

## We write techincal documentation in english

## We use Commonground / API's
- We preffer to use API's that have been standardized by the [vng](https://vng.nl/nieuws/standaardisatieproces-voor-apis).
- We follow the [API agenda](https://www.gemmaonline.nl/index.php/Ontwikkelagenda_API-standaarden) to determine wich api's have been standardised.
- When we run into the limits of standardized api's we
  - Extend the objects/api's trough the use of EAV
  - We then test if our sollotoin works
  - If Our sollution works we open an issue on the VNG repro to request that our solutions is standardized
  - We log our solltion under [deviations](deviations.md).
- When no VNG API is applicable we 
  - Develop our own API
  - Base this on ISO standards
  - Contact the VNG to standardize our API

## We follow applicable design rules
And order these from international to local, we always apply (in this order)

- [W3C](https://www.w3.org) 
- [schema](https://schema.org/)
- [Standard for Public Code](https://standard.publiccode.net)
- [Forum Standaardisatie](https://www.forumstandaardisatie.nl/open-standaarden)
- [NL API Strategie](https://docs.geostandaarden.nl/api/API-Strategie/)
- [VNG GEMMA](https://vng.nl/projecten/gemeentelijke-model-architectuur-gemma)
- [De Common Ground principes](https://commonground.nl/cms/view/12f73f0d-ae26-4021-ba52-849eef37d11f/de-common-ground-principes)

## We use sprints as milestone's

## We hold our discions in seperate discusions (deepdives)

## We only use Elastich search in search components
For al other components we use the API's directly