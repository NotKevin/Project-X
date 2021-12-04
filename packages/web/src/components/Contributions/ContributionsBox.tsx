import React from 'react';
import { Box, Link } from '@chakra-ui/react';

export interface ContributionsBoxProps {
  contribution: {
    id: string;
    nodeID: string;
    type: string;
    score: number;
    contributedAt: Date;
    description: string | null;
    url: string;
  }
}

export const ContributionsBox: React.FC<ContributionsBoxProps> = ({
  contribution
}) => {
  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" key={contribution.id}>
      <Box p="6">
        <Box
          color="gray.500"
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="xs"
          textTransform="uppercase"
        >
          {contribution.type}
        </Box>

        <Box
          letterSpacing="wide"
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
          color="cyan.500"
        >
          <Link href={contribution.url} isExternal>
            {contribution.description}
          </Link>
        </Box>
        <Box mt="1">Score: {contribution.score}</Box>
        <Box mt="1" color="gray" fontSize="xs">
          {contribution.contributedAt.toString().slice(0, 10)}
        </Box>
      </Box>
    </Box>
  );
};
