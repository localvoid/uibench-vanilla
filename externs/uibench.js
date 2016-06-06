/**
 * @typedef {{}}
 */
var HomeState;

/**
 * @typedef {{id: number, active: boolean, props: Array<string>}}
 */
var TableItemState;

/**
 * @typedef {{items: Array<TableItemState>}}
 */
var TableState;

/**
 * @typedef {{id: number, time: number}}
 */
var AnimBoxState;

/**
 * @typedef {{items: Array<AnimBoxState>}}
 */
var AnimState;

/**
 * @typedef {{id: number, container: boolean, children: Array<TreeNodeState>}}
 */
var TreeNodeState;

/**
 * @typedef {{root: TreeNodeState}}
 */
var TreeState;

/**
 * @typedef {{location: string, home: HomeState, table: TableState, anim: AnimState, tree: TreeState}}
 */
var AppState;

/**
 * @typedef {{init: function(string, string), run: function(function(AppState), function(*))}}
 */
var uibench;
