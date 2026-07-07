export function Skeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="c-skeleton" role="status" aria-label="로딩 중">
      {Array.from({ length: lines }, (_, index) => (
        <span className="c-skeleton__line" data-short={index === lines - 1} key={index} />
      ))}
    </div>
  );
}
