/** Page offsets follow actual card positions, including a partial final group. */
export function carouselPages(
  cardOffsets: number[],
  viewportWidth: number,
  scrollWidth: number,
) {
  const maxScroll = Math.max(0, scrollWidth - viewportWidth);
  if (cardOffsets.length < 2 || maxScroll < 1) return [0];
  const stride = cardOffsets[1] - cardOffsets[0];
  if (stride <= 0 || viewportWidth <= 0) return [0];
  const perPage = Math.max(1, Math.round(viewportWidth / stride));
  const pages = [0];
  for (let index = perPage; index < cardOffsets.length; index += perPage) {
    const offset = Math.min(maxScroll, cardOffsets[index] - cardOffsets[0]);
    if (offset - pages[pages.length - 1] > 1) pages.push(offset);
  }
  if (maxScroll - pages[pages.length - 1] > 1) pages.push(maxScroll);
  return pages;
}
