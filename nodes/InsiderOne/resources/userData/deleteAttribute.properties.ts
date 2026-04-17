import type { INodeProperties } from 'n8n-workflow';

export const deleteAttributeProperties: INodeProperties[] = [

	{
		displayName: 'Identifiers',
		name: 'deleteAttributeIdentifiersUi',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		description: 'At least one identifier is required. insider_id and other identifiers can be combined.',
		displayOptions: {
			show: { resource: ['userData'], operation: ['deleteAttribute'] },
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
		name: 'deleteAttributeJsonParameters',
		type: 'boolean',
		default: false,
		description: 'Whether to pass attribute fields as raw JSON',
		displayOptions: {
			show: { resource: ['userData'], operation: ['deleteAttribute'] },
		},
	},

	// ── UI MODE ──────────────────────────────────────────────────────────────

	{
		displayName: 'Attributes',
		name: 'deleteAttributeStandardSection',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		description: 'Standard attribute deletions',
		displayOptions: {
			show: { resource: ['userData'], operation: ['deleteAttribute'], deleteAttributeJsonParameters: [false] },
		},
		options: [
			{
				displayName: 'Partial',
				name: 'partial',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Entry',
				description: 'Remove specific values from array-type attributes',
				typeOptions: { multipleValues: true },
				options: [
					{
						name: 'partialValues',
						displayName: 'Partial Delete',
						values: [
							{
								displayName: 'Attribute',
								name: 'attribute',
								type: 'options',
								default: 'static_segment_id',
								options: [
									{ name: 'Static Segment ID', value: 'static_segment_id' },
								],
							},
							{
								displayName: 'Values',
								name: 'values',
								type: 'string',
								default: '',
								placeholder: '1, 2, 3',
								description: 'Comma-separated values to remove',
							},
						],
					},
				],
			},
			{
				displayName: 'Whole',
				name: 'selected',
				type: 'multiOptions',
				default: [],
				description: 'Standard attributes to remove completely',
				options: [
					{ name: 'Age', value: 'age' },
					{ name: 'Birthday', value: 'birthday' },
					{ name: 'City', value: 'city' },
					{ name: 'Country', value: 'country' },
					{ name: 'Email', value: 'email' },
					{ name: 'Email Opt-In', value: 'email_optin' },
					{ name: 'GDPR Opt-In', value: 'gdpr_optin' },
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
		],
	},
	{
		displayName: 'Custom Attributes',
		name: 'deleteAttributeCustomSection',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		description: 'Custom attribute deletions. Do not include the c_ prefix in attribute names.',
		displayOptions: {
			show: { resource: ['userData'], operation: ['deleteAttribute'], deleteAttributeJsonParameters: [false] },
		},
		options: [
			{
				displayName: 'Partial',
				name: 'partial',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Entry',
				description: 'Remove specific values from array-type custom attributes',
				typeOptions: { multipleValues: true },
				options: [
					{
						name: 'partialValues',
						displayName: 'Partial Delete',
						values: [
							{
								// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
								displayName: 'Attribute Name',
								name: 'name',
								type: 'options',
								typeOptions: { loadOptionsMethod: 'getCustomArrayAttributes' },
								default: '',
								// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
								description: 'Array-type custom attribute to partially delete from',
							},
							{
								displayName: 'Values',
								name: 'values',
								type: 'string',
								default: '',
								placeholder: 'value1, value2, value3',
								description: 'Comma-separated values to remove',
							},
						],
					},
				],
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
				displayName: 'Whole',
				name: 'whole',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'getCustomAttributes' },
				default: [],
				// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-multi-options
				description: 'Custom attributes to remove completely',
			},
		],
	},
	{
		displayName: 'Do not include the <code>c_</code> prefix in custom attribute names. The API expects the raw attribute name (e.g. <code>loyalty_tier</code>, not <code>c_loyalty_tier</code>).',
		name: 'deleteAttributeCustomNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: { resource: ['userData'], operation: ['deleteAttribute'], deleteAttributeJsonParameters: [false] },
		},
	},

	// ── JSON MODE ─────────────────────────────────────────────────────────────

	{
		displayName: 'Attributes',
		name: 'deleteAttributeJsonStandardSection',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		description: 'Standard attribute deletions',
		displayOptions: {
			show: { resource: ['userData'], operation: ['deleteAttribute'], deleteAttributeJsonParameters: [true] },
		},
		options: [
			{
				displayName: 'Partial',
				name: 'partial',
				type: 'json',
				default: '{}',
				placeholder: '{"static_segment_id": [1, 2]}',
				description: 'Remove specific values from array-type standard attributes',
			},
			{
				displayName: 'Whole',
				name: 'whole',
				type: 'json',
				default: '[]',
				placeholder: '["name", "surname", "email_optin"]',
				description: 'Standard attribute names to remove completely',
			},
		],
	},
	{
		displayName: 'Custom Attributes',
		name: 'deleteAttributeJsonCustomSection',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		description: 'Custom attribute deletions',
		displayOptions: {
			show: { resource: ['userData'], operation: ['deleteAttribute'], deleteAttributeJsonParameters: [true] },
		},
		options: [
			{
				displayName: 'Partial',
				name: 'partial',
				type: 'json',
				default: '{}',
				placeholder: '{"tags": ["value1", "value2"]}',
				description: 'Remove specific values from array-type custom attributes. Do not include the c_ prefix in attribute names.',
			},
			{
				displayName: 'Whole',
				name: 'whole',
				type: 'json',
				default: '[]',
				placeholder: '["loyalty_tier", "member_code"]',
				description: 'Custom attribute names to remove completely. Do not include the c_ prefix.',
			},
		],
	},
];
