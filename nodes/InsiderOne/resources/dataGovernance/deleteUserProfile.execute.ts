import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { parseJsonParameter, BASE_URL } from '../../shared/utils';

export async function executeDeleteUserProfile(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	const identifiersUi = this.getNodeParameter('deleteUserProfileIdentifiersUi', i, {}) as IDataObject;
	const identifierPayload: IDataObject = {};

	if (identifiersUi.insider_id) identifierPayload.insider_id = identifiersUi.insider_id;

	const identifiers: IDataObject = {};
	if (identifiersUi.email) identifiers.email = identifiersUi.email;
	if (identifiersUi.uuid) identifiers.uuid = identifiersUi.uuid;
	if (identifiersUi.phone_number) identifiers.phone_number = identifiersUi.phone_number;
	if (identifiersUi.custom) {
		identifiers.custom = parseJsonParameter(identifiersUi.custom as string, 'Custom Identifiers');
	}
	if (Object.keys(identifiers).length > 0) identifierPayload.identifiers = identifiers;

	if (Object.keys(identifierPayload).length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			'At least one identifier must be provided',
			{ itemIndex: i },
		);
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneApi',
		{
			method: 'POST',
			url: `${BASE_URL}/api/user/v1/delete`,
			body: { ...identifierPayload },
			json: true,
		},
	)) as IDataObject;
}
