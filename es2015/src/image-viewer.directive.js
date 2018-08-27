import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ImageViewerController } from './image-viewer.controller';
var ImageViewerDirective = (function () {
    function ImageViewerDirective(_el, imageViewerCtrl) {
        this._el = _el;
        this.imageViewerCtrl = imageViewerCtrl;
        this.close = new EventEmitter();
    }
    ImageViewerDirective.prototype.onClick = function (event) {
        var _this = this;
        event.stopPropagation();
        this.el = this._el.nativeElement;
        var onCloseCallback = function () { return _this.close.emit(); };
        // console.log('options', this.options);
        var options = { fullResImage: this.src, onCloseCallback: onCloseCallback };
        if (this.options) {
            this.options.fullResImage = this.src;
            this.options.onCloseCallback = onCloseCallback;
            options = this.options;
        }
        // if (!options.image)
        // {
        // 	console.log('[ImgViewer] use fullResImage as default image');
        // 	options.image = this.src;
        // }
        // console.log('options2', this.options);
        var imageViewer = this.imageViewerCtrl.create(this.el, options);
        imageViewer.present();
    };
    ImageViewerDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[imageViewer]'
                },] },
    ];
    /** @nocollapse */
    ImageViewerDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: ImageViewerController, },
    ]; };
    ImageViewerDirective.propDecorators = {
        "src": [{ type: Input, args: ['imageViewer',] },],
        "options": [{ type: Input, args: ['imageViewerOptions',] },],
        "close": [{ type: Output },],
        "onClick": [{ type: HostListener, args: ['click', ['$event'],] },],
    };
    return ImageViewerDirective;
}());
export { ImageViewerDirective };
//# sourceMappingURL=image-viewer.directive.js.map