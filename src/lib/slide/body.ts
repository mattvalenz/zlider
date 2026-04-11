/**
 * Slide "bullets" field stores one string per textarea line (including empty strings).
 * Rendering / export rules:
 * - Lines matching /^\\s*-\\s*(.*)$/ render as normal paragraphs (strip the marker; no list bullet).
 * - Any other non-empty line renders as a list bullet.
 * - Empty lines render as vertical gaps.
 * - AI / old decks with no leading "-" on any line therefore show every line as a bullet (legacy look).
 * - CRLF (`\\r` left from split("\\n") on Windows) is stripped so "- ..." lines still match.
 */

export type BodySegment =
  | { kind: "gap" }
  | { kind: "bullet"; text: string }
  | { kind: "paragraph"; text: string };

function stripCarriageReturns(line: string): string {
  return line.replace(/\r/g, "");
}

export function parseSlideBodyLines(lines: string[]): BodySegment[] {
  const normalized = lines.map(stripCarriageReturns);
  const segments: BodySegment[] = [];

  for (const line of normalized) {
    if (line === "") {
      segments.push({ kind: "gap" });
      continue;
    }

    const dashParagraph = line.match(/^\s*-\s*(.*)$/);
    if (dashParagraph) {
      segments.push({ kind: "paragraph", text: dashParagraph[1] ?? "" });
      continue;
    }

    segments.push({ kind: "bullet", text: line });
  }

  return segments;
}

export function slideBodyHasContent(lines: string[]): boolean {
  return lines.some((l) => l.trim() !== "");
}
