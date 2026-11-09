import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {error: Error | null}
> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = {error: null};
  }

  static getDerivedStateFromError(error: Error) {
    return {error};
  }

  render() {
    if (this.state.error) {
      return (
        <div className="w-screen h-screen bg-sky-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-xl font-bold text-amber-300 mb-2">Something went wrong</h1>
          <p className="text-sm text-slate-300 mb-4 max-w-md">{this.state.error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sky-600 rounded-xl text-sm font-semibold"
          >
            Reload Game
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
