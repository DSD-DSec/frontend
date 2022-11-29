import themeOverrides from '@/styles/theme';
import { get } from '@/utils/network';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import { SWRConfig } from 'swr';
import { SessionProvider } from 'next-auth/react';

const extendedTheme = extendTheme(themeOverrides);

const DSecApp = ({ Component, pageProps: { session, ...pageProps } }) => (
	<SessionProvider session={session}>
		<ChakraProvider theme={extendedTheme}>
			<SWRConfig value={{ fetcher: get }}>
				<Component {...pageProps} />
			</SWRConfig>
		</ChakraProvider>
	</SessionProvider>
);

export default appWithTranslation(DSecApp);
