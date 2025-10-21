import { AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: "inline" | "card" | "banner";
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  title = "Error",
  message,
  variant = "inline",
  onRetry,
  className,
}: ErrorMessageProps) {
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive",
          className
        )}
        role="alert"
      >
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          <p className="mt-1 text-destructive/90">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-2"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-card p-8 text-center",
          className
        )}
        role="alert"
      >
        <div className="rounded-full bg-destructive/10 p-3">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-destructive">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // banner variant
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-md border border-destructive bg-destructive/10 p-4",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-destructive">{title}</p>
          <p className="text-sm text-destructive/90 mt-1">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Retry
        </Button>
      )}
    </div>
  );
}

interface ErrorPageProps {
  title?: string;
  message?: string;
  statusCode?: number;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export function ErrorPage({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
  statusCode,
  onGoBack,
  onGoHome,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8">
      <div className="rounded-full bg-destructive/10 p-4">
        <XCircle className="h-16 w-16 text-destructive" />
      </div>
      <div className="space-y-2 text-center">
        {statusCode && (
          <p className="text-sm font-medium text-muted-foreground">
            Error {statusCode}
          </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground max-w-md">{message}</p>
      </div>
      <div className="flex gap-3">
        {onGoBack && (
          <Button onClick={onGoBack} variant="outline">
            Go Back
          </Button>
        )}
        {onGoHome && (
          <Button onClick={onGoHome}>
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
}
