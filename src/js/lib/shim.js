// keep these references, they might be directly referenced by other plugins
export let knockout = window.ko;
export let jQuery = window.$;
export let lodash = window._;

// remove other references from window, to force manual import
/*export let SchemaInspector = window.SchemaInspector;
delete window.SchemaInspector;*/
