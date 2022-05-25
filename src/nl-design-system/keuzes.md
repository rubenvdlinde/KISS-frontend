# Overzicht nieuwsberichten
* Geen [List](https://nl-design-system.github.io/denhaag/?path=/docs/react-data-display-list--default-story):
    * Meer dan drie regels tekst, advies is om Card te gebruiken
* Geen [Card](https://nl-design-system.github.io/denhaag/?path=/docs/react-cards-card--default):
    * Implementatie is gekoppeld aan Material UI
    * Niet genoeg vrijheidsgraden voor semantiek: `<article>` en header is een `<p>` ipv een <h...>
* Paragraph: Alleen classes overgenomen, want maakt geen `<p>` maar een `<div>`


# Bevindingen
* In de typescript definitie van de vue wrappers utrecht, wordt `modelValue` als parameter vereist, Zelfs bij bijvoorbeeld headings. Dit is niet de bedoeling en zorgt voor errors in volar.
* Je moet los van de vue wrappers, de web componenten definieren. Hier is alleen een algemene functie voor, die alle componenten registreert. Dit levert een flinke bundel op. Beter zou zijn om per vue component eenmalig de bijbehorende web component te registreren.