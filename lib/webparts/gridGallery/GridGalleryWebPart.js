"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file
 * Grid Gallery Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("gridGalleryStrings");
var SPPicturesListService_1 = require("./SPPicturesListService");
//Imports property pane custom fields
var PropertyFieldSPListQuery_1 = require("sp-client-custom-fields/lib/PropertyFieldSPListQuery");
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldAlignPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldAlignPicker");
var PropertyFieldDimensionPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldDimensionPicker");
//Loads external JS libs
var $ = require("jquery");
require('unitegallery');
require('ug-theme-grid');
//Loads external CSS files
require('../../css/unitegallery/unite-gallery.scss');
var GridGalleryWebPart = (function (_super) {
    __extends(GridGalleryWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function GridGalleryWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(GridGalleryWebPart.prototype, "dataVersion", {
        /**
         * @function
         * Gets WP data version
         */
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @function
     * Renders HTML code
     */
    GridGalleryWebPart.prototype.render = function () {
        var _this = this;
        if (this.properties.query == null || this.properties.query == '') {
            //Display select a list message
            this.domElement.innerHTML = "\n        <div class=\"ms-MessageBar\">\n          <div class=\"ms-MessageBar-content\">\n            <div class=\"ms-MessageBar-icon\">\n              <i class=\"ms-Icon ms-Icon--Info\"></i>\n            </div>\n            <div class=\"ms-MessageBar-text\">\n              " + strings.ErrorSelectList + "\n            </div>\n          </div>\n        </div>\n      ";
            return;
        }
        this.renderContents();
        var picturesListService = new SPPicturesListService_1.SPPicturesListService(this.properties, this.context);
        //Load the list of pictures from the current lib
        var queryUrl = this.properties.query;
        queryUrl += "$expand=File&$select=Title,Description,id,File,FileSystemObjectType";
        picturesListService.getPictures(queryUrl)
            .then(function (response) {
            var responseVal = response.value;
            var outputHtml = '';
            outputHtml += "\n              <div id=\"" + _this.guid + "-gallery\" style=\"display:none;\">\n          ";
            responseVal.map(function (object, i) {
                //Select the best Alt text with title, description or file's name
                var altText = object.Title;
                if (altText == null || altText == '')
                    altText = object.Description;
                if (altText == null || altText == '')
                    altText = object.File.Name;
                //Render the item
                outputHtml += "\n                <img alt=\"" + altText + "\" src=\"" + object.File.ServerRelativeUrl + "\"\n                  data-image=\"" + object.File.ServerRelativeUrl + "\"\n                  data-description=\"" + altText + "\">\n            ";
            });
            outputHtml += '</div>';
            _this.domElement.innerHTML = outputHtml;
            _this.renderContents();
        });
    };
    GridGalleryWebPart.prototype.renderContents = function () {
        var width = Number(this.properties.tileDimension.width.replace("px", "").replace("%", ""));
        var height = Number(this.properties.tileDimension.height.replace("px", "").replace("%", ""));
        $("#" + this.guid + "-gallery").unitegallery({
            gallery_theme: "grid",
            slider_enable_arrows: this.properties.enableArrows,
            slider_enable_bullets: this.properties.enableBullets,
            slider_enable_progress_indicator: this.properties.enableProgressIndicator,
            slider_enable_play_button: this.properties.enablePlayButton,
            slider_enable_fullscreen_button: this.properties.enableFullscreenButton,
            slider_enable_zoom_panel: this.properties.enableZoomPanel,
            slider_controls_always_on: this.properties.controlsAlwaysOn,
            theme_panel_position: this.properties.position,
            gallery_autoplay: this.properties.autoplay,
            thumb_border_effect: this.properties.enableBorder,
            thumb_border_width: this.properties.border,
            thumb_border_color: this.properties.borderColor,
            slider_enable_text_panel: this.properties.textPanelEnable,
            slider_textpanel_always_on: this.properties.textPanelAlwaysOnTop,
            slider_textpanel_bg_color: this.properties.textPanelBackgroundColor,
            slider_textpanel_bg_opacity: this.properties.textPanelOpacity,
            slider_textpanel_title_color: this.properties.textPanelFontColor,
            slider_textpanel_title_font_family: this.properties.textPanelFont,
            slider_textpanel_title_text_align: this.properties.textPanelAlign,
            gallery_play_interval: this.properties.speed,
            gallery_pause_on_mouseover: this.properties.pauseOnMouseover,
            tile_enable_icons: this.properties.enableIcons,
            thumb_width: width,
            thumb_height: height,
            grid_num_cols: this.properties.numCols,
            slider_textpanel_title_font_size: this.properties.textPanelFontSize != null ? this.properties.textPanelFontSize.replace("px", "") : ''
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    GridGalleryWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    GridGalleryWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    GridGalleryWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPageGeneral
                    },
                    displayGroupsAsAccordion: true,
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyFieldSPListQuery_1.PropertyFieldSPListQuery('query', {
                                    label: '',
                                    query: this.properties.query,
                                    includeHidden: false,
                                    baseTemplate: 109,
                                    orderBy: PropertyFieldSPListQuery_1.PropertyFieldSPListQueryOrderBy.Title,
                                    showOrderBy: true,
                                    showMax: true,
                                    showFilters: true,
                                    max: 100,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: "gridGallerySPListField"
                                })
                            ]
                        },
                        {
                            groupName: strings.GeneralGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneDropdown('position', {
                                    label: strings.Position,
                                    options: [
                                        { key: 'top', text: 'top' },
                                        { key: 'bottom', text: 'bottom' },
                                        { key: 'left', text: 'left' },
                                        { key: 'right', text: 'right' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('numCols', {
                                    label: strings.NumCols,
                                    min: 1,
                                    max: 6,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enableArrows', {
                                    label: strings.EnableArrows
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enableBullets', {
                                    label: strings.EnableBullets
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enableProgressIndicator', {
                                    label: strings.EnableProgressIndicator
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enablePlayButton', {
                                    label: strings.EnablePlayButton
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enableFullscreenButton', {
                                    label: strings.EnableFullscreenButton
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enableZoomPanel', {
                                    label: strings.EnableZoomPanel
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('controlsAlwaysOn', {
                                    label: strings.ControlsAlwaysOn
                                }),
                                PropertyFieldDimensionPicker_1.PropertyFieldDimensionPicker('tileDimension', {
                                    label: strings.TileDimension,
                                    initialValue: this.properties.tileDimension,
                                    preserveRatio: true,
                                    preserveRatioEnabled: true,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    disabled: false,
                                    onGetErrorMessage: null,
                                    deferredValidationTime: 0,
                                    key: 'gridGalleryDimensionFieldId'
                                })
                            ]
                        },
                        {
                            groupName: strings.EffectsGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('pauseOnMouseover', {
                                    label: strings.PauseOnMouseover
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('autoplay', {
                                    label: strings.Autoplay
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('speed', {
                                    label: strings.Speed,
                                    min: 0,
                                    max: 7000,
                                    step: 100
                                })
                            ]
                        }
                    ]
                },
                {
                    header: {
                        description: strings.PropertyPageTextPanel
                    },
                    groups: [
                        {
                            groupName: strings.TextPanelGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('textPanelEnable', {
                                    label: strings.TextPanelEnableFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('textPanelAlwaysOnTop', {
                                    label: strings.TextPanelAlwaysOnTopFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('textPanelOpacity', {
                                    label: strings.TextPanelOpacityFieldLabel,
                                    min: 0,
                                    max: 1,
                                    step: 0.1
                                }),
                                PropertyFieldAlignPicker_1.PropertyFieldAlignPicker('textPanelAlign', {
                                    label: strings.TextPanelAlignFieldLabel,
                                    initialValue: this.properties.textPanelAlign,
                                    onPropertyChanged: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "gridGalleryAlignField"
                                }),
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('textPanelFont', {
                                    label: strings.TextPanelFontFieldLabel,
                                    initialValue: this.properties.textPanelFont,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "gridGalleryFontField"
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('textPanelFontSize', {
                                    label: strings.TextPanelFontSizeFieldLabel,
                                    initialValue: this.properties.textPanelFontSize,
                                    usePixels: true,
                                    preview: true,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "gridGalleryFontSizeField"
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('textPanelFontColor', {
                                    label: strings.TextPanelFontColorFieldLabel,
                                    initialColor: this.properties.textPanelFontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "gridGalleryFontColorField"
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('textPanelBackgroundColor', {
                                    label: strings.TextPanelBackgroundColorFieldLabel,
                                    initialColor: this.properties.textPanelBackgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "gridGalleryBgColorField"
                                })
                            ]
                        }
                    ]
                },
                {
                    header: {
                        description: strings.PropertyPageBorder
                    },
                    groups: [
                        {
                            groupName: strings.BorderGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('enableBorder', {
                                    label: strings.EnableBorderFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('border', {
                                    label: strings.BorderFieldLabel,
                                    min: 0,
                                    max: 50,
                                    step: 1
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('borderColor', {
                                    label: strings.BorderColorFieldLabel,
                                    initialColor: this.properties.borderColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "gridGalleryBorderColorField"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return GridGalleryWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = GridGalleryWebPart;

//# sourceMappingURL=GridGalleryWebPart.js.map
