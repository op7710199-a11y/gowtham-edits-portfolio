import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink-950 px-6 text-center">
          <div className="font-display text-5xl font-extrabold">
            <span className="text-white">Gowtham</span>
            <span className="text-gold-400">edits</span>
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold text-white">
              Something went wrong
            </h1>
            <p className="max-w-md text-sm text-stone-400">
              An unexpected error occurred. Try refreshing the page — if the
              problem persists, contact support.
            </p>
          </div>
          <button
            onClick={this.handleReload}
            className="rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-ink-950 transition-all hover:shadow-[0_0_30px_rgba(198,146,33,0.4)]"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
