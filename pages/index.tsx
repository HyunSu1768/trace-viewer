// pages/index.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, CircularProgress } from '@mui/material';
import { OpenTelemetryResponse, Batch, Span } from '../types';
import TraceTimeline from '../components/TraceTimeline';

const Home: React.FC = () => {
    const [spans, setSpans] = useState<Span[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTraceData = async () => {
            try {
                const response = await axios.get<OpenTelemetryResponse>('https://grafana-tempo.xquare.app/api/traces/14eacb0fc3aa2a3b5e5b1e05b93e10f8');
                const allSpans: Span[] = response.data.batches.flatMap(batch =>
                    batch.scopeSpans.flatMap(scopeSpan => scopeSpan.spans)
                );
                setSpans(allSpans);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trace data:', error);
                setLoading(false);
            }
        };

        fetchTraceData();
    }, []);

    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                OpenTelemetry Traces Viewer
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <TraceTimeline spans={spans} />
            )}
        </Container>
    );
};

export default Home;
