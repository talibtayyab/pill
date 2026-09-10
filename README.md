# Pill Pal

Pill Pal is an AI-powered medication assistant built with Next.js and Google Genkit. A user uploads a photo of a prescription, and the app extracts the medication details, then generates dietary suggestions, health tips, and reminders around them.

## Features

- **Prescription image upload** — drag-and-drop, file picker, or device camera
- **AI prescription analysis** — a Genkit flow extracts medication name, dosage, and schedule from the uploaded image
- **Dietary suggestions** — a Genkit flow recommends foods to eat or avoid for each medication
- **Health tips** — a Genkit flow generates general health and lifestyle guidance related to each medication
- **Medication reminders** — set a reminder per medication that fires a toast notification
- **AI medical chatbot** — ask follow-up medical questions, with responses carrying a disclaimer
- **Medication logging** — a daily checklist per medication, with a nearby-pharmacy lookup once it's complete
- **Results display** — extracted details, dietary suggestions, and health tips shown in a multi-card layout

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack) with TypeScript
- [Genkit](https://firebase.google.com/docs/genkit) with the Google GenAI plugin for the AI flows
- [Firebase](https://firebase.google.com/) for hosting/backend services
- [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) for the UI
- React Hook Form + Zod for form handling and validation
- Recharts for charts

Scaffolded in [Firebase Studio](https://firebase.studio/); the original product blueprint is in [`docs/blueprint.md`](docs/blueprint.md).

## Project structure

```
src/
  ai/
    flows/                 # Genkit flows: extraction, dietary suggestions, health tips, Q&A
    genkit.ts               # Genkit client configuration
  app/                       # Next.js app router pages
  components/
    pill-pal/               # App-specific components (uploader, chatbot, results, etc.)
    ui/                      # shadcn/ui components
  hooks/, lib/               # Shared hooks and utilities
```

## Getting started

```bash
npm install
npm run dev       # starts the Next.js app on port 9002
```

To run the Genkit flows locally alongside the app:

```bash
npm run genkit:dev    # or genkit:watch for auto-reload
```

Other useful scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Disclaimer

This is a personal/experimental project. It is not a medical device and its AI-generated suggestions should not replace professional medical advice.
