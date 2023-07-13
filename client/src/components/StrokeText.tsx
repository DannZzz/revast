import { JSX } from "solid-js"
import { Component } from "solid-js"

export const StrokeText: Component<JSX.HTMLAttributes<HTMLSpanElement>> = (
  props
) => {
  const { children, ...otherProps } = props
  return (
    <span stroke-text={children + ""} {...props}>
      {children}
    </span>
  )
}
