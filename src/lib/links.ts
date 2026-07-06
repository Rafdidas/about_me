export function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

export function getExternalLinkProps(href: string) {
  return isExternalHref(href) ? { target: "_blank", rel: "noreferrer" } : {};
}
