import type { INodeProperties } from 'n8n-workflow';

export const getProfileProperties: INodeProperties[] = [
	// --- Identifier ---
	{
		displayName: 'Identifiers',
		name: 'profileIdentifiersUi',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		description: 'At least one identifier is required. insider_id and other identifiers can be combined.',
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'] },
		},
		options: [
			{ displayName: 'Custom Identifiers (JSON)', name: 'custom', type: 'json', default: '{}', placeholder: '{"user_loyalty_id": "xyz123"}', description: 'Custom identifier key-value pairs' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '', placeholder: 'user@example.com', description: 'User email address' },
			{ displayName: 'Insider ID', name: 'insider_id', type: 'string', default: '', description: 'The unique Insider ID for the user' },
			{ displayName: 'Phone Number', name: 'phone_number', type: 'string', default: '', placeholder: '+6598765432', description: 'Phone number in E.164 format' },
			{ displayName: 'UUID', name: 'uuid', type: 'string', default: '', description: 'User UUID' },
		],
	},

	// --- JSON Parameters toggle ---
	{
		displayName: 'JSON Parameters',
		name: 'profileJsonParameters',
		type: 'boolean',
		default: false,
		description: 'Whether to pass attributes and events as raw JSON',
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'] },
		},
	},

	// --- UI Mode: Get All Attributes toggle ---
	{
		displayName: 'Get All Attributes',
		name: 'profileGetAllAttributes',
		type: 'boolean',
		default: false,
		description: 'Whether to return all attributes for the user (sends "*")',
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'], profileJsonParameters: [false] },
		},
	},

	// --- UI Mode: Attributes ---
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
		displayName: 'Attributes',
		name: 'profileAttributes',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAttributeColumns',
		},
		default: [],
		// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-multi-options
		description: 'Select attributes to return. Includes both default attributes (e.g. name, email) and custom attributes (e.g. c_loyalty_tier)',
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'], profileJsonParameters: [false], profileGetAllAttributes: [false] },
		},
	},

	// --- UI Mode: Events Section ---
	{
		displayName: 'Events',
		name: 'profileEventsSection',
		type: 'collection',
		placeholder: 'Add Event Filter',
		default: {},
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'], profileJsonParameters: [false] },
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
		],
	},

	// --- JSON Mode ---
	{
		displayName: 'Attributes (JSON)',
		name: 'profileAttributesJson',
		type: 'json',
		default: '[]',
		placeholder: '["email", "name", "surname", "c_member_code"]',
		description: 'Array of attribute names to return',
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'], profileJsonParameters: [true] },
		},
	},
	{
		displayName: 'Events (JSON)',
		name: 'profileEventsJson',
		type: 'json',
		default: '{}',
		placeholder: '{"start_date": 1704067200, "end_date": 1706745600, "wanted": [{"event_name": "purchase", "params": ["product_id"]}]}',
		description: 'Events filter object with start_date, end_date, and wanted array',
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'], profileJsonParameters: [true] },
		},
	},

	// --- Additional Settings ---
	{
		displayName: 'Additional Settings',
		name: 'profileAdditionalSettings',
		type: 'collection',
		placeholder: 'Add Setting',
		default: {},
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'] },
		},
		options: [
			{
				displayName: 'Quota',
				name: 'quota',
				type: 'boolean',
				default: false,
				description: 'Whether to display quota usage for this request',
			},
		],
	},
];
