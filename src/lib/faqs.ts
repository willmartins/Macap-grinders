import type { FaqItem, Grinder } from "@/lib/content/types";
import { formatNumber } from "@/lib/format";
import { performanceFigures } from "@/lib/specs";

const burrLabel: Record<string, string> = { flat: "Flat", conical: "Conical" };
const grindLabel: Record<string, string> = {
  espresso: "espresso",
  filter: "filter",
  both: "espresso and filter",
};

function entered(faqs: FaqItem[]): FaqItem[] {
  return faqs.filter((item) => item.question.trim() && item.answer.trim()).slice(0, 6);
}

function burrFaq(grinder: Grinder): FaqItem | null {
  const specs = grinder.specs;
  const sentences: string[] = [];
  if (specs.burrType && specs.burrDiameterMm != null) {
    const type = burrLabel[specs.burrType] || specs.burrType;
    sentences.push(`${type} burrs, ${formatNumber(specs.burrDiameterMm)} mm.`);
  } else if (specs.burrType) {
    const type = burrLabel[specs.burrType] || specs.burrType;
    sentences.push(`${type} burrs.`);
  } else if (specs.burrDiameterMm != null) {
    sentences.push(`${formatNumber(specs.burrDiameterMm)} mm burrs.`);
  }
  if (specs.grindType) {
    const grind = grindLabel[specs.grindType] || specs.grindType;
    sentences.push(`Set for ${grind}.`);
  }
  if (!sentences.length) return null;
  return {
    _key: "default-burrs",
    question: `What burrs does the ${grinder.name} use?`,
    answer: sentences.join(" "),
  };
}

function adjustmentFaq(grinder: Grinder): FaqItem | null {
  const adjustment = grinder.specs.adjustment?.trim();
  if (adjustment) {
    return {
      _key: "default-adjustment",
      question: "How is the grind adjusted?",
      answer: `Adjustment is ${adjustment}.`,
    };
  }
  const display = grinder.specs.display?.trim();
  if (!display) return null;
  return {
    _key: "default-display",
    question: "What display does it have?",
    answer: `The display is ${display}.`,
  };
}

function placeFaq(grinder: Grinder): FaqItem | null {
  if (grinder.audience !== "home" && grinder.audience !== "business") return null;
  const place =
    grinder.audience === "business"
      ? `${grinder.name} is a professional grinder, for the bar.`
      : `${grinder.name} is a home grinder, for a domestic counter.`;
  const figures = performanceFigures(grinder);
  const output = figures.find((figure) => figure.label === "Output");
  const hopper = figures.find((figure) => figure.label === "Hopper");
  const sentences = [place];
  if (output) sentences.push(`Output is ${output.value} ${output.unit}.`);
  if (hopper) sentences.push(`The hopper holds ${hopper.value} ${hopper.unit}.`);
  return {
    _key: "default-place",
    question: `Is the ${grinder.name} for home or for the bar?`,
    answer: sentences.join(" "),
  };
}

/** Studio questions when they exist. Otherwise up to three answers from this grinder's own figures. */
export function grinderFaqs(grinder: Grinder): FaqItem[] {
  const written = entered(grinder.faqs);
  if (written.length) return written;
  return [burrFaq(grinder), adjustmentFaq(grinder), placeFaq(grinder)].filter((item): item is FaqItem => Boolean(item));
}
