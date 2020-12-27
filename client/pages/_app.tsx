import { AppProps } from 'next/app';
import React from 'react';
import '../styles/globals.css';
import {ApolloProvider} from '@apollo/client';
import { useApollo } from "../utils/withApollo";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
	const apolloClient = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={apolloClient}>
			<Component {...pageProps} />
		</ApolloProvider>
	)
};

export default App;
