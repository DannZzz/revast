import { SwitchLabelOption } from "../../components/SwitchLabel/SwitchLabel"

export const modeSwitchOptions: SwitchLabelOption[] = [
  {
    id: "normal",
    label: "Normal",
    checked: true,
  },
  {
    id: "beta",
    label: "Beta",
  },
]

export const dateFilterOptions: SwitchLabelOption[] = [
  {
    id: "last-day",
    label: "Last Day",
    checked: true,
  },
  {
    id: "all-time",
    label: "All Time",
  },
]

export const typeFilterOptions: SwitchLabelOption[] = [
  {
    id: "xp",
    label: "Points",
    checked: true,
  },
  {
    id: "days",
    label: "Survived Days",
  },
]
