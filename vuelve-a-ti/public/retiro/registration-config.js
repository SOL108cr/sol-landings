/* Candidate wiring only. Production remains disabled until purchase/access E2E and consent review pass. */
window.vuelveRegistration = {
  "captureEnabled": false,
  "verificationEnabled": false,
  "candidateMode": true,
  "captureTransport": "native-mailerlite-form-post-json",
  "acknowledgement": "native-provider-success-callback; CRM-readback-verified-20261008",
  "dedupe": {
    "clientGuard": "in-memory-submit-lock",
    "serverKey": "MailerLite email identity; workflow repeatable=false (verified 20261008)",
    "persistedClientIdentifiers": false
  },
  "mailerLiteFormId": "200719946770024283",
  "mailerLiteGroupId": "200719888683108206",
  "mailerLiteAccountId": "2197783",
  "courseId": "a4167109",
  "welcomeLessonId": "md8f4caeaba31f4b01ba6314a67a79f7f4",
  "hotmartProductId": "8684987",
  "support": {
    "whatsappE164": "+56983108065",
    "whatsappUrl": "https://wa.me/56983108065"
  },
  "localConfirmationPath": "confirmacion-inscripcion.html",
  "courseUrl": "https://www.skool.com/portal-origen-5852/classroom/a4167109",
  "destinations": {
    "pass": "https://pay.hotmart.com/O107941218B?off=qnyxi8fw",
    "premium": null,
    "premiumAbout": "https://www.skool.com/portal-origen-5852/about",
    "standard": null,
    "member": "https://www.skool.com/portal-origen-5852/classroom/a4167109"
  },
  "standardRequiresManualVerification": true,
  "redirectPolicy": "never-auto-redirect",
  "nativeFormShareUrl": "https://preview.mailerlite.io/forms/2197783/200719946770024283/share"
};
