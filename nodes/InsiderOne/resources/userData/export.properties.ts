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

	// --- UI Mode: Attributes Section ---
	{
		displayName: 'Attributes',
		name: 'exportAttributesSection',
		type: 'collection',
		placeholder: 'Add Attribute Filter',
		default: {},
		displayOptions: {
			show: { resource: ['userData'], operation: ['export'], exportJsonParameters: [false], exportGetAllAttributes: [false] },
		},
		options: [
			{
				displayName: 'Attributes',
				name: 'selected',
				type: 'multiOptions',
				default: [],
				description: 'Standard attribute names to include in the export',
				options: [
					{ name: 'Age', value: 'age' },
					{ name: 'Birthday', value: 'birthday' },
					{ name: 'City', value: 'city' },
					{ name: 'Country', value: 'country' },
					{ name: 'Email', value: 'email' },
					{ name: 'Email Opt-In', value: 'email_optin' },
					{ name: 'GDPR Opt-In', value: 'gdpr' },
					{ name: 'Gender', value: 'gender' },
					{ name: 'Language', value: 'language' },
					{ name: 'Locale', value: 'lo' },
					{ name: 'Name', value: 'name' },
					{ name: 'Phone Number', value: 'phone_number' },
					{ name: 'SMS Opt-In', value: 'sms_optin' },
					{ name: 'Surname', value: 'surname' },
					{ name: 'UUID', value: 'uuid' },
					{ name: 'WhatsApp Opt-In', value: 'whatsapp_optin' },
				],
			},
			{
				displayName: 'Custom Attributes',
				name: 'custom',
				type: 'string',
				default: '',
				placeholder: 'c_member_code, c_loyalty_tier',
				description: 'Comma-separated custom attribute names (with c_ prefix)',
			},
		],
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
				type: 'dateTime',
				default: '',
				description: 'Start date for events filter',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for events filter',
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
								displayName: 'Event Name',
								name: 'event_name',
								type: 'string',
								default: '',
								required: true,
							},
							{
								displayName: 'Params',
								name: 'params',
								type: 'string',
								default: '',
								description: 'Comma-separated param names (e.g. product_id, amount)',
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
