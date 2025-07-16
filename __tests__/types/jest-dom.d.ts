import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toBeDisabled(): R
      toHaveValue(value: string | number | string[]): R
      toHaveAttribute(attr: string, value?: string): R
      toBeVisible(): R
      toHaveClass(className: string): R
      toHaveTextContent(text: string | RegExp): R
    }
  }
}
