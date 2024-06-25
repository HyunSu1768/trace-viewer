// types.ts
export interface OpenTelemetryResponse {
    batches: Batch[];
}

export interface Batch {
    resource: Resource;
    scopeSpans: ScopeSpan[];
}

export interface Resource {
    attributes: Attribute[];
}

export interface Attribute {
    key: string;
    value: AttributeValue;
}

export interface AttributeValue {
    stringValue?: string;
    intValue?: number;
    arrayValue?: {
        values: AttributeValue[];
    };
}

export interface ScopeSpan {
    scope: Scope;
    spans: Span[];
}

export interface Scope {
    name: string;
    version: string;
}

export interface Span {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    name: string;
    kind: string;
    startTimeUnixNano: string;
    endTimeUnixNano: string;
    attributes: Attribute[];
    status: Record<string, unknown>;
}
