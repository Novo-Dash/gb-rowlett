// The only per-academy file of the Novo Dash kit. Filled from the Novo Dash app
// (clients / conversoes_tracking) and kept in sync by the standards robot.
//
// GB Rowlett, modo PROSPECT: todo ID está vazio de propósito (PRD §0.10 e §20 #22).
// Com `leadWebhookUuid` vazio o webhook não dispara (o Booking avisa no console);
// com `pixel`/`ga4`/`ads`/`clarity` vazios nenhum tracker é injetado no build.
export default {
  "academy": {
    "name": "Gracie Barra Rowlett",
    "phone": "(945) 385-9359",
    "address": "3503 Rowlett Rd, Bldg K, Suite 302, Rowlett, TX 75088",
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=3503+Rowlett+Rd+Bldg+K+Suite+302%2C+Rowlett%2C+TX+75088",
    "logo": "/img/logo-160.webp",
    "photo": "/img/build-2-640.webp"
  },
  "ghl": {
    "locationId": "",
    "leadWebhookUuid": ""
  },
  "copy": {
    "eyebrow": "Founding Members",
    "panelTitle": "Join before we open.",
    "panelText": "Nothing is charged today. We hold your spot and confirm it with you before the doors open.",
    "formTitle": "Hold my spot",
    "formText": "",
    "submit": "Hold my spot",
    "doneTitle": "You're on the Founding list."
  },
  "source": "Landing Page - Founding Members",
  "tracking": {
    "pixel": "",
    "ga4": "",
    "ads": "",
    "adsLeadLabel": "",
    "adsBookedLabel": "",
    "clarity": ""
  },
  "booking": {
    "audience": null,
    "leadOnly": true,
    "programOverrides": {},
    "retiredSlots": []
  }
}
