import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { BASE_URL } from '../../shared/utils';

export async function executeAnonymizeUser(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	const identifierType = this.getNodeParameter('anonymizeUserIdentifierType', i) as string;

	let identifierPayload: IDataObject;

	if (identifierType === 'insiderId') {
		const insiderId = this.getNodeParameter('anonymizeUserInsiderId', i) as string;
		identifierPayload = { insider_id: insiderId };
	} else {
		const identifiersUi = this.getNodeParameter('anonymizeUserIdentifiersUi', i, {}) as IDataObject;
		const identifiers: IDataObject = {};
		if (identifiersUi.email) identifiers.email = identifiersUi.email;
		if (identifiersUi.uuid) identifiers.uuid = identifiersUi.uuid;
		if (identifiersUi.phone_number) identifiers.phone_number = identifiersUi.phone_number;

		if (Object.keys(identifiers).length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'At least one identifier must be provided',
				{ itemIndex: i },
			);
		}
		identifierPayload = { identifiers };
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneApi',
		{
			method: 'POST',
			url: `${BASE_URL}/api/user/v1/anonymize`,
			body: { ...identifierPayload },
			json: true,
		},
	)) as IDataObject;
}
