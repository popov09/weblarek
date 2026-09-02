export abstract class Component<T> {
    constructor(public readonly container: HTMLElement) {}

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}