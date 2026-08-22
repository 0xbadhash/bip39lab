# Plan: Intermediate stills 0.16.22

**Spec:** `.agents/specs/2026-08-20-int-stills.md`

## Approach

Copy the three locked PNGs into `web/assets/ds/faces/`. Replace `#chapterIntermediate` figure (hidden SVG + hook caption) with a three-column figure of visible `<img>` tags. Do not use `img.chapter-visual-img[data-chapter]` so `hookChapterVisuals` will not hide them. Keep I1–I4 markup.

## Architecture

HTML `#intStills` grid; CSS borders `#3a4a60`; assets under `web/assets/ds/faces/intermediate-*.png`. Playwright S104 asserts src and visibility.

## Implementation sequence

- Copy PNGs; swap Intermediate figure; CSS.
- Update S104 + comet; stamp 0.16.22.
- Merge to master without leftover dirty scripts; tag and push.

## Testing

S104 three PNGs; S103 Beginner; S106 OK overlay; S107 hover; S108 rec-flow.

## Risks

hookChapterVisuals hiding imgs if class/data-chapter reused. Do not Imagine.

## Rollback

Live stays 0.16.21 until this tag deploys.
