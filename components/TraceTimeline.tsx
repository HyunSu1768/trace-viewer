import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Span } from '../types';
import getColorForService from '../utils/colors';

interface TraceTimelineProps {
    spans: Span[];
}

const TraceTimeline: React.FC<TraceTimelineProps> = ({ spans }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
        const width = svgRef.current.clientWidth;
        const height = spans.length * 40 + 50; // Adjust height based on number of spans
        svg.attr('height', height);

        const traceStartTime = Math.min(...spans.map(span => Number(span.startTimeUnixNano) / 1e6));
        const traceEndTime = Math.max(...spans.map(span => Number(span.endTimeUnixNano) / 1e6));
        const totalDuration = traceEndTime - traceStartTime;

        const xScale = d3.scaleLinear()
            .domain([0, totalDuration])
            .range([0, width]);

        // Sort spans by start time
        const sortedSpans = spans.slice().sort((a, b) => (Number(a.startTimeUnixNano) - Number(b.startTimeUnixNano)));

        svg.selectAll('*').remove();

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 10])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on('zoom', (event) => {
                const newXScale = event.transform.rescaleX(xScale);
                svg.selectAll<SVGRectElement, Span>('.span-bar')
                    .attr('x', (d) => newXScale((Number(d.startTimeUnixNano) / 1e6) - traceStartTime))
                    .attr('width', (d) => newXScale((Number(d.endTimeUnixNano) / 1e6) - traceStartTime) - newXScale((Number(d.startTimeUnixNano) / 1e6) - traceStartTime));

                svg.selectAll<SVGTextElement, Span>('.span-label')
                    .attr('x', (d) => newXScale((Number(d.startTimeUnixNano) / 1e6) - traceStartTime) + 5)
                    .text((d) => {
                        const spanWidth = newXScale((Number(d.endTimeUnixNano) / 1e6) - traceStartTime) - newXScale((Number(d.startTimeUnixNano) / 1e6) - traceStartTime);
                        const durationText = `${((Number(d.endTimeUnixNano) - Number(d.startTimeUnixNano)) / 1e6).toFixed(2)} ms`;
                        const nameText = d.name;
                        const combinedText = `${nameText} (${durationText})`;
                        return combinedText.length * 6 > spanWidth ? `${nameText.slice(0, Math.floor(spanWidth / 12))}...` : combinedText;
                    });

                svg.selectAll<SVGGElement, unknown>('.x-axis').call(d3.axisBottom(newXScale).tickFormat((d) => `${d} ms`));
            });

        svg.call(zoom);

        svg.append('g')
            .attr('transform', `translate(0,${height - 30})`)
            .attr('class', 'x-axis')
            .call(d3.axisBottom(xScale).tickFormat((d) => `${d} ms`));

        const spanGroups = svg.selectAll<SVGGElement, Span>('.span-group')
            .data(sortedSpans)
            .enter()
            .append('g')
            .attr('class', 'span-group')
            .attr('transform', (_, i) => `translate(0, ${i * 32})`);

        spanGroups.append('rect')
            .attr('class', 'span-bar')
            .attr('x', (d) => xScale((Number(d.startTimeUnixNano) / 1e6) - traceStartTime))
            .attr('width', (d) => xScale((Number(d.endTimeUnixNano) / 1e6) - traceStartTime) - xScale((Number(d.startTimeUnixNano) / 1e6) - traceStartTime))
            .attr('height', 30)
            .attr('fill', (d) => getColorForService(d.attributes.find(attr => attr.key === 'service.name')?.value.stringValue || 'unknown'))
            .append('title')
            .text((d) => `${d.name}: ${((Number(d.endTimeUnixNano) - Number(d.startTimeUnixNano)) / 1e6).toFixed(2)} ms`);

        spanGroups.append('text')
            .attr('class', 'span-label')
            .attr('x', (d) => xScale((Number(d.startTimeUnixNano) / 1e6) - traceStartTime) + 5)
            .attr('y', 20)
            .text((d) => {
                const spanWidth = xScale((Number(d.endTimeUnixNano) / 1e6) - traceStartTime) - xScale((Number(d.startTimeUnixNano) / 1e6) - traceStartTime);
                const durationText = `${((Number(d.endTimeUnixNano) - Number(d.startTimeUnixNano)) / 1e6).toFixed(2)} ms`;
                const nameText = d.name;
                const combinedText = `${nameText} (${durationText})`;
                return combinedText.length * 6 > spanWidth ? `${nameText.slice(0, Math.floor(spanWidth / 12))}...` : combinedText;
            })
            .style('fill', '#fff')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('text-anchor', 'start');
    }, [spans]);

    return (
        <svg ref={svgRef} width="100%"></svg>
    );
};

export default TraceTimeline;
