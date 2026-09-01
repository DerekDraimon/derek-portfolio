import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Portrait from './Portrait.jsx';

describe('Portrait', () => {
  it('renders the portrait image with its alt text', () => {
    render(<Portrait />);
    expect(screen.getByAltText('Derek en una playa de Brasil, de noche')).toBeInTheDocument();
  });
});
