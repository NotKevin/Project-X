import React from 'react';
import { render, screen, act } from '../../../testUtils/testTools';
import UserProfilePage, { User } from '../../../../src/pages/user/[uid]';
import fetchMock from 'fetch-mock-jest';
import { UserProfile, UserProfileProps } from '../../../../src/components/userprofile/UserProfile';
import { getMock } from '../../../testUtils/getMock';
import { NavProfileMenu } from '../../../../src/components/NavBar/NavProfileMenu';

jest.mock('../../../../src/components/userprofile/UserProfile');
getMock(UserProfile).mockImplementation(({ user }) => <div>{user.name}</div>);
jest.mock('../../../../src/components/NavBar/NavProfileMenu');
getMock(NavProfileMenu).mockImplementation(() => <div>Nav Bar Menu</div>);

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: '',
    };
  },
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

const sampleUser: UserProfileProps['user'] = {
  id: '123',
  name: 'Steve Job',
  pronouns: 'he/him',
  schoolName: 'Apple University',
};

const wait = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

describe('web /user/', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('outputs error given non-numeric or no uid', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: 'abc' },
    }));

    fetchMock.getOnce('/api/users/abc', 400);
    fetchMock.getOnce('/api/users/me', 401);

    expect(() => render(<UserProfilePage />)).not.toThrow();

    await act(wait);
    expect(UserProfile).toBeCalledTimes(0);
    expect(screen.getByText('User id malformed'));
  });

  it('outputs error given non-existant user id', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: '0' },
    }));

    fetchMock.getOnce('/api/users/0', 404);
    fetchMock.getOnce('/api/users/me', 401);

    expect(() => render(<UserProfilePage />)).not.toThrow();

    await act(wait);
    expect(UserProfile).toBeCalledTimes(0);
    expect(screen.getByText('User could not be found'));
  });

  it('outputs user profile info given valid user id', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: '0' },
    }));

    fetchMock.getOnce('/api/users/0', sampleUser);
    fetchMock.get('/api/users/me', sampleUser);

    expect(() => render(<UserProfilePage />)).not.toThrow();

    await act(wait);

    expect(UserProfile).toBeCalledTimes(2);
    expect(screen.getByText('Steve Job')).toBeVisible();
  });
});
