import { Component, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const errorId = Date.now();

    console.error("========== REACT ERROR ==========");
    console.error("Error ID:", errorId);
    console.error("Section:", this.props.name ?? "Unknown");
    console.error("Error:", error);
    console.error("Stack:", info.componentStack);
    console.error("================================");
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.name !== this.props.name && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
      });
    }
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="py-20">
          <div className="container-mx flex flex-col items-center justify-center gap-4 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-red-500/10 text-red-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Oops! Something went wrong.
            </h3>
            <p className="text-sm text-stone-400 max-w-md">
              We're having trouble loading this section right now.
              Please refresh the page or try again in a few moments.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-3 max-w-xl overflow-auto rounded-lg bg-red-950/40 p-3 text-left text-xs text-red-300">
                {this.state.error.stack || this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleRetry}
              className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs font-medium text-stone-300 transition-all hover:border-gold-500/30 hover:text-gold-100"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
