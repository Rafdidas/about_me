import { Button } from "./Button";

type ErrorStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorState({ title, description, actionLabel, onAction }: ErrorStateProps) {
  return (
    <div className="c-state c-state--error" role="alert">
      <strong>{title}</strong>
      <p>{description}</p>
      {actionLabel ? (
        <Button type="button" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
