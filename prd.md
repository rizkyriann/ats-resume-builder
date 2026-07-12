# ATS Resume Builder — Product Requirements Document (PRD)

Version: 1.0.0
Status: Approved for implementation
Owner: Product/Architecture (this document is the source of truth for scope)

---

## 1. Vision

Give any job seeker a fast, private, zero-friction way to build a resume that passes Applicant Tracking Systems (ATS) and reads well to a human recruiter — entirely in the browser, with no account, no backend, and no data leaving the device unless the user explicitly enables an optional AI feature.

The product succeeds when a user can go from a blank page to a downloaded, ATS-safe PDF resume in under 10 minutes, with real-time confidence (via score and keyword match) that the resume will clear automated screening.

---

## 2. Product Goals

1. **Zero friction**: no sign-up, no login, no server round-trip to start building.
2. **Privacy by default**: all resume data lives in `localStorage` on the user's device. Nothing is transmitted anywhere unless the user turns on an AI provider and explicitly invokes an AI action.
3. **ATS compatibility**: the single built-in template and the underlying data model must produce resumes that parse cleanly in common ATS parsers (single column, standard headings, no graphics/tables/icons).
4. **Actionable feedback**: users must be able to see, numerically and specifically, why their resume would or wouldn't perform well against ATS and against a specific job description.
5. **Durability of work**: users must never lose their in-progress resume due to a refresh, tab close, or crash (autosave), and must be able to back up / move their data (JSON import/export).
6. **Extensibility without lock-in**: AI is an optional enhancement layer. The product must be 100% functional, and feel complete, with AI fully disabled.

---

## 3. Success Metrics

Since there is no backend/analytics server by default, these metrics are defined as product-quality targets to design and test against (to be measured via optional, privacy-respecting client-side instrumentation or manual QA — instrumentation itself is out of scope for MVP):

| Metric | Target |
|---|---|
| Time to first PDF download (new user, no prior data) | < 10 minutes |
| Resume data loss incidents (crash/refresh) | 0 |
| ATS score calculation time | < 50ms for a typical resume |
| Keyword match calculation time | < 150ms for a 1–2 page job description |
| PDF generation time | < 3s for a 1–2 page resume |
| Lighthouse Accessibility score | ≥ 95 |
| Lighthouse Performance score (desktop) | ≥ 90 |
| First load bundle (gzipped, excluding PDF lib chunk) | < 250KB |
| Core flows usable with keyboard only | 100% |
| Core flows usable on a 375px-wide viewport | 100% |

---

## 4. Personas

### 4.1 Fresh Graduate — "Dinda"
- No prior resume, unsure of formatting conventions.
- Needs guidance (placeholders, examples) more than power features.
- Highly price-sensitive; will not tolerate a paywall or signup.

### 4.2 Junior Developer — "Bagas"
- Has a resume already, wants to check if it's ATS-compliant and tailor it per job posting.
- Comfortable importing/exporting JSON, will reuse the resume across many applications.
- Applies to many jobs quickly; needs fast iteration and keyword matching against each JD.

### 4.3 Professional Job Seeker — "Sarah"
- Experienced, has a long work history (many experience entries).
- Cares about a clean, professional, "safe" template that won't look gimmicky to a human reviewer either.
- Wants precise control over dates, ordering, and wording.

### 4.4 Career Switcher — "Rudi"
- Needs to reframe prior experience for a new field; relies heavily on Professional Summary and keyword matching to know which of his existing skills to foreground.
- Most likely persona to use the "Improve with AI" summary feature, if configured.

### 4.5 Freelancer — "Made"
- Applies rarely but wants a strong resume kept ready.
- Values the resume being stored locally and durable across long gaps between visits (weeks/months) — autosave and JSON export/backup matter most here.

---

## 5. User Stories

Format: *As a [persona], I want [capability], so that [outcome].*

### Resume Building
- As a user, I want to fill in my personal information, so that my contact details appear correctly on my resume.
- As a user, I want to write a professional summary, so that recruiters get a quick pitch of who I am.
- As a user, I want to add, reorder, edit, and remove multiple experience entries, so that my resume reflects my real work history.
- As a user, I want to mark an experience as "current job," so that the end date is automatically handled as "Present."
- As a user, I want to add, edit, and remove education entries, so that my academic background is represented.
- As a user, I want to add skills as tags, so that I can list many skills compactly and edit them quickly.
- As a user, I want to add certifications, so that relevant credentials are visible to recruiters and ATS.

### Preview & Output
- As a user, I want to see a live preview of my resume as I type, so that I know exactly what the final document will look like.
- As a user, I want to download my resume as a polished, single-column PDF, so that I can submit it to job applications.
- As a user, I want the PDF to paginate correctly when my content is long, so that nothing gets cut off or overlaps across pages.

### Data Safety
- As a user, I want my edits saved automatically, so that I never lose my work if I close the tab or my browser crashes.
- As a user, I want to export my resume data as a JSON file, so that I can back it up or move it to another browser/device.
- As a user, I want to import a previously exported JSON file, so that I can continue editing a resume I created before.

### ATS Confidence
- As a user, I want to see an ATS score (0–100) for my resume, so that I understand how well it's likely to perform in automated screening.
- As a user, I want to see *why* my score is what it is (a breakdown), so that I know exactly what to fix.
- As a user, I want to paste a job description and see which keywords I already match and which I'm missing, so that I can tailor my resume for that specific job.

### AI (Optional)
- As a user who has configured an AI provider, I want to click "Improve with AI" on my professional summary, so that I get a stronger, more polished draft I can accept or discard.
- As a user without an AI provider configured, I want the AI features to be clearly disabled (not broken or confusing), so that I understand the app works fine without them.

---

## 6. Functional Requirements

### FR-1 Resume Data Entry
- FR-1.1 The system shall provide a form for Personal Information: Full Name, Job Title, Email, Phone, City, LinkedIn URL, Portfolio URL.
- FR-1.2 The system shall provide a rich-enough (multi-line) text field for Professional Summary.
- FR-1.3 The system shall provide a dynamic (add/remove/reorder) list for Experience entries, each with: Company, Position, Location, Start Date, End Date, Current Job (boolean), Description.
- FR-1.4 When "Current Job" is checked, End Date shall be disabled/cleared and the system shall render "Present" in preview/PDF.
- FR-1.5 The system shall provide a dynamic list for Education entries (Institution, Degree, Field of Study, Start Date, End Date, Location, Description/Notes — see Architecture for full field list).
- FR-1.6 The system shall provide a tag-style input for Skills (add via Enter/comma, remove via click/backspace).
- FR-1.7 The system shall provide a dynamic list for Certifications (Name, Issuer, Date, Credential URL — optional).
- FR-1.8 All list-based sections (Experience, Education, Certifications, Skills) shall support reordering (e.g., up/down controls or drag handle).

### FR-2 Validation
- FR-2.1 All form inputs shall be validated with Zod schemas; invalid fields shall show inline error messages without blocking typing.
- FR-2.2 Email field shall validate email format when non-empty; field is optional but if present must be valid.
- FR-2.3 URL fields (LinkedIn, Portfolio, Credential URL) shall validate URL format when non-empty.
- FR-2.4 Date fields shall validate that Start Date is not after End Date (when End Date present).

### FR-3 Live Preview
- FR-3.1 The preview shall reflect form state changes with no more than one animation-frame perceptible delay (i.e., effectively instant; debouncing is allowed only for autosave-to-storage, never for preview rendering).
- FR-3.2 The preview shall render using the exact same template/markup logic used for PDF generation, so what the user sees is what gets downloaded ("WYSIWYG").
- FR-3.3 Empty sections shall be omitted from the preview and PDF (no empty "Certifications" heading with nothing under it).

### FR-4 PDF Export
- FR-4.1 The system shall generate a downloadable A4 PDF from the current resume state.
- FR-4.2 The PDF shall paginate correctly across multiple pages without cutting a line of text in half or overlapping content at page boundaries.
- FR-4.3 The PDF shall use selectable/searchable text, not an image of text (a hard requirement for ATS compatibility — see Architecture §PDF Layer for the implementation approach that guarantees this).
- FR-4.4 The filename shall default to a slug derived from the user's full name and "Resume" (e.g., `budi-santoso-resume.pdf`), with a safe fallback (`resume.pdf`) when name is empty.

### FR-5 Autosave & Persistence
- FR-5.1 Every change to resume data shall be persisted to `localStorage`, debounced (default 500ms) to avoid excessive writes.
- FR-5.2 On load, the app shall hydrate from `localStorage` if a saved resume exists.
- FR-5.3 The system shall show a subtle, non-intrusive "Saved" / "Saving…" indicator.
- FR-5.4 If `localStorage` is unavailable (private browsing edge cases, quota exceeded) the system shall degrade gracefully: show a non-blocking warning, keep working in-memory for the session.

### FR-6 Import / Export JSON
- FR-6.1 The system shall export the full resume data model as a downloadable `.json` file, including a `schemaVersion` field.
- FR-6.2 The system shall allow importing a `.json` file; the file shall be validated against the Zod schema for the resume model before being applied.
- FR-6.3 If the imported JSON's `schemaVersion` is older than current, the system shall run a migration chain to upgrade it (see Architecture §Storage Layer / Versioning).
- FR-6.4 If the imported JSON fails validation or migration, the system shall reject the import with a clear error and shall not corrupt the currently-loaded resume.
- FR-6.5 Import shall prompt for confirmation before overwriting existing unsaved-differences data.

### FR-7 ATS Score
- FR-7.1 The system shall compute a deterministic 0–100 ATS score from resume content, with no AI/network dependency.
- FR-7.2 The score shall be broken down into weighted categories (see Architecture §ATS Engine for exact weights/algorithm): Contact Information, Summary, Experience, Education, Skills, Certifications, Keyword Match (only when a JD is provided; otherwise redistributed), Resume Completeness, Formatting Rules.
- FR-7.3 The system shall display the overall score plus a per-category breakdown with actionable, specific suggestions (e.g., "Add a phone number", "Your summary is shorter than the recommended 40 words").
- FR-7.4 The score shall recompute reactively as the user edits the resume (debounced to avoid excessive recompute, but no worse than ~300ms).

### FR-8 Keyword Match
- FR-8.1 The system shall provide a text area for pasting a Job Description.
- FR-8.2 The system shall extract candidate keywords/phrases from the JD using a deterministic algorithm (see Architecture §Keyword Engine).
- FR-8.3 The system shall compare extracted keywords against all resume text content (summary, experience descriptions, skills, certifications, education) using normalized/stemmed matching.
- FR-8.4 The system shall display: Matched Keywords, Missing Keywords, Coverage % (matched / total extracted, weighted), and Suggestions (e.g., "Consider adding 'Kubernetes' to your Skills or Experience").
- FR-8.5 Keyword match results shall feed into the ATS Score's Keyword Match category when a JD is present.

### FR-9 AI Professional Summary Improvement
- FR-9.1 The system shall provide an "Improve with AI" action on the Professional Summary field.
- FR-9.2 The action shall be disabled (visibly, with an explanatory tooltip/state) when no AI provider is configured.
- FR-9.3 When enabled, invoking the action shall send only the minimum necessary context (current summary text, optionally job title and top skills) to the configured provider and return a suggested rewrite.
- FR-9.4 The user shall be able to preview the AI suggestion and explicitly Accept (replace) or Discard it; the AI shall never silently overwrite user text.
- FR-9.5 AI provider configuration (API key, provider selection) shall be stored locally (see Architecture §AI Provider Layer) and never bundled/hardcoded into the app.
- FR-9.6 Network/provider errors shall be caught and surfaced as a friendly inline error; they shall never crash the app or lose the user's existing summary.

### FR-10 Settings
- FR-10.1 The system shall provide a Settings panel where the user can select an AI provider and enter credentials/config for it.
- FR-10.2 The system shall provide a way to clear all locally stored data (resume + settings) with a confirmation step.

---

## 7. Non-Functional Requirements

- **Performance**: Interaction to Next Paint should stay responsive (<200ms) for all form typing; heavier computations (ATS score, keyword match, PDF generation) must be debounced/async so they never block typing.
- **Responsiveness**: Fully usable from 375px mobile viewports up to large desktop screens. On small screens, the builder and preview may stack instead of side-by-side.
- **Accessibility**: WCAG 2.1 AA target. All interactive elements keyboard-reachable, labeled, with visible focus states. Color contrast meets AA. Dynamic list add/remove announced via ARIA live regions where practical.
- **Modularity**: Feature-first architecture (see Architecture doc); each core feature (builder, preview, ats-score, keyword-match, ai, pdf, storage) is isolated and independently testable.
- **Type Safety**: Strict TypeScript across the codebase; no `any` in shared types; resume data model is the single source of truth for types (Zod-inferred).
- **Maintainability**: SOLID/DRY/KISS, composition over inheritance, small components, clear boundaries between UI, domain logic (engines), and infrastructure (storage, AI, PDF).
- **Offline-friendly**: Once loaded, the app (excluding the optional AI network call) must work fully offline — appropriate for a future PWA upgrade, though full offline-installability (service worker) is not required for MVP.
- **Privacy**: No resume content ever leaves the browser except the minimal payload explicitly sent during an AI "Improve with AI" action the user manually triggers.
- **No backend**: The entire MVP must run as static assets (deployable to any static host).

---

## 8. User Flow

### 8.1 First-time user, no AI
1. User lands on the app → sees an empty resume builder + empty preview + a hint/CTA to start with Personal Information.
2. User fills Personal Information → preview updates live; autosave silently persists after each debounce window.
3. User adds one or more Experience entries, Education entries, Skills, and optionally Certifications.
4. User checks the ATS Score panel → sees score and category breakdown → makes adjustments guided by suggestions.
5. (Optional) User pastes a target Job Description into the Keyword Match panel → reviews matched/missing keywords → edits resume content (e.g., adds a missing skill they genuinely have).
6. User clicks "Download PDF" → receives a polished, ATS-safe PDF.
7. User may click "Export JSON" to back up their data.

### 8.2 Returning user
1. User opens the app → resume auto-hydrates from `localStorage` exactly as left.
2. User edits further or goes straight to Download PDF / Keyword Match against a new JD.

### 8.3 User with AI configured
1. User opens Settings → selects a provider (e.g., OpenAI) → enters API key → saves.
2. Back in the builder, "Improve with AI" becomes enabled on the Summary field.
3. User writes a rough summary → clicks "Improve with AI" → sees a loading state → sees a suggested rewrite side-by-side or inline diff → clicks Accept or Discard.

### 8.4 Import flow
1. User clicks "Import JSON" → selects a `.json` file.
2. System validates schema/version → if older version, migrates → shows a confirmation ("This will replace your current resume — continue?") → applies data → preview and score update.
3. If invalid, system shows an error and nothing changes.

---

## 9. Edge Cases

- Resume with **zero content** (fresh empty state): preview and PDF export should not crash; PDF export of an entirely empty resume should be blocked with a friendly message ("Add at least your name to generate a PDF") — this is the one acceptance-blocking validation for export.
- Experience/Education entry with **Current Job checked but a stale End Date already saved**: End Date must be ignored/cleared in rendering when Current Job is true.
- **Extremely long text** in Summary/Description fields causing PDF overflow: pagination logic must correctly flow content onto additional pages, never truncate silently.
- **Very short resume (1 field filled)**: ATS score should reflect low completeness accurately, not error or show `NaN`.
- **Pasting a JD with 0 extractable keywords** (e.g., empty or non-English gibberish input): system shows "No keywords could be extracted" rather than a broken 0% / division-by-zero state.
- **Duplicate skills** entered as tags: system should de-duplicate case-insensitively.
- **Import of a JSON file that is valid JSON but not a resume** (wrong shape): rejected with a specific validation error, not a silent partial-apply.
- **Import of a JSON with a newer `schemaVersion` than the app supports** (user opened an older app build with a newer export): rejected with a clear "please update the app" style message rather than attempting a downgrade migration.
- **`localStorage` quota exceeded** (rare, e.g., many large descriptions): system warns the user and continues in-memory for the session so they don't lose current work mid-session.
- **AI provider returns an error, times out, or returns empty content**: original summary is untouched; user sees a retry-capable error state.
- **User has no AI provider configured and somehow triggers the AI action** (e.g., stale UI state): action is a no-op that re-syncs the disabled state; never throws unhandled.
- **Browser without `localStorage` support / disabled by user policy**: app still functions for the session; persistence features gracefully announce unavailability once, non-repeatedly.
- **Multiple browser tabs open with the same resume**: last-write-wins on `localStorage`; this is an accepted MVP tradeoff (see Architecture §Tradeoffs) — not a bug to fix now.

---

## 10. Acceptance Criteria (MVP-level, feature-by-feature)

- **Resume Builder**: Given a user fills all Personal Information fields, When they view the preview, Then all fields appear correctly formatted and update within one interaction frame of each keystroke (debounced only for storage, not for preview).
- **Dynamic Lists**: Given a user adds 3 Experience entries, When they reorder entry #3 to position #1, Then the preview and underlying data order update to match, and the change persists after a page reload.
- **PDF Export**: Given a resume with enough content to span 2 pages, When the user downloads the PDF, Then no content is cut off at the page boundary and text remains selectable (verified by opening the PDF and selecting text).
- **Autosave**: Given a user edits any field, When they wait past the debounce window and reload the page, Then all edits are present.
- **Import/Export**: Given a user exports JSON and then imports that same file into a cleared app state, When the import completes, Then the resulting resume is identical to the original.
- **ATS Score**: Given a resume missing a phone number and a summary, When the score is computed, Then the Contact Information and Summary categories reflect point deductions and a suggestion is shown for each.
- **Keyword Match**: Given a JD containing "React", "TypeScript", and "GraphQL", and a resume that only mentions "React" and "TypeScript", When the match runs, Then "GraphQL" appears under Missing Keywords and Coverage % reflects 2/3 (weighted per algorithm).
- **AI Summary**: Given no AI provider is configured, When the user views the Summary field, Then "Improve with AI" is visibly disabled with an explanatory affordance (tooltip/link to Settings). Given a provider is configured, When the user clicks "Improve with AI" and the call succeeds, Then a suggestion is shown and the original text is only replaced upon explicit Accept.

---

## 11. Future Roadmap (post-MVP, not built now)

- Multiple ATS-safe templates (still single-column/no-graphics constraint maintained) with style variants (font, spacing density).
- Cover letter builder using the same data model.
- Multi-resume management (named/saved resume "profiles") within `localStorage` (or IndexedDB if storage needs grow).
- AI-assisted bullet-point rewriting for individual Experience descriptions (beyond just the Summary).
- AI-assisted keyword-to-bullet suggestions ("here's how you could phrase your experience with X to include this missing keyword," without fabricating false claims).
- Optional PWA offline installability.
- Localization (Bahasa Indonesia UI, in addition to English default).
- Optional, fully opt-in, privacy-respecting anonymous usage analytics to validate the Success Metrics in §3.

---

## 12. Risks

- **ATS parser variance**: real-world ATS software varies widely in how it parses PDFs. The deterministic score is a best-effort heuristic based on documented common ATS behaviors, not a guarantee. This must be communicated in-product (a short disclaimer near the score).
- **PDF text-selectability across libraries**: some PDF generation approaches (canvas/image-based) silently produce non-selectable text, which would be an ATS-compatibility failure. The architecture must explicitly choose and justify an approach that guarantees real text (see Architecture §PDF Layer).
- **User exposes their AI API key client-side**: since there is no backend, API keys entered by the user are used directly from the browser to call the provider. This is inherent to the "no backend" constraint and must be clearly disclosed to the user (e.g., "Your key is stored only on this device and used only to call [Provider] directly from your browser").
- **`localStorage` size limits** (typically ~5–10MB per origin): a resume is small (KBs), so this is low risk, but must be handled gracefully if hit (see Edge Cases).
- **Keyword extraction naively matching irrelevant common words**: must use a stopword list and phrase-level extraction to keep signal quality reasonable (see Architecture §Keyword Engine).
- **Scope creep into a multi-template or multi-resume system pre-MVP**: explicitly out of scope; see Future Roadmap.

---

## 13. Assumptions

- Users have a modern evergreen browser (last 2 major versions of Chrome, Firefox, Safari, Edge) with `localStorage` enabled by default.
- Users generating an AI-improved summary understand and accept that doing so sends their summary text to a third-party AI provider of their own choosing/configuration.
- "ATS-friendly" is defined per widely documented industry best practices (single column, standard section headings, no graphics/icons/tables, standard fonts, selectable text) rather than certified against any single named commercial ATS product.
- The app is a single-page client-side application; no multi-user, no auth, no server-side rendering is required.

---

## 14. Constraints

- No backend server; must be deployable as static assets.
- All persistent storage is `localStorage` only for MVP (no IndexedDB, no cookies for data).
- Exactly one resume template for MVP (ATS-optimized, single-column).
- AI is optional and pluggable; no AI provider is hardcoded or bundled by default; the MVP must be fully functional and feel complete with AI off.
- ATS Score and Keyword Match must be deterministic and must not depend on AI or network access.
- Tech stack is fixed as specified: React + TypeScript + Vite + Tailwind CSS + shadcn/ui, React Hook Form + Zod, and a state management approach to be justified in the Architecture document.
