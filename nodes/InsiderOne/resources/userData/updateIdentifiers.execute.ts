import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { parseJsonParameter, BASE_URL } from '../../shared/utils';

export async function executeUpdateIdentifiers(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	const jsonParameters = this.getNodeParameter('updateIdentifiersJsonParameters', i, false) as boolean;

	let oldIdentifier: IDataObject;
	let newIdentifier: IDataObject;

	if (jsonParameters) {
		oldIdentifier = parseJsonParameter(
			this.getNodeParameter('updateIdentifiersOldJson', i, '{}') as string,
			'Old Identifier (JSON)',
		) as IDataObject;

		newIdentifier = parseJsonParameter(
			this.getNodeParameter('updateIdentifiersNewJson', i, '{}') as string,
			'New Identifier (JSON)',
		) as IDataObject;
	} else {
		const oldUi = this.getNodeParameter('updateIdentifiersOldUi', i, {}) as IDataObject;
		oldIdentifier = {};
		if (oldUi.email) oldIdentifier.email = oldUi.email;
		if (oldUi.uuid) oldIdentifier.uuid = oldUi.uuid;
		if (oldUi.phone_number) oldIdentifier.phone_number = oldUi.phone_number;
		if (oldUi.custom) {
			oldIdentifier.custom = parseJsonParameter(oldUi.custom as string, 'Old Identifier > Custom');
		}

		const newUi = this.getNodeParameter('updateIdentifiersNewUi', i, {}) as IDataObject;
		newIdentifier = {};
		if (newUi.email) newIdentifier.email = newUi.email;
		if (newUi.uuid) newIdentifier.uuid = newUi.uuid;
		if (newUi.phone_number) newIdentifier.phone_number = newUi.phone_number;
		if (newUi.custom) {
			newIdentifier.custom = parseJsonParameter(newUi.custom as string, 'New Identifier > Custom');
		}
	}

	if (Object.keys(oldIdentifier).length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			'Old Identifier must be provided',
			{ itemIndex: i },
		);
	}

	if (Object.keys(newIdentifier).length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			'New Identifier must be provided',
			{ itemIndex: i },
		);
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneApi',
		{
			method: 'PATCH',
			url: `${BASE_URL}/api/user/v1/identity`,
			body: {
				old_identifier: oldIdentifier,
				new_identifier: newIdentifier,
			},
			json: true,
		},
	)) as IDataObject;
}
