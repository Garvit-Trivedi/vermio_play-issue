import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-center p-6 sm:p-10">
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;