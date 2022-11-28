import { EXAMPLE_PATH } from '@/lib/sanity/constants';
import { Box, Container, Link, Text } from '@chakra-ui/react';
import cn from 'classnames';
import { FC } from 'react';

interface IPreviewAlertProps {
	preview: boolean;
}

export const PreviewAlert: FC<IPreviewAlertProps> = ({ preview }) => {
	return (
		<Box bgColor="primary.400" py={4} color="white">
			<Container maxW="container.xl">
				<Text align="center">
					{preview ? (
						<>
							This page is a preview. <Link href="/api/exit-preview">Click here</Link> to exit preview mode.
						</>
					) : (
						<>
							The source code for this blog is{' '}
							<a
								href={`https://github.com/vercel/next.js/tree/canary/examples/${EXAMPLE_PATH}`}
								className="underline hover:text-success duration-200 transition-colors"
							>
								available on GitHub
							</a>
							.
						</>
					)}
				</Text>
			</Container>
		</Box>
	);
};
