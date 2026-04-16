import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

const CONTACT_BASE_URL = 'https://contact.useinsider.com';

export async function executeUnsubscribeEmail(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const email = this.getNodeParameter('email', i) as string;

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneApi',
		{
			method: 'POST',
			url: `${CONTACT_BASE_URL}/email/v1/unsubscribe`,
			body: { email },
			json: true,
		},
	)) as IDataObject;
}
