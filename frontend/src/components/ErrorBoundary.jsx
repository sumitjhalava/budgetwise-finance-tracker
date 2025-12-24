import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console; could be replaced with remote logging
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, background: "#fff6f6", borderRadius: 8 }}>
          <h4 style={{ margin: 0 }}>Unable to display chart</h4>
          <p style={{ margin: "8px 0 0 0" }}>
            Something went wrong while rendering the chart. Please refresh the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
