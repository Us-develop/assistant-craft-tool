import type { Lang } from "./wizardSchema";

type TranslationMap = Record<string, Record<Lang, string>>;

const t: TranslationMap = {
  "app.title": { nl: "Assistant Craft Tool", en: "Assistant Craft Tool" },
  "header.tagline": { nl: "Co-creating digital impact", en: "Co-creating digital impact" },

  "progress.stepOf": { nl: "Stap {n} van {total}", en: "Step {n} of {total}" },

  "nav.next": { nl: "Volgende", en: "Next" },
  "nav.back": { nl: "Terug", en: "Back" },
  "nav.finish": { nl: "Genereer instructie", en: "Generate instruction" },
  "nav.startOver": { nl: "Opnieuw beginnen", en: "Start over" },
  "nav.edit": { nl: "Bewerken", en: "Edit" },
  "nav.copy": { nl: "Kopieer", en: "Copy" },
  "nav.copied": { nl: "Gekopieerd!", en: "Copied!" },
  "nav.saving": { nl: "Opslaan…", en: "Saving…" },

  "save.success": { nl: "Je inzending is opgeslagen.", en: "Your entry has been saved." },
  "save.failed": { nl: "Kon niet opslaan — probeer opnieuw.", en: "Could not save — please try again." },
  "save.notSubmittable": {
    nl: "Vul minimaal een domein, functietitel of assistent-naam in.",
    en: "Please fill at least a domain, job title or assistant name.",
  },

  "step1.title": { nl: "Domein", en: "Domain" },
  "step2.title": { nl: "Rol & expertise", en: "Role & expertise" },
  "step3.title": { nl: "Kernovertuiging", en: "Core conviction" },
  "step4.title": { nl: "Toon & stijl", en: "Tone & style" },
  "step5.title": { nl: "Context", en: "Context" },
  "step6.title": { nl: "Kwaliteitsfilter", en: "Quality filter" },
  "step7.title": { nl: "Regels & scope", en: "Rules & scope" },
  "step8.title": { nl: "Output & identiteit", en: "Output & identity" },

  "step1.subtitle": {
    nl: "Kies het domein waarin je AI-assistent specialist wordt.",
    en: "Choose the domain your AI assistant will specialize in.",
  },
  "step1.domains.email": { nl: "Email & CRM", en: "Email & CRM" },
  "step1.domains.social": { nl: "Social media", en: "Social media" },
  "step1.domains.paid": { nl: "Paid advertising", en: "Paid advertising" },
  "step1.domains.content": { nl: "Content & SEO", en: "Content & SEO" },
  "step1.domains.brand": { nl: "Brand & strategy", en: "Brand & strategy" },
  "step1.domains.conversion": { nl: "Conversion copy", en: "Conversion copy" },
  "step1.customLabel": { nl: "Of typ een eigen subdomein", en: "Or type a custom subdomain" },
  "step1.customPlaceholder": {
    nl: "Bijv. 'e-commerce productbeschrijvingen'",
    en: "E.g. 'e-commerce product descriptions'",
  },
  "step1.uploadTitle": {
    nl: "Referentiedocumenten (optioneel)",
    en: "Reference documents (optional)",
  },
  "step1.uploadHint": {
    nl: "Upload bv. een brandbook, contentstrategie of tone-of-voice document. PDF, TXT of Markdown — max. 4 MB per bestand. De tekst wordt gebruikt in je systeemprompt en door de AI-suggesties.",
    en: "Upload e.g. a brand book, content strategy, or tone-of-voice doc. PDF, TXT, or Markdown — max 4 MB per file. Text is included in your system prompt and powers AI suggestions.",
  },
  "step1.uploadButton": {
    nl: "Bestanden kiezen",
    en: "Choose files",
  },
  "step1.uploadChars": { nl: "tekens", en: "chars" },
  "step1.uploadRemove": { nl: "Verwijderen", en: "Remove" },
  "step1.uploadErrorMaxFiles": {
    nl: "Maximaal {n} bestanden.",
    en: "At most {n} files.",
  },
  "step1.uploadErrorGeneric": {
    nl: "Upload mislukt. Probeer een ander bestand.",
    en: "Upload failed. Try another file.",
  },
  "step1.uploadErrorEmpty": {
    nl: "Geen leesbare tekst in dit bestand.",
    en: "No readable text in this file.",
  },
  "step1.uploadErrorTooLarge": {
    nl: "Bestand te groot (max. 4 MB per bestand).",
    en: "File too large (max 4 MB per file).",
  },
  "step1.info": {
    nl: "Waarom dit belangrijk is: een gespecialiseerde assistent levert betere output dan een generalist. Hoe specifieker het domein, hoe relevanter de antwoorden.",
    en: "Why this matters: a specialized assistant delivers better output than a generalist. The more specific the domain, the more relevant the answers.",
  },
  "step1.guideTip": {
    nl: "Uit de praktijkgids: begin met taak en gebruiker — wie zet de assistent in, en wat is de ene kerntaak? Benoem expliciet wat buiten scope valt. Eén smalle specialisatie wint vaker van een alleskunner.",
    en: "From the practice guide: start with the task and user — who uses the assistant, and what is the one core job? Be explicit about what is out of scope. One narrow focus usually beats a generalist.",
  },

  "step2.subtitle": {
    nl: "Definieer wie je assistent is en hoe die denkt.",
    en: "Define who your assistant is and how it thinks.",
  },
  "step2.jobTitle": { nl: "Functietitel + senioriteitsniveau", en: "Job title + seniority level" },
  "step2.jobTitlePlaceholder": {
    nl: "Bijv. 'Senior Email Marketing Strategist met 10 jaar ervaring in B2B SaaS'",
    en: "E.g. 'Senior Email Marketing Strategist with 10 years of B2B SaaS experience'",
  },
  "step2.jobTitleTip": {
    nl: "Wees specifiek. 'Copywriter' is te breed. 'Senior conversion copywriter gespecialiseerd in SaaS onboarding flows' is beter.",
    en: "Be specific. 'Copywriter' is too broad. 'Senior conversion copywriter specialized in SaaS onboarding flows' is better.",
  },
  "step2.mentalLens": {
    nl: "Mentale lens — hoe denkt de assistent?",
    en: "Mental lens — how does the assistant think?",
  },
  "step2.mentalLensPills.strategist": { nl: "Denkt als een strateeg", en: "Thinks like a strategist" },
  "step2.mentalLensPills.conversion": { nl: "Test eerst op conversie", en: "Tests for conversion first" },
  "step2.mentalLensPills.reader": { nl: "Redeneert vanuit de lezer", en: "Reasons from the reader" },
  "step2.mentalLensPills.emotion": { nl: "Weegt emotie vs. ratio", en: "Weighs emotion vs. ratio" },
  "step2.mentalLensPlaceholder": { nl: "Of typ een eigen mentale lens…", en: "Or type a custom mental lens…" },
  "step2.success": { nl: "Definitie van succes", en: "Definition of success" },
  "step2.successPlaceholder": {
    nl: "Wanneer heeft de assistent goed werk geleverd? Bijv. 'als de output direct bruikbaar is zonder grote aanpassingen'",
    en: "When has the assistant done good work? E.g. 'when the output is directly usable without major adjustments'",
  },
  "step2.guideTip": {
    nl: "Uit de praktijkgids: omschrijf de rol als een vacature — functie, verantwoordelijkheden, en wat je níét verwacht. Die switch dwingt concreetheid. Liever expert in één opdracht dan overal gemiddeld.",
    en: "From the practice guide: describe the role like a job post — function, responsibilities, and what you don’t expect. That forces specificity. Better an expert in one remit than mediocre everywhere.",
  },

  "step3.subtitle": {
    nl: "Geef je assistent een filosofie. Zonder overtuiging klinkt het als een zoekmachine.",
    en: "Give your assistant a philosophy. Without conviction it sounds like a search engine.",
  },
  "step3.belief": {
    nl: "Centrale overtuiging in één assertieve zin",
    en: "Central belief in one assertive sentence",
  },
  "step3.beliefPlaceholder": {
    nl: "Bijv. 'Elk stuk copy moet eerst scanbaar zijn, dan overtuigend.'",
    en: "E.g. 'Every piece of copy must be scannable first, then persuasive.'",
  },
  "step3.beliefPills.simplicity": { nl: "Eenvoud converteert altijd beter", en: "Simplicity always converts better" },
  "step3.beliefPills.rhythm": { nl: "Elk kanaal heeft z'n eigen ritme", en: "Every channel has its own rhythm" },
  "step3.beliefPills.benefits": { nl: "Voordelen verslaan features", en: "Benefits beat features" },
  "step3.anchor": {
    nl: "Kwaliteitsanker — referentiepersoon of merk",
    en: "Quality anchor — reference person or brand",
  },
  "step3.anchorPlaceholder": {
    nl: "Bijv. 'Schrijf als Joanna Wiebe van Copyhackers' of 'De toon van Coolblue'",
    en: "E.g. 'Write like Joanna Wiebe from Copyhackers' or 'The tone of Mailchimp'",
  },
  "step3.info": {
    nl: "Waarom dit belangrijk is: zonder filosofie klinkt de assistent als een zoekmachine. Een kernovertuiging geeft richting aan elke output.",
    en: "Why this matters: without a philosophy the assistant sounds like a search engine. A core conviction gives direction to every output.",
  },
  "step3.guideTip": {
    nl: "Uit de praktijkgids: de systeemprompt is het DNA van je assistent — zonder duidelijke identiteit blijft het een lege schil. Kies één kern en bouw daarop: specialisatie levert vaker tevreden output dan eindeloze breedte.",
    en: "From the practice guide: the system instruction is the assistant’s DNA — without a clear identity it’s an empty shell. Pick one core and build on it: specialization usually beats trying to cover everything.",
  },

  "step4.subtitle": { nl: "Bepaal hoe je assistent klinkt.", en: "Define how your assistant sounds." },
  "step4.toneProfile": { nl: "Toonprofiel", en: "Tone profile" },
  "step4.tonePills.direct": { nl: "Direct & helder", en: "Direct & clear" },
  "step4.tonePills.warm": { nl: "Warm & menselijk", en: "Warm & human" },
  "step4.tonePills.energetic": { nl: "Energiek & actiegericht", en: "Energetic & action-oriented" },
  "step4.tonePlaceholder": { nl: "Of beschrijf je eigen toon…", en: "Or describe your own tone…" },
  "step4.doLabel": { nl: "✓ Wel doen", en: "✓ Do" },
  "step4.dontLabel": { nl: "✗ Niet doen", en: "✗ Don't" },
  "step4.doPlaceholder": {
    nl: "Beschrijf hoe de assistent WEL moet klinken…",
    en: "Describe how the assistant SHOULD sound…",
  },
  "step4.dontPlaceholder": {
    nl: "Beschrijf hoe de assistent NIET mag klinken…",
    en: "Describe how the assistant should NOT sound…",
  },
  "step4.tip": {
    nl: "Tip: voeg één voorbeeldzin toe die de perfecte toon illustreert. Dat helpt de assistent enorm.",
    en: "Tip: add one example sentence that illustrates the perfect tone. This helps the assistant enormously.",
  },
  "step4.guideTip": {
    nl: "Uit de praktijkgids: draai merkwaarden om in gedragsregels. 'Schrijf warm' is te vaag — geef zinnen die wél en géén toon mogen, dan leert het model van contrast, niet van een losse wens.",
    en: "From the practice guide: turn brand values into behavior. 'Write warmly' is vague — add lines that match and that don’t, so the model learns from contrast, not a vague wish.",
  },

  "step5.subtitle": {
    nl: "Vertel je assistent voor wie en waar het werkt.",
    en: "Tell your assistant who it works for and where.",
  },
  "step5.audience": { nl: "Doelgroep", en: "Target audience" },
  "step5.audiencePlaceholder": {
    nl: "Beschrijf je ideale lezer/klant zo specifiek mogelijk…",
    en: "Describe your ideal reader/customer as specifically as possible…",
  },
  "step5.channels": { nl: "Primaire kanalen", en: "Primary channels" },
  "step5.channelPills": {
    nl: "Email,Instagram,LinkedIn,Meta ads,Google ads,Website,Newsletter,TikTok",
    en: "Email,Instagram,LinkedIn,Meta ads,Google ads,Website,Newsletter,TikTok",
  },
  "step5.brandPromise": { nl: "Merkbelofte", en: "Brand promise" },
  "step5.brandPromisePlaceholder": {
    nl: "Wat beloof je je klanten? In één of twee zinnen.",
    en: "What do you promise your customers? In one or two sentences.",
  },
  "step5.guideTip": {
    nl: "Uit de praktijkgids: verrijk met échte inhoud — doelgroep (ook emotioneel), merkbegrippen en productnamen. 'Houd rekening met de regels' zonder die regels in de instructie is nutteloos: het model kent enkel wat jij meegeeft.",
    en: "From the practice guide: embed real content — audience (including emotionally), brand terms, and product names. 'Follow the rules' without the actual rules in the prompt is useless: the model only knows what you provide.",
  },

  "step6.subtitle": {
    nl: "Dit is de stap die de meeste builders overslaan.",
    en: "This is the step most builders skip.",
  },
  "step6.checklist": { nl: "Interne checklist (max. 5 criteria)", en: "Internal checklist (max. 5 criteria)" },
  "step6.checklistPlaceholder": {
    nl: "Typ een criterium en druk Enter…",
    en: "Type a criterion and press Enter…",
  },
  "step6.checklistPills.scannable": { nl: "Scanbaar in 5 seconden?", en: "Scannable in 5 seconds?" },
  "step6.checklistPills.cta": { nl: "CTA aanwezig en logisch?", en: "CTA present and logical?" },
  "step6.checklistPills.assumptions": { nl: "Geen aannames gemaakt?", en: "No assumptions made?" },
  "step6.mistakes": { nl: "Veelgemaakte fouten in briefings", en: "Common user briefing mistakes" },
  "step6.mistakesPlaceholder": {
    nl: "Welke fouten maken gebruikers vaak bij het briefen? Bijv. 'te vage doelgroepomschrijving'",
    en: "What mistakes do users commonly make when briefing? E.g. 'too vague target audience description'",
  },
  "step6.info": {
    nl: "Waarom dit belangrijk is: dit is de stap die de meeste builders overslaan. Een kwaliteitsfilter voorkomt dat je assistent middelmatige output levert.",
    en: "Why this matters: this is the step most builders skip. A quality filter prevents your assistant from delivering mediocre output.",
  },
  "step6.guideTip": {
    nl: "Uit de praktijkgids: test grensgevallen, laat iemand anders proberen en documenteer elke wijziging. Behandel de assistent als een nieuwe collega: bijsturen in de start is geen gebrek, maar normaal inloopproces.",
    en: "From the practice guide: test edge cases, have someone who didn’t build it try it, and log each change. Treat the assistant like a new hire — early coaching is normal onboarding, not failure.",
  },

  "step7.subtitle": { nl: "Stel duidelijke grenzen voor je assistent.", en: "Set clear boundaries for your assistant." },
  "step7.alwaysDo": { nl: "Altijd doen", en: "Always do" },
  "step7.alwaysDoPlaceholder": {
    nl: "Bijv. 'Begin altijd met de belangrijkste boodschap'",
    en: "E.g. 'Always start with the most important message'",
  },
  "step7.neverDo": { nl: "Nooit doen", en: "Never do" },
  "step7.neverDoPlaceholder": {
    nl: "Bijv. 'Gebruik nooit jargon zonder uitleg'",
    en: "E.g. 'Never use jargon without explanation'",
  },
  "step7.outOfScope": { nl: "Reactie bij out-of-scope vragen", en: "Out-of-scope response" },
  "step7.outOfScopePlaceholder": {
    nl: "Wat moet de assistent zeggen als iemand iets vraagt buiten zijn expertise?",
    en: "What should the assistant say when asked something outside its expertise?",
  },
  "step7.missingInfo": { nl: "Protocol bij ontbrekende informatie", en: "Missing info protocol" },
  "step7.missingInfoPlaceholder": {
    nl: "Wat moet de assistent doen als de briefing onvolledig is?",
    en: "What should the assistant do when the briefing is incomplete?",
  },
  "step7.guideTip": {
    nl: "Uit de praktijkgids: regels zijn vangnetten — zonder expliciet altijd/nooit en duidelijk ontbrekende-info-gedrag improviseert het model. Zet compliance concreet. Plan herbekeuring wanneer je merk of regels wijzigen.",
    en: "From the practice guide: rules are safety nets — without clear always/never and missing-info behavior, the model improvises. Make compliance explicit. Revisit when your brand or rules change.",
  },

  "step8.subtitle": {
    nl: "De finishing touch: geef je assistent een identiteit.",
    en: "The finishing touch: give your assistant an identity.",
  },
  "step8.name": { nl: "Naam van de assistent", en: "Assistant name" },
  "step8.namePlaceholder": { nl: "Bijv. 'CopyBot Pro' of 'Mia'", en: "E.g. 'CopyBot Pro' or 'Mia'" },
  "step8.description": { nl: "Omschrijving in één zin", en: "One-sentence description" },
  "step8.descriptionPlaceholder": {
    nl: "Bijv. 'Een senior email copywriter die conversiegerichte flows schrijft'",
    en: "E.g. 'A senior email copywriter who creates conversion-focused flows'",
  },
  "step8.outputStructure": { nl: "Standaard outputstructuur", en: "Default output structure" },
  "step8.outputStructurePlaceholder": {
    nl: "Bijv. 'Onderwerpregel → Preview tekst → Body → CTA'",
    en: "E.g. 'Subject line → Preview text → Body → CTA'",
  },
  "step8.lengthLimits": { nl: "Lengtelimieten", en: "Length limits" },
  "step8.lengthLimitsPlaceholder": {
    nl: "Bijv. 'Max 150 woorden voor email, max 280 tekens voor social'",
    en: "E.g. 'Max 150 words for email, max 280 characters for social'",
  },
  "step8.variants": { nl: "Aantal varianten", en: "Number of variants" },
  "step8.variantsPlaceholder": { nl: "Bijv. '3 varianten per verzoek'", en: "E.g. '3 variants per request'" },
  "step8.kickoff": { nl: "Kick-off bericht", en: "Kick-off message" },
  "step8.kickoffSub": {
    nl: "Het eerste bericht dat de assistent stuurt wanneer geopend.",
    en: "The first message the assistant sends when opened.",
  },
  "step8.kickoffPlaceholder": {
    nl: "Bijv. 'Hoi! Ik ben je email copywriter. Vertel me over je doelgroep, het doel van je mail, en eventuele specifieke eisen — dan ga ik aan de slag.'",
    en: "E.g. 'Hi! I'm your email copywriter. Tell me about your target audience, the goal of your email, and any specific requirements — and I'll get to work.'",
  },
  "step8.guideTip": {
    nl: "Uit de praktijkgids: beschrijf je standaardlevering concreet (structuur, lengte, varianten) — niet alleen 'geef een tekst'. In de uiteindelijke prompt helpt Markdown (koppen, lijsten); houd rekening met een begrensde lengte (o.a. plafond rond 8.000 tekens) en kies focus boven volledigheid.",
    en: "From the practice guide: describe the default deliverable concretely (structure, length, variants) — not just 'give text'. In the final prompt, Markdown (headings, lists) helps; keep the full system block within a sensible length (often ~8,000 characters) and favor focus over trying to say everything.",
  },

  "output.title": { nl: "Je AI-assistent is klaar!", en: "Your AI assistant is ready!" },
  "output.completeness": { nl: "Volledigheid", en: "Completeness" },
  "output.charCount": { nl: "Tekens", en: "Characters" },
  "output.tabInstruction": { nl: "Systeeminstructie", en: "System instruction" },
  "output.tabKickoff": { nl: "Kick-off bericht", en: "Kick-off message" },
  "output.maxChars": { nl: "Max 8.000 tekens", en: "Max 8,000 characters" },
  "output.saveShare": { nl: "Opslaan & delen", en: "Save & share" },
  "output.actionCopy": { nl: "Kopiëer", en: "Copy" },
  "output.createLink": { nl: "Creëer een link", en: "Create a link" },
  "output.downloadPdf": { nl: "Download pdf versie", en: "Download PDF" },
  "output.sendEmail": { nl: "Verstuur per email", en: "Send by email" },
  "output.copyOk": { nl: "Gekopieerd naar het klembord", en: "Copied to clipboard" },
  "output.copyFail": { nl: "Kopiëren mislukt", en: "Copy failed" },
  "output.linkCopied": { nl: "Link gekopieerd naar het klembord", en: "Link copied to clipboard" },
  "output.linkFailed": { nl: "Link maken mislukt. Controleer of de database klaar is.", en: "Could not create link. Check the database is set up." },
  "output.nothingToExport": { nl: "Geen kick-off tekst om te delen.", en: "No kick-off text to export." },

  "sharePage.title": { nl: "Gedeelde assistent", en: "Shared assistant" },
  "sharePage.sub": { nl: "Dit is een read-only weergave van de gegenereerde instructie.", en: "This is a read-only view of the generated instruction." },
  "sharePage.back": { nl: "Terug naar de wizard", en: "Back to the wizard" },

  "md.role": { nl: "## Rol & expertise", en: "## Role & expertise" },
  "md.conviction": { nl: "## Kernovertuiging", en: "## Core conviction" },
  "md.tone": { nl: "## Toon & stijl", en: "## Tone & style" },
  "md.do": { nl: "### ✓ Wel", en: "### ✓ Do" },
  "md.dont": { nl: "### ✗ Niet", en: "### ✗ Don't" },
  "md.context": { nl: "## Context", en: "## Context" },
  "md.audience": { nl: "### Doelgroep", en: "### Target audience" },
  "md.channels": { nl: "### Kanalen", en: "### Channels" },
  "md.brandPromise": { nl: "### Merkbelofte", en: "### Brand promise" },
  "md.quality": { nl: "## Kwaliteitsfilter", en: "## Quality filter" },
  "md.checklist": { nl: "### Checklist", en: "### Checklist" },
  "md.mistakes": { nl: "### Veelgemaakte fouten", en: "### Common mistakes" },
  "md.rules": { nl: "## Regels & scope", en: "## Rules & scope" },
  "md.alwaysDo": { nl: "### Altijd doen", en: "### Always do" },
  "md.neverDo": { nl: "### Nooit doen", en: "### Never do" },
  "md.outOfScope": { nl: "### Out-of-scope", en: "### Out-of-scope" },
  "md.missingInfo": { nl: "### Ontbrekende info", en: "### Missing info" },
  "md.output": { nl: "## Output", en: "## Output" },
  "md.structure": { nl: "### Structuur", en: "### Structure" },
  "md.length": { nl: "### Lengtelimieten", en: "### Length limits" },
  "md.variants": { nl: "### Varianten", en: "### Variants" },
};

export function tr(key: string, lang: Lang): string {
  return t[key]?.[lang] ?? key;
}
