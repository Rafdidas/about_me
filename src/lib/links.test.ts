import { describe, expect, it } from "vitest";
import { getExternalLinkProps, isExternalHref } from "./links";

describe("link helpers", () => {
  it("detects absolute http urls as external links", () => {
    expect(isExternalHref("https://github.com/rafdidas")).toBe(true);
    expect(isExternalHref("http://example.com")).toBe(true);
    expect(isExternalHref("/projects")).toBe(false);
    expect(isExternalHref("mailto:yhu930421@naver.com")).toBe(false);
  });

  it("adds new tab attributes only for external links", () => {
    expect(getExternalLinkProps("https://poke-dex-next.vercel.app")).toEqual({
      target: "_blank",
      rel: "noreferrer"
    });
    expect(getExternalLinkProps("/projects")).toEqual({});
  });
});
