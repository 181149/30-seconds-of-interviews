import { h } from "hyperapp"
import { cc } from "../utils"
import feather from "feather-icons"

export default ({ type, icon }, children) => (state, actions) => (
  <button
    class={cc(`btn FilterButton is-${type}`, {
      "is-active": state.filter === type,
      "is-all": type === "all"
    })}
    onclick={() => actions.setFilter(type)}
    data-tooltip={
      type === "all" ? "No filter" : `Display only ${type} questions`
    }
  >
    {children}
    <i innerHTML={feather.icons[icon].toSvg({ class: "btn__icon" })} />
  </button>
)
