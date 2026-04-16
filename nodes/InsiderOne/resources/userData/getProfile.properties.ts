import type { INodeProperties } from 'n8n-workflow';

export const getProfileProperties: INodeProperties[] = [
	// --- Identifier ---
	{
		displayName: 'Identifier Type',
		name: 'profileIdentifierType',
		type: 'options',
		default: 'insiderId',
		options: [
			{
				name: 'Insider ID',
				value: 'insiderId',
				description: 'Look up user by Insider ID',
			},
			{
				name: 'Identifiers',
				value: 'identifiers',
				description: 'Look up user by email, UUID, phone number, or custom identifiers',
			},
		],
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'] },
		},
	},
	{
		displayName: 'Insider ID',
		name: 'profileInsiderId',
		type: 'string',
		default: '',
		required: true,
		description: 'The unique Insider ID for the user',
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'], profileIdentifierType: ['insiderId'] },
		},
	},
	{
		displayName: 'Identifiers',
		name: 'profileIdentifiersUi',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'], profileIdentifierType: ['identifiers'] },
		},
		options: [
			{ displayName: 'Custom Identifiers (JSON)', name: 'custom', type: 'json', default: '{}', placeholder: '{"user_loyalty_id": "xyz123"}', description: 'Custom identifier key-value pairs' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '', placeholder: 'user@example.com', description: 'User email address' },
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

	// --- UI Mode: Attributes Section ---
	{
		displayName: 'Attributes',
		name: 'profileAttributesSection',
		type: 'collection',
		placeholder: 'Add Attribute Filter',
		default: {},
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'], profileJsonParameters: [false], profileGetAllAttributes: [false] },
		},
		options: [
			{
				displayName: 'Attributes',
				name: 'selected',
				type: 'multiOptions',
				default: [],
				description: 'Standard attribute names to return',
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

	// --- UI Mode: Quota ---
	{
		displayName: 'Quota',
		name: 'quota',
		type: 'number',
		default: 0,
		description: 'Quota parameter for the profile query',
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'], profileJsonParameters: [false] },
		},
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
	{
		displayName: 'Quota',
		name: 'quotaJson',
		type: 'number',
		default: 0,
		description: 'Quota parameter for the profile query',
		displayOptions: {
			show: { resource: ['userData'], operation: ['getProfile'], profileJsonParameters: [true] },
		},
	},
];
