/* eslint-disable no-use-before-define, no-unused-vars, no-undef, camelcase */

declare var __webpack_init_sharing__: any;
declare var __webpack_share_scopes__: any;
declare var seajs: any;
declare var requirejs: any;

// eslint-disable-next-line no-undef
declare interface Window {
  syncModuleList: Array<{
    scope: () => string;
    module: string;
    windowKey: string;
  }>;
  __development_portal_module_list__: Array<string>;
  __development_portal_remote_path__: string;
  __development_portal_library__: string;
  __development_portal_version__: string;
}
