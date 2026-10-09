// The only per-academy file of the Novo Dash kit. Filled from the Novo Dash app
// (clients / conversoes_tracking) and kept in sync by the standards robot.
//
// GB Rowlett = "Gracie Barra - Rowlett TX" (novodash-tools.clients). O `locationId` é o
// ghl_location_id da sub-account (público; a private key NUNCA entra aqui). Com ele e
// turmas ativas no GHL o modal agenda; sem turmas, fica o pré-cadastro. Em modo prospect
// nenhum webhook sai. `leadWebhookUuid`: o id do trigger "Inbound Webhook" do
// [ND] Primary Workflow; vazio = o build client PARA (lead sem webhook some em silêncio).
// Apelidos (programOverrides): só o nome que o visitante lê, iguais aos da página;
// o Webhook 1 leva sempre o nome real do calendário no GHL.
// Com `pixel`/`ga4`/`ads`/`clarity` vazios nenhum tracker é injetado no build.
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
    "locationId": "tSFdGfOzOGpfMR97gufl",
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
    "leadOnly": false,
    "programOverrides": {
      "SYRWWAObqgjo2BLOJ2Ho": {
        "label": "Little Champions 1 (Ages 4-6)"
      },
      "E2yDqwt5wfW5VYIGcU4W": {
        "label": "Little Champions 2 (Ages 7-9)"
      }
    },
    "retiredSlots": []
  }
}
