import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { render, screen, act, waitFor } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';
import { AppLayout } from '../../../src/components/Layout';
import Contributions from '../../../src/pages/app/contributions';
import { ContributionsBox } from '../../../src/components/Contributions';
import { Contribution } from '../../../src/pages/app/contributions';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);

jest.mock('../../../src/components/Contributions/ContributionsBox.tsx');
getMock(ContributionsBox).mockImplementation(({...contribution}) => <p>Box Row</p>);

const mockCurrentUser = {
  id: 1,
}

const contributionList: Contribution[] = [
  {
    id: '1',
    nodeID: 'PR_00000',
    description: 'Pizza but a construct of the mind',
    type: 'CLOSED',
    score: 1,
    contributedAt: new Date('1612-04-20'),
    url: 'abc.com',
  },
  {
    id: '2',
    nodeID: 'PR_54321',
    description: 'Count 5 to 1',
    type: 'OPEN',
    score: 1,
    contributedAt: new Date('2022-09-12'),
    url: 'onetofive.com',
  },
];

// Wait utility
const wait = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

describe('contribution page', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('renders an error message when /api/users/me returns status 401 (user not logged in)', async () => {
    fetchMock.get('/api/users/me', 401)
    fetchMock.get(`/api/contributions?userId=${mockCurrentUser.id}`, []);

    expect(() => render(<Contributions />)).not.toThrow();

    // Wait for fetch
    await waitFor(() => {
      expect(ContributionsBox).toBeCalledTimes(0);
      expect(screen.getByText('You must be logged in to view your contributions.')).toBeVisible();
    });
  });

  it('renders an error message when /api/users/me returns status 500', async () => {
    fetchMock.get('/api/users/me', 500)
    fetchMock.get(`/api/contributions?userId=${mockCurrentUser.id}`, []);

    expect(() => render(<Contributions />)).not.toThrow();

    // Wait for fetch
    await waitFor(() => {
      expect(ContributionsBox).toBeCalledTimes(0);
      expect(screen.getByText('An error occurred getting your contributions. Please try again.')).toBeVisible();
    });
  });

  it('renders an error message when fetching /api/users/me throws', async () => {
    fetchMock.get('/api/users/me', () => {
      throw new Error('');
    });
    fetchMock.get(`/api/contributions?userId=${mockCurrentUser.id}`, []);

    expect(() => render(<Contributions />)).not.toThrow();

    // Wait for fetch
    await waitFor(() => {
      expect(ContributionsBox).toBeCalledTimes(0);
      expect(screen.getByText('An error occurred getting your contributions. Please try again.')).toBeVisible();
    });
  });

  it('renders the table properly when no contributions are present', async () => {
    fetchMock.get('/api/users/me', mockCurrentUser)
    fetchMock.get(`/api/contributions?userId=${mockCurrentUser.id}`, []);

    expect(() => render(<Contributions />)).not.toThrow();

    // Wait for fetch
    await waitFor(() => {
      expect(ContributionsBox).toBeCalledTimes(0);
      expect(screen.getByText('No Contributions Found')).toBeVisible();
    });
  });

  it('renders the table properly when contributions are returned', async () => {
    fetchMock.get('/api/users/me', mockCurrentUser)
    fetchMock.mock().getOnce(`/api/contributions?userId=${mockCurrentUser.id}`, contributionList);
    expect(() => render(<Contributions />)).not.toThrow();

    // Wait for fetch
    await waitFor(() => expect(screen.getAllByText('Box Row').length).toEqual(2));
  });
});
