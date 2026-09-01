import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Certifications from './Certifications.jsx';

const mockCerts = [{ badge: 'AWS', title: 'AWS Cert', subtitle: 'Certificación' }];

describe('Certifications', () => {
  it('renders the certification title and badge from content data', () => {
    render(<Certifications certifications={mockCerts} />);
    expect(screen.getByRole('heading', { level: 3, name: 'AWS Cert' })).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });
});
