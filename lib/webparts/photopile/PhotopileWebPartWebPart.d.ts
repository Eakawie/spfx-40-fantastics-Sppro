import { BaseClientSideWebPart, IPropertyPaneConfiguration, IWebPartContext } from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';
import { IPhotopileWebPartWebPartProps } from './IPhotopileWebPartWebPartProps';
/**
 * @class
 * Defines the Photopile client side web part
 */
export default class PhotopileWebPartWebPart extends BaseClientSideWebPart<IPhotopileWebPartWebPartProps> {
    /**
     * @var
     * Stores the list of SharePoint Pictures library found in the current SP web
     */
    private listsDropdownOptions;
    /**
     * @function
     * Web Part constructor
     */
    constructor(context?: IWebPartContext);
    /**
     * @function
     * Gets WP data version
     */
    protected readonly dataVersion: Version;
    /**
     * @function
     * Function called when the web part is inialized
     */
    onInit<T>(): Promise<T>;
    /**
     * @function
     * Renders the web part
     */
    render(): void;
    /**
     * @function
     * Prevent from changing the pane properties on typing
     */
    protected readonly disableReactivePropertyChanges: boolean;
    /**
     * @function
     * Gets the web part properties panel settings
     */
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
