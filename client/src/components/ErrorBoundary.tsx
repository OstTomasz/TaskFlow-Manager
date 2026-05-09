// client/src/components/ErrorBoundary.tsx
import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches rendering errors in the component tree.
 * Displays a fallback UI instead of crashing the whole app.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="w-[90dvw] md:w-80 comic-panel flex flex-col items-center gap-(--space-sm) p-(--space-md) max-w-sm mx-auto mt-10 text-center">
            <AlertTriangle className="w-12 h-12 text-error" />
            <p className="font-bold text-lg">Something went wrong</p>
            <p className="text-sm text-(--text-muted)">
              {this.state.error?.message}
            </p>
            <button
              className="comic-btn comic-btn-primary"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
