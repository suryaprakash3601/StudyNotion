import React from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-richblack-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-richblack-800 rounded-2xl p-8 border border-richblack-700 shadow-xl">
              {/* Error icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-pink-900/30 rounded-full flex items-center justify-center border border-pink-500/30">
                  <span className="text-4xl">⚠️</span>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-richblack-5 mb-3">
                Something went wrong
              </h1>
              <p className="text-richblack-300 text-sm mb-6 leading-relaxed">
                An unexpected error occurred. Please try refreshing the page or
                navigating back to the home page.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left mb-6">
                  <summary className="text-xs text-richblack-400 cursor-pointer hover:text-richblack-200 mb-2">
                    Error details (development)
                  </summary>
                  <pre className="text-xs text-pink-400 bg-richblack-900 rounded-lg p-3 overflow-auto max-h-32">
                    {this.state.error?.toString()}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-5 py-2.5 bg-yellow-50 text-richblack-900 font-semibold rounded-lg hover:bg-yellow-100 transition-colors duration-200 text-sm"
                >
                  Try Again
                </button>
                <Link
                  to="/"
                  onClick={this.handleReset}
                  className="px-5 py-2.5 bg-richblack-700 text-richblack-5 font-semibold rounded-lg hover:bg-richblack-600 transition-colors duration-200 text-sm"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
