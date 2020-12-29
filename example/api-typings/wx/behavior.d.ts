// https://github.com/wx-minapp/minapp-wx/blob/master/typing/behavior.d.ts
/// <reference path="./component.d.ts" />

interface Behavior {

}
declare interface BehaviorConstructor {
    new(): Behavior
    (options: Component.Options): Behavior
}
declare var Behavior: BehaviorConstructor