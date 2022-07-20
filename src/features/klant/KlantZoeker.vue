<template>
  <p>klantzoeker...</p>

  <p>
    in het klant-zoek-component zoek je obv email of telnr via /api/klanten<br />
    (https://redocly.github.io/redoc/?nocors&url=https://kissdevelopment-dimpact.commonground.nu/openapi.json#tag/Klanten-collection/operation/Klant_getId).<br />
    als er niemand gevonden wordt een melding tonen. als er meerdere
    resultaten<br />
    zijn een lijst tonen als er 1 resultaat direct de details tonen. nog
    bepalen<br />
    hoe om te gaan met zeer groot aantal resultaten<br />

    van de resultaten tonen we : "voornaam": "string", "voorvoegselAchternaam":
    "string", "achternaam": "string", "telefoonnummer": "string", "emailadres":
    "example@hotmail.com" "klantnummer": "string",
  </p>
</template>
