var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { DomController, NavController, NavParams, Ion, GestureController, Config, Platform, ToastController, Events } from 'ionic-angular';
import { Component, ElementRef, NgZone, Renderer, ViewChild, ViewEncapsulation, Input, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageViewerSrcAnimation } from './image-viewer-src-animation';
import { ImageViewerTransitionGesture } from './image-viewer-transition-gesture';
import { ImageViewerZoomGesture } from './image-viewer-zoom-gesture';
import { SocialSharing } from "@ionic-native/social-sharing";
var ImageViewerComponent = (function (_super) {
    __extends(ImageViewerComponent, _super);
    function ImageViewerComponent(_gestureCtrl, elementRef, _nav, _zone, renderer, domCtrl, platform, _navParams, _socialShare, _toastCtrl, _events, _config, _sanitizer) {
        var _this = _super.call(this, _config, elementRef, renderer) || this;
        _this._gestureCtrl = _gestureCtrl;
        _this.elementRef = elementRef;
        _this._nav = _nav;
        _this._zone = _zone;
        _this.renderer = renderer;
        _this.domCtrl = domCtrl;
        _this.platform = platform;
        _this._navParams = _navParams;
        _this._socialShare = _socialShare;
        _this._toastCtrl = _toastCtrl;
        _this._events = _events;
        _this._sanitizer = _sanitizer;
        // TODO Use options to define these values
        _this.deletable = false;
        _this.shareable = true;
        _this.sendShareEvent = false;
        console.log('[ImgViewer] _navParams', _navParams);
        var url = _navParams.get('image');
        _this.updateImageSrc(url);
        return _this;
    }
    ImageViewerComponent.prototype.updateImageSrc = function (src) {
        this.imageUrl = this._sanitizer.bypassSecurityTrustUrl(src);
        this.imageUrlString = src;
    };
    ImageViewerComponent.prototype.updateImageSrcWithTransition = function (src) {
        var imageElement = this.image.nativeElement;
        var lowResImgWidth = imageElement.clientWidth;
        this.updateImageSrc(src);
        var animation = new ImageViewerSrcAnimation(this.platform, this.image);
        imageElement.onload = function () { return animation.scaleFrom(lowResImgWidth); };
    };
    ImageViewerComponent.prototype.ngOnInit = function () {
        var _this = this;
        var navPop = function () { return _this._nav.pop(); };
        this.unregisterBackButton = this.platform.registerBackButtonAction(navPop);
        this._zone.runOutsideAngular(function () { return _this.dragGesture = new ImageViewerTransitionGesture(_this.platform, _this, _this.domCtrl, _this.renderer, navPop); });
    };
    ImageViewerComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // imageContainer is set after the view has been initialized
        this._zone.runOutsideAngular(function () { return _this.pinchGesture = new ImageViewerZoomGesture(_this, _this.imageContainer, _this.platform, _this.renderer); });
    };
    ImageViewerComponent.prototype.ngOnDestroy = function () {
        this.dragGesture && this.dragGesture.destroy();
        this.pinchGesture && this.pinchGesture.destroy();
        this.unregisterBackButton();
    };
    ImageViewerComponent.prototype.bdClick = function () {
        if (this._navParams.get('enableBackdropDismiss')) {
            this._nav.pop();
        }
    };
    ImageViewerComponent.prototype.openShareSheet = function () {
        var _this = this;
        // console.log('image', this.imageUrlString);
        if (this.imageUrlString) {
            if (this.sendShareEvent === true) {
                this.sendEvent('imageViewer:shareImage');
            }
            else {
                if (this.platform.is('cordova')) {
                    var options = {
                        files: [this.imageUrlString],
                    };
                    this._socialShare.shareWithOptions(options).then(function (response) {
                        // console.log('Shared via options', JSON.stringify(success));
                        if (response.completed === true) {
                            var toast = _this._toastCtrl.create({
                                message: 'Geteilt',
                                duration: 3000,
                                position: 'middle',
                                showCloseButton: false,
                                cssClass: 'success-center'
                            });
                            toast.present();
                        }
                    }).catch(function () {
                    });
                }
                else {
                    // Construct downloadable
                    var link = document.createElement("a");
                    link.download = name;
                    link.href = this.imageUrlString;
                    document.body.appendChild(link);
                    link.click();
                    // Cleanup the DOM
                    document.body.removeChild(link);
                }
            }
        }
    };
    ImageViewerComponent.prototype.sendEvent = function (eventName) {
        this._events.publish(eventName, { imageUrl: this.imageUrlString, image: this.image, imageContainer: this.imageContainer });
    };
    ImageViewerComponent.prototype.setOptions = function (options) {
        this.options = options;
        console.log('setOptions', options);
    };
    ImageViewerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'image-viewer',
                    template: "\n\t\t<ion-header no-border>\n\t\t\t<ion-navbar>\n\t\t\t<ion-buttons class=\"flex flex-row\" end *ngIf=\"deletable\">\n\t\t\t\t<button ion-button icon-only class=\"btn-more bar-button-menutoggle-ios m-r-0\" (click)=\"sendEvent('imageViewer:deleteImage')\">\n\t\t\t\t\t<ion-icon class=\"btn-nav btn-nav-sm\" name=\"ui-15\"></ion-icon>\n\t\t\t\t</button>\n\t\t\t</ion-buttons>\n\t\t\t</ion-navbar>\n\t\t</ion-header>\n\n\t\t<ion-backdrop (click)=\"bdClick()\"></ion-backdrop>\n\n\t\t<div class=\"image-wrapper\">\n\t\t\t<div class=\"image\" #imageContainer>\n\t\t\t\t<img [src]=\"imageUrl\" tappable #image *ngIf=\"imageUrl\" />\n\t\t\t</div>\n\t\t</div>\n\n\t\t<ion-footer *ngIf=\"shareable\">\n\t\t\t<ion-row align-items-center justify-content-center>\n\t\t\t\t<button ion-button (tap)=\"openShareSheet(imageUrl)\" clear color=\"white\">\n\t\t\t\t\t<ion-icon name=\"share\"></ion-icon>\n\t\t\t\t</button>\n\t\t\t</ion-row>\n\t\t</ion-footer>\n\t",
                    styles: ['image-viewer.ion-page { position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: flex; flex-direction: column; height: 100%; opacity: 1; } image-viewer.ion-page ion-navbar.toolbar .toolbar-background { background-color: transparent; } image-viewer.ion-page ion-navbar.toolbar.toolbar-ios { padding-top: calc(20px + 4px); } image-viewer.ion-page ion-navbar .bar-button-default { color: white; } image-viewer.ion-page .backdrop { will-change: opacity; } image-viewer.ion-page .image-wrapper { position: relative; z-index: 10; display: flex; overflow: hidden; flex-direction: column; pointer-events: none; margin-top: 56px; flex-grow: 1; justify-content: center; } image-viewer.ion-page .image { will-change: transform; } image-viewer.ion-page img { display: block; pointer-events: auto; max-width: 100%; max-height: 100vh; margin: 0 auto; } image-viewer.ion-page ion-footer { bottom: 20px; } '],
                    providers: [SocialSharing],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    ImageViewerComponent.ctorParameters = function () { return [
        { type: GestureController, },
        { type: ElementRef, },
        { type: NavController, },
        { type: NgZone, },
        { type: Renderer, },
        { type: DomController, },
        { type: Platform, },
        { type: NavParams, },
        { type: SocialSharing, },
        { type: ToastController, },
        { type: Events, },
        { type: Config, },
        { type: DomSanitizer, },
    ]; };
    ImageViewerComponent.propDecorators = {
        "imageContainer": [{ type: ViewChild, args: ['imageContainer',] },],
        "image": [{ type: ViewChild, args: ['image',] },],
        "deletable": [{ type: Input },],
        "shareable": [{ type: Input },],
        "sendShareEvent": [{ type: Input },],
    };
    return ImageViewerComponent;
}(Ion));
export { ImageViewerComponent };
//# sourceMappingURL=image-viewer.component.js.map