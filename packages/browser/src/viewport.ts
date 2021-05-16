/**
 * judge the element is in viewport or not
 * @param element
 * @returns
 */
function isInViewPort(element: HTMLElement) {
    const viewWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewHeight =
        window.innerHeight || document.documentElement.clientHeight;
    const { top, right, bottom, left } = element.getBoundingClientRect();

    return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}
