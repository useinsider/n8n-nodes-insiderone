import type { IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export const BASE_URL = 'https://unification.useinsider.com';

export function parseJsonParameter(
	value: string | object,
	fieldName: string,
): IDataObject | IDataObject[] {
	if (typeof value === 'object') {
		return value as IDataObject;
	}
	try {
		return JSON.parse(value) as IDataObject;
	} catch {
		throw new NodeOperationError(
			{
				name: 'InsiderOne',
				type: 'n8n-nodes-insiderone.insiderOne',
				typeVersion: 1,
			} as never,
			`Invalid JSON in "${fieldName}" field. Please provide valid JSON.`,
		);
	}
}
