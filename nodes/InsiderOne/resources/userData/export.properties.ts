import type { INodeProperties } from 'n8n-workflow';

export const exportProperties: INodeProperties[] = [
	{
		displayName: 'Segment ID',
		name: 'segmentId',
		type: 'number',
		default: 0,
		required: true,
		description: 'The segment ID to export data for. Note: only dynamic segments are supported.',
		displayOptions: {
			show: { resource: ['userData'], operation: ['export'] },
		},
	},

	// --- JSON Parameters toggle ---
	{
		displayName: 'JSON Parameters',
		name: 'exportJsonParameters',
		type: 'boolean',
		default: false,
		description: 'Whether to pass attributes and events as raw JSON',
		displayOptions: {
			show: { resource: ['userData'], operation: ['export'] },
		},
	},

	// --- UI Mode: Get All Attributes ---
	{
		displayName: 'Get All Attributes',
		name: 'exportGetAllAttributes',
		type: 'boolean',
		default: false,
		description: 'Whether to return all attributes for the export (sends "*")',
		displayOptions: {
			show: { resource: ['userData'], operation: ['export'], exportJsonParameters: [false] },
		},
	},

	// --- UI Mode: Attributes ---
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
		displayName: 'Attributes',
		name: 'exportAttributes',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAttributeColumns' },
		default: [],
		// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-multi-options
		description: 'Select attributes to include in the export. Includes both default attributes (e.g. name, email) and custom attributes (e.g. c_loyalty_tier)',
		displayOptions: {
			show: { resource: ['userData'], operation: ['export'], exportJsonParameters: [false], exportGetAllAttributes: [false] },
		},
	},

	// --- UI Mode: Events Section ---
	{
		displayName: 'Events',
		name: 'exportEventsSection',
		type: 'collection',
		placeholder: 'Add Event Filter',
		default: {},
		displayOptions: {
			show: { resource: ['userData'], operation: ['export'], exportJsonParameters: [false] },
		},
		options: [
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				placeholder: '1704067200',
				description: 'Beginning of the date range for the wanted events as an epoch timestamp',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				placeholder: '1706745600',
				description: 'End of the date range for the wanted events as an epoch timestamp',
			},
			{
				displayName: 'Wanted Events',
				name: 'wantedEvents',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Event',
				typeOptions: { multipleValues: true },
				options: [
					{
						name: 'eventValues',
						displayName: 'Event',
						values: [
							{
								// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
								displayName: 'Event Name',
								name: 'event_name',
								type: 'options',
								typeOptions: { loadOptionsMethod: 'getEventNames' },
								default: '',
								required: true,
								// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
								description: 'Select an event from your partner account',
							},
							{
								displayName: 'Params',
								name: 'params',
								type: 'string',
								default: '',
								placeholder: 'campaign_id, timestamp',
								description: 'Wanted event parameters of the event. Comma-separated param names (e.g. product_id, amount).',
							},
						],
					},
				],
			},
			{
				displayName: 'Wanted Events (JSON)',
				name: 'wantedJson',
				type: 'json',
				default: '[]',
				placeholder: '[{"event_name": "purchase", "params": ["product_id"]}]',
				description: 'Array of wanted event objects as raw JSON (overrides UI wanted events if set)',
			},
		],
	},

	// --- JSON Mode ---
	{
		displayName: 'Attributes (JSON)',
		name: 'exportAttributesJson',
		type: 'json',
		default: '[]',
		placeholder: '["email", "name", "surname", "c_member_code"]',
		description: 'Array of attribute names to include in the export',
		displayOptions: {
			show: { resource: ['userData'], operation: ['export'], exportJsonParameters: [true] },
		},
	},
	{
		displayName: 'Events (JSON)',
		name: 'exportEventsJson',
		type: 'json',
		default: '{}',
		placeholder: '{"start_date": 1704067200, "end_date": 1706745600, "wanted": [{"event_name": "purchase"}]}',
		description: 'Events object with start_date, end_date, and wanted array',
		displayOptions: {
			show: { resource: ['userData'], operation: ['export'], exportJsonParameters: [true] },
		},
	},

	// --- Common fields (always shown) ---
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		options: [
			{ name: 'CSV', value: 'csv' },
			{ name: 'JSON', value: 'json' },
			{ name: 'Parquet', value: 'parquet' },
		],
		default: 'json',
		description: 'Export file format',
		displayOptions: {
			show: { resource: ['userData'], operation: ['export'] },
		},
	},
	{
		displayName: 'Webhook URL',
		name: 'hookUrl',
		type: 'string',
		default: '',
		placeholder: 'https://example.com/webhook',
		description:
			'Webhook URL to receive export completion notification. The export link expires in 24 hours.',
		displayOptions: {
			show: { resource: ['userData'], operation: ['export'] },
		},
	},
];
