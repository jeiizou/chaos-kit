export function scrollTo(el: HTMLElement, option?: ScrollIntoViewOptions) {
    el.scrollIntoView({ behavior: 'smooth', ...option });
}
