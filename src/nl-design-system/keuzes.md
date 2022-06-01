# Overzicht nieuwsberichten
* Geen [List](https://nl-design-system.github.io/denhaag/?path=/docs/react-data-display-list--default-story):
    * Meer dan drie regels tekst, advies is om Card te gebruiken
* Geen [Card](https://nl-design-system.github.io/denhaag/?path=/docs/react-cards-card--default):
    * Implementatie is gekoppeld aan Material UI
    * Niet genoeg vrijheidsgraden voor semantiek: `<article>` en header is een `<p>` ipv een <h...>
* Paragraph: Alleen classes overgenomen, want maakt geen `<p>` maar een `<div>`

# contactmoment registratieformulier
* issue: we maken gebruik van de utrecht-button webcomponent. de shadowdom is niet rechstreeks te stylen en het component biedt geen hook om de cursor aan te passen. daardoor kan er niet de voor buttons gebruikelijke pointer cursor ingesteld worden.
* de .utrecht-select overruled het standaard uitklap pijltje van een html select element. het standaarduiterlijk van een select verschilt nogal per OS. Gaat dit op elk OS goed? 