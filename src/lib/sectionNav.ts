type PickActiveIdInput = {
  ids: string[];
  visibleIds: string[];
  atBottom: boolean;
  current: string | undefined;
};

export function pickActiveId({ ids, visibleIds, atBottom, current }: PickActiveIdInput): string | undefined {
  if (ids.length === 0) return undefined;
  if (atBottom) return ids[ids.length - 1];
  const firstVisible = ids.find((id) => visibleIds.includes(id));
  if (firstVisible) return firstVisible;
  return current ?? ids[0];
}
