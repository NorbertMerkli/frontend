# Frontend experiment

This monorepo includes experimental projects I use to explore and learn about frontend technologies. Although some have tests to verify functionality, they are not meant for production use.

## Packages

### signal-core

A simple state management system to achieve fine-grained reactivity. Designed to work with vanilla JavaScript, but can be used with any framework via custom adapters. The goal is to provide basic primitives to build a reactive state graph that can be attached to the user interface.

The **Signal** is the basic primitive. The value can be gotten and set at any point in time, but listeners can be registered to be notified when a new value exists.

The **DerivedSignal** can be used to combine values or subscribe to a subset of a complex object. The value cannot be set manually; rather, it updates automatically when any of the dependencies change.

The **LinkedSignal** is the combination of the first two primitives. It updates when the linked value changes, but can be set manually as well.

### signal-react

The adapter that integrates the reactive system of the **signal-core** package into React.

## Examples

### react

This example project demonstrates how React's built-in state management can lead to unnecessary rerenders and how we can enhance performance by utilizing more advanced techniques. The app uses react-scan to visualize these rerenders.

> The **signal-react** package isn't very user-friendly right now - it's pretty clunky when you need to work with parts of an object. The improvements we need will require some research.
