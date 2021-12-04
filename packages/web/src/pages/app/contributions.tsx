import React from 'react';
import { NextPage } from 'next';
import { Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { AppLayout } from '../../components/Layout';
import { ContributionsBox } from '../../components/Contributions';
import { User } from '../user/[uid]';
import { use } from 'passport';

export interface Contribution {
  id: string;
  nodeID: string;
  type: string;
  score: number;
  contributedAt: Date;
  description: string | null;
  url: string;
}



const Contributions: NextPage = () => {
  const [contributions, setContributions] = React.useState<Contribution[]>([]);
  //const [user, setUser] = React.useState<User>();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isCurrentUser, setIsCurrentUser] = React.useState(false);
  const [errorCheckingCurrentUser, setErrorCheckingCurrentUser] = React.useState(false);

  

  React.useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const res = await fetch('/api/users/me');
  
        if (res.ok) {
          const data = await res.json();
  
          if (data.id) {
            return data.id
          }
        }
        // If an error was thrown inside the users/me api route
        else if (res.status == 500) {
          setErrorCheckingCurrentUser(true);
          setErrorMessage('An error occurred getting the current user. Please try again.');
        }
      } catch {
        setErrorCheckingCurrentUser(true);
        setErrorMessage('An error occurred getting the current user. Please try again.');
      }
      return null;
    };

    const fetchContributions = async () => {
      // Get all Contributions
        const userId = await getCurrentUserId();
        if (userId)
        {
          const res = await fetch(`/api/contributions?userId=${userId}`);
          const contributionsList = await res.json();

        // Set contribution list
        setContributions(contributionsList);
        }
      
    };

    fetchContributions();
  }, []);


    

  return (
    <AppLayout>
      <VStack spacing={3}>
        <Heading>Contributions</Heading>
      </VStack>
      {contributions.length <= 0 ? (
        <Text>No Contributions Found</Text>
      ) : (
        <SimpleGrid padding="4px" minChildWidth="250px" spacing="15px">
          {contributions.map((contribution) => (
            <ContributionsBox key={contribution.id} contribution={contribution} />
          ))}
        </SimpleGrid>
      )}
    </AppLayout>
  );
};

export default Contributions;
