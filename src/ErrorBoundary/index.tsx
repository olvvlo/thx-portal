import React from 'react'
// import styled from 'styled-components'

// const StyledMessage = styled.div`
//   color: var(--color-error-3);
// `

export function boundary (Component) {
  return function (props) {
    return <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  }
}

interface ErrorBoundaryProps {
  componentName?: string;
  [key: string]: any;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, any> {
  constructor (props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: false }
  }

  static getDerivedStateFromError (error: any) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch (error, errorInfo) {
    console.error(error, errorInfo)
  }

  render (): any {
    if (this.state.error) {
      if (process.env.NODE_ENV !== 'development') return null
      return (
        // <StyledMessage>
        <div style={{ color: 'var(--color-error-3)' }}>
          {this.props.componentName || '-'}
          <span>: </span>
          {this.state.error.message}
        </div>
        // </StyledMessage>
      )
    }

    return this.props.children
  }
}
