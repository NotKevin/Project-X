import React from 'react';
import { NextPage } from 'next';
import { Alert, AlertIcon, Heading, SimpleGrid, Stack, Text, VStack } from '@chakra-ui/react';
import { AppLayout } from '../../components/Layout';
import { ContributionsBox } from '../../components/Contributions';

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
  const [errorMessage, setErrorMessage] = React.useState('');
  const [errorCheckingCurrentUser, setErrorCheckingCurrentUser] = React.useState(false);

  

  React.useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const res = await fetch('/api/users/me');
  
        if (res.ok) {
          const data = await res.json();
  
          return data.id
        }
        else if(res.status == 401)
        {
          setErrorCheckingCurrentUser(true);
          setErrorMessage('You must be logged in to view your contributions.');
        }
        // If 404 (user doesn't exist) or 500 (error has thrown) status code returned
        else {
          setErrorCheckingCurrentUser(true);
          setErrorMessage('An error occurred getting your contributions. Please try again.');
        }
      } catch {
        setErrorCheckingCurrentUser(true);
        setErrorMessage('An error occurred getting your contributions. Please try again.');
      }
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
        <Stack>
          {errorCheckingCurrentUser ? (
            <Alert status="error">
            <AlertIcon />
            {errorMessage}
            </Alert>
          ) : (
            <Text>No Contributions Found</Text>
          )}
        </Stack>
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
