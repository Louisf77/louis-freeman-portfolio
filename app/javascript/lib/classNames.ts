export default function classNames(...names: (false | null | string | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}
