import { Component } from '../base/Component';
import { IGalleryState } from '../../types';


export class Gallery extends Component<IGalleryState> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.catalogElement = container;
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }
}