/**
 * Layout variants for the for-sale page.
 *
 * Each layout is a pure CSS variation — same JSX, different positioning.
 * Driven by `data-layout={layout.id}` on the container in DomainSalePage.
 *
 * To add a new layout: append an object below AND add a matching block in
 * DomainSalePage.module.css under `.container[data-layout="<id>"]`.
 */
export const layouts = [
  {
    id: 'split',
    name: 'Split',
    description: 'Side-by-side (default)',
    icon: 'fa-columns',
  },
  {
    id: 'stack',
    name: 'Stack',
    description: 'Text on top, card below',
    icon: 'fa-bars-staggered',
  },
  {
    id: 'center',
    name: 'Center',
    description: 'Centered hero-style',
    icon: 'fa-align-center',
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Tight spacing, card-led',
    icon: 'fa-compress',
  },
];

export const defaultLayoutId = 'split';

export function getLayoutById(id) {
  return layouts.find((l) => l.id === id) ?? layouts[0];
}
