import type { INodeProperties } from 'n8n-workflow';

export const upsertProperties: INodeProperties[] = [
	{
		displayName: 'Identifier Type',
		name: 'identifierType',
		type: 'options',
		default: 'insiderId',
		options: [
			{
				name: 'Insider ID',
				value: 'insiderId',
				description: 'Identify user by Insider ID',
			},
			{
				name: 'Identifiers',
				value: 'identifiers',
				description: 'Identify user by email, UUID, phone number, or custom identifiers',
			},
		],
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'] },
		},
	},
	{
		displayName: 'Insider ID',
		name: 'insiderId',
		type: 'string',
		default: '',
		required: true,
		description: 'The unique Insider ID for the user (e.g., sampleinsiderid)',
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'], identifierType: ['insiderId'] },
		},
	},
	{
		displayName: 'Identifiers',
		name: 'identifiersUi',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'], identifierType: ['identifiers'] },
		},
		options: [
			{ displayName: 'Email', name: 'email', type: 'string', default: '', placeholder: 'sample@useinsider.com', description: 'User email address' },
			{ displayName: 'Phone Number', name: 'phone_number', type: 'string', default: '', placeholder: '+6598765432', description: 'Phone number in E.164 format' },
			{ displayName: 'UUID', name: 'uuid', type: 'string', default: '', description: 'User UUID' },
			{ displayName: 'Custom Identifiers (JSON)', name: 'custom', type: 'json', default: '{}', placeholder: '{"user_loyalty_id": "xyz123"}', description: 'Custom identifier key-value pairs' },
		],
	},
	{
		displayName: 'JSON Parameters',
		name: 'jsonParameters',
		type: 'boolean',
		default: false,
		description: 'Whether to pass attributes and events as raw JSON strings',
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'] },
		},
	},

	// --- UI Mode ---
	{
		displayName: 'Attributes',
		name: 'attributesUi',
		type: 'collection',
		placeholder: 'Add Attribute',
		default: {},
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'], jsonParameters: [false] },
		},
		options: [
			{ displayName: 'Age', name: 'age', type: 'number', default: 0, description: 'Age of the user' },
			{ displayName: 'Birthday', name: 'birthday', type: 'dateTime', default: '', description: 'User birthday in RFC 3339 format (e.g. 1993-03-12T00:00:00Z). A "Z" suffix will be appended automatically if omitted.' },
			{ displayName: 'City', name: 'city', type: 'string', default: '', description: 'City information of the user' },
			{ displayName: 'Country', name: 'country', type: 'string', default: '', description: 'Country in ISO 3166-1 alpha-2 format (e.g. US, TR)' },
			{ displayName: 'Email Opt-In', name: 'email_optin', type: 'boolean', default: false, description: 'Whether the user has opted in for marketing emails' },
			{ displayName: 'GDPR Opt-In', name: 'gdpr_optin', type: 'boolean', default: false, description: 'Whether the user has given GDPR consent for campaigns and data processing' },
			{ displayName: 'Gender', name: 'gender', type: 'string', default: '', description: 'Gender of the user' },
			{ displayName: 'Language', name: 'language', type: 'string', default: '', description: 'Language information of the user' },
			{ displayName: 'Locale', name: 'locale', type: 'string', default: '', description: 'User locale information' },
			{ displayName: 'Name', name: 'name', type: 'string', default: '', description: 'User first name' },
			{ displayName: 'SMS Opt-In', name: 'sms_optin', type: 'boolean', default: false, description: 'Whether the user has opted in for SMS messages' },
			{ displayName: 'Static Segment IDs', name: 'static_segment_id', type: 'string', default: '', description: 'Comma-separated newsletter contact list IDs (e.g. 1,2)' },
			{ displayName: 'Surname', name: 'surname', type: 'string', default: '', description: 'User surname' },
			{ displayName: 'WhatsApp Opt-In', name: 'whatsapp_optin', type: 'boolean', default: false, description: 'Whether the user has opted in for WhatsApp messages' },
		],
	},
	{
		displayName: 'Add Extra Default Attributes',
		name: 'showExtraDefaultAttributes',
		type: 'boolean',
		default: false,
		description: 'Whether to add extra standard attributes not listed above (sent directly in the attributes object)',
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'], jsonParameters: [false] },
		},
	},
	{
		displayName: 'Extra Default Attributes',
		name: 'extraDefaultAttributes',
		type: 'assignmentCollection',
		default: {},
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'], jsonParameters: [false], showExtraDefaultAttributes: [true] },
		},
	},
	{
		displayName: 'Add Custom Attributes',
		name: 'showCustomAttributes',
		type: 'boolean',
		default: false,
		description: 'Whether to add custom attributes (sent under the "custom" object, no c_ prefix needed)',
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'], jsonParameters: [false] },
		},
	},
	{
		displayName: 'Custom attribute names do not require a <code>c_</code> prefix',
		name: 'customAttributesNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'], jsonParameters: [false], showCustomAttributes: [true] },
		},
	},
	{
		displayName: 'Custom Attributes',
		name: 'customAttributes',
		type: 'assignmentCollection',
		default: {},
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'], jsonParameters: [false], showCustomAttributes: [true] },
		},
	},
	{
		displayName: 'Events',
		name: 'eventsUi',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Event',
		typeOptions: { multipleValues: true },
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'], jsonParameters: [false] },
		},
		options: [
			{
				name: 'eventValues',
				displayName: 'Event',
				// eslint-disable-next-line n8n-nodes-base/node-param-fixed-collection-type-unsorted-items
				values: [
					{
						displayName: 'Event Name',
						name: 'event_name',
						type: 'string',
						default: '',
							required:	true,
					},
					{
						displayName: 'Timestamp',
						name: 'timestamp',
						type: 'dateTime',
						default: '',
							required:	true,
						description: 'Event timestamp in RFC 3339 format (e.g. 2024-01-15T10:30:00Z). A \'Z\' suffix will be appended automatically if omitted.',
					},
					{
						displayName: 'Event Params',
						name: 'event_params',
						type: 'assignmentCollection',
						default: {},
						description: 'Standard event parameters (e.g. product_id, unit_price, currency)',
					},
					{
						displayName: 'Custom event parameters do not require a <code>c_</code>	prefix',
						name: 'customEventParamsNotice',
						type: 'notice',
						default: '',
					},
					{
						displayName: 'Custom Event Params',
						name: 'custom',
						type: 'assignmentCollection',
						default: {},
						description: 'Custom event parameters sent under the \'custom\' key (e.g. customer_type, trial_start_date)',
					},
				],
			},
		],
	},

	// --- JSON Mode ---
	{
		displayName: 'Attributes (JSON)',
		name: 'attributesJson',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'], jsonParameters: [true] },
		},
	},
	{
		displayName: 'Events Array (JSON)',
		name: 'eventsJson',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'], jsonParameters: [true] },
		},
	},

	// --- Additional Settings ---
	{
		displayName: 'Additional Settings',
		name: 'additionalSettings',
		type: 'collection',
		placeholder: 'Add Setting',
		default: {},
		displayOptions: {
			show: { resource: ['userData'], operation: ['upsert'] },
		},
		options: [
			{
				displayName: 'Batch Size',
				name: 'batchSize',
				type: 'number',
				default: 1,
				typeOptions: { minValue: 1 },
				description:
					'Number of users to send in a single API request. Set higher to reduce API calls when processing many users.',
			},
			{
				displayName: 'Error Callback Endpoint',
				name: 'errorCallbackEndpoint',
				type: 'string',
				default: '',
				placeholder: 'https://your-domain.com/webhook',
				description: 'URL to receive errors if the asynchronous upsert fails',
			},
			{
				displayName: 'Not Append',
				name: 'notAppend',
				type: 'boolean',
				default: true,
				description:
					'Whether to overwrite existing attributes/arrays instead of appending',
			},
			{
				displayName: 'Skip Hook',
				name: 'skipHook',
				type: 'boolean',
				default: false,
				description:
					'Whether historical data should skip triggering journeys or data streams',
			},
		],
	},
];
