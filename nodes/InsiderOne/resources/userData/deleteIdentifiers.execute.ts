import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { parseJsonParameter, BASE_URL } from '../../shared/utils';

export async function executeDeleteIdentifiers(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	const jsonParameters = this.getNodeParameter('deleteIdentifiersJsonParameters', i, false) as boolean;

	let identifiers: IDataObject;

	if (jsonParameters) {
		identifiers = parseJsonParameter(
			this.getNodeParameter('deleteIdentifiersJson', i, '{}') as string,
			'Identifiers (JSON)',
		) as IDataObject;
	} else {
		const ui = this.getNodeParameter('deleteIdentifiersUi', i, {}) as IDataObject;
		identifiers = {};
		if (ui.email) identifiers.email = ui.email;
		if (ui.uuid) identifiers.uuid = ui.uuid;
		if (ui.phone_number) identifiers.phone_number = ui.phone_number;
		if (ui.custom) {
			identifiers.custom = parseJsonParameter(ui.custom as string, 'Custom Identifiers');
		}
	}

	if (Object.keys(identifiers).length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			'At least one identifier must be provided',
			{ itemIndex: i },
		);
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneUnificationApi',
		{
			method: 'DELETE',
			url: `${BASE_URL}/api/user/v1/identity`,
			body: { identifiers },
			json: true,
		},
	)) as IDataObject;
}
