import { readFile } from "node:fs/promises";
import path from "node:path";

export function readPretendard(): Promise<Buffer> {
  return readFile(path.join(process.cwd(), "node_modules/pretendard/dist/web/static/woff/Pretendard-Bold.woff"));
}
