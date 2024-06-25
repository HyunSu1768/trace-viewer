// pages/_app.tsx
import * as React from 'react';
import { AppProps } from 'next/app';
import { CssBaseline } from '@mui/material';
import Head from 'next/head';

const MyApp: React.FC<AppProps> = (props) => {
    const { Component, pageProps } = props;

    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <title>OpenTelemetry Traces Viewer</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <CssBaseline />
            <Component {...pageProps} />
        </>
    );
};

export default MyApp;
