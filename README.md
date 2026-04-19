## Zlider

[Zlider](https://zlider-iota.vercel.app/)

AI slide maker: prompt → edit → export (PPTX/PDF). Built with Next.js and Supabase. Currently using a free tier of Gemini but can be made a lot more efficient once using a more powerful Agent.

### Core features

- Responsive design (mobile → desktop)
- Email/password auth (Supabase)
- Create decks from a prompt (Gemini)
- Edit slides (title, bullets/paragraphs, notes, layout)
- Image suggestions + attach credits (Unsplash)
- Export to PPTX and PDF

### TechStack

- Next.js  TypeScript
- Tailwind CSS
- Supabase
- Google Gemini 
- Unsplash API for image suggestions 
- PPTX (`pptxgenjs`), PDF (`jspdf` + `html2canvas`)

