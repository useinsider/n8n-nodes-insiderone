import type { INodeProperties } from 'n8n-workflow';
import { anonymizeUserProperties } from './anonymizeUser.properties';
import { deleteUserProfileProperties } from './deleteUserProfile.properties';

export { executeAnonymizeUser } from './anonymizeUser.execute';
export { executeDeleteUserProfile } from './deleteUserProfile.execute';

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
			name: 'Delete User Profile',
			value: 'deleteUserProfile',
			description: 'Permanently delete a user profile',
			action: 'Delete user profile',
		},
		{
			name: "Delete User's PII Data",
			value: 'anonymizeUser',
			description: "Anonymize a user's PII data",
			action: 'Delete user PII data',
		},
	],
	default: 'deleteUserProfile',
};

export const dataGovernanceProperties: INodeProperties[] = [
	dataGovernanceOperations,
	...deleteUserProfileProperties,
	...anonymizeUserProperties,
];
