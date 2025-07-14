# Frontend experiment

This monorepo includes experimental projects I use to explore and learn about frontend technologies. Although some have tests to verify functionality, they are not meant for production use.

## Packages

### State

A simple state management system to achieve fine-grained reactivity. Designed to work with vanilla JavaScript, but can be used with any framework via custom adapters. The goal is to provide basic primitives to build a reactive state graph that can be attached to the user interface.

The **State** is the basic primitive. The value can be gotten and set at any point in time, but listeners can be registered to be notified when a new value exists.

The **DerivedState** can be used to combine values or subscribe to a subset of a complex object. The value cannot be set manually; rather, it updates automatically when any of the dependencies change.

The **LinkedState** is the combination of the first two primitives. It updates when the linked value changes, but can be set manually as well.
