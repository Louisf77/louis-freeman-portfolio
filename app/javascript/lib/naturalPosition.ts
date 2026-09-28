const STATIC_POSITION = "static";
const MATRIX_2D_TRANSLATE_Y_INDEX = 5;
const MATRIX_3D_TRANSLATE_Y_INDEX = 13;
const MATRIX_PATTERN = /^matrix(3d)?\((.+)\)$/;

function translateYOf(element: HTMLElement): number {
  const match = MATRIX_PATTERN.exec(window.getComputedStyle(element).transform);
  if (!match?.[2]) return 0;

  const values = match[2].split(",").map(Number.parseFloat);
  const translateY = values[match[1] ? MATRIX_3D_TRANSLATE_Y_INDEX : MATRIX_2D_TRANSLATE_Y_INDEX];

  return translateY ?? 0;
}

export function enterOffsetAbove(element: HTMLElement): number {
  let offset = 0;
  for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
    offset += translateYOf(ancestor);
  }

  return offset;
}

export function naturalDocumentTop(element: HTMLElement): number {
  const inlinePosition = element.style.position;
  element.style.position = STATIC_POSITION;
  const top = element.getBoundingClientRect().top + window.scrollY - enterOffsetAbove(element);
  element.style.position = inlinePosition;

  return top;
}
