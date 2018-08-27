import { ElementRef, EventEmitter } from '@angular/core';
import { ImageViewerController } from './image-viewer.controller';
export declare class ImageViewerDirective {
    private _el;
    private imageViewerCtrl;
    src: string;
    options: any;
    close: EventEmitter<{}>;
    private el;
    constructor(_el: ElementRef, imageViewerCtrl: ImageViewerController);
    onClick(event: Event): void;
}
