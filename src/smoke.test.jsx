import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

function Greeting({ name }) {
  return <p>Hello, {name}!</p>;
}

describe('test harness smoke test', () => {
  it('renders a component into jsdom and asserts real text content', () => {
    render(<Greeting name="Derek" />);
    expect(screen.getByText('Hello, Derek!')).toBeInTheDocument();
  });

  it('renders a different prop value to prove the assertion is not trivial', () => {
    render(<Greeting name="Portfolio" />);
    expect(screen.getByText('Hello, Portfolio!')).toBeInTheDocument();
    expect(screen.queryByText('Hello, Derek!')).not.toBeInTheDocument();
  });
});
