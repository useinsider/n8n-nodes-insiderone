import type { INodeProperties } from 'n8n-workflow';
import { unsubscribeEmailProperties } from './unsubscribeEmail.properties';

export { executeUnsubscribeEmail } from './unsubscribeEmail.execute';

export const dataGovernanceOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: { resource: ['dataGovernance'] },
	},
	options: [
		{
			name: 'Unsubscribe Email',
			value: 'unsubscribeEmail',
			description: 'Unsubscribe an email address from the database',
			action: 'Unsubscribe email',
		},
	],
	default: 'unsubscribeEmail',
};

export const dataGovernanceProperties: INodeProperties[] = [
	dataGovernanceOperations,
	...unsubscribeEmailProperties,
];
