import { Component } from "react";

export default class AdminErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="admin-panel admin-panel--error">
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button type="button" className="ve-btn ve-btn--primary" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
