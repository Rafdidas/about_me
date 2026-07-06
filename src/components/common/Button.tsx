import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { getExternalLinkProps } from "@/lib/links";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
};

export function Button({ children, className = "", variant = "primary", isLoading = false, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`c-button c-button--${variant} ${className}`.trim()}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? <span className="c-button__loader" aria-label="처리 중" /> : children}
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  return (
    <Link className={`c-button c-button--${variant}`} href={href} {...getExternalLinkProps(href)}>
      {children}
    </Link>
  );
}
