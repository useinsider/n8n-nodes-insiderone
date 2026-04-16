import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { parseJsonParameter, BASE_URL } from '../../shared/utils';

export async function executeDeleteAttribute(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	const jsonParameters = this.getNodeParameter('deleteAttributeJsonParameters', i, false) as boolean;

	// --- Identifiers (always) ---
	// insider_id goes at the top level of the user object
	// identifiers mode wraps fields under an "identifiers" key
	const identifierType = this.getNodeParameter('deleteAttributeIdentifierType', i) as string;
	let identifierPayload: IDataObject;

	if (identifierType === 'insiderId') {
		const insiderId = this.getNodeParameter('deleteAttributeInsiderId', i) as string;
		identifierPayload = { insider_id: insiderId };
	} else {
		const identifiersUi = this.getNodeParameter('deleteAttributeIdentifiersUi', i, {}) as IDataObject;
		const identifiers: IDataObject = {};
		if (identifiersUi.email) identifiers.email = identifiersUi.email;
		if (identifiersUi.uuid) identifiers.uuid = identifiersUi.uuid;
		if (identifiersUi.phone_number) identifiers.phone_number = identifiersUi.phone_number;
		if (identifiersUi.custom) {
			identifiers.custom = parseJsonParameter(identifiersUi.custom as string, 'Custom Identifiers');
		}
		identifierPayload = { identifiers };
	}

	let users: IDataObject[];

	if (jsonParameters) {
		// --- Attributes (JSON mode) ---
		const jsonStandard = this.getNodeParameter('deleteAttributeJsonStandardSection', i, {}) as IDataObject;
		const jsonWhole = jsonStandard.whole
			? parseJsonParameter(jsonStandard.whole as string, 'Attributes > Whole') as unknown as string[]
			: [];
		const jsonPartial = jsonStandard.partial
			? parseJsonParameter(jsonStandard.partial as string, 'Attributes > Partial') as IDataObject
			: {};

		// --- Custom Attributes (JSON mode) ---
		const jsonCustom = this.getNodeParameter('deleteAttributeJsonCustomSection', i, {}) as IDataObject;
		const jsonCustomWhole = jsonCustom.whole
			? parseJsonParameter(jsonCustom.whole as string, 'Custom Attributes > Whole') as unknown as string[]
			: [];
		const jsonCustomPartial = jsonCustom.partial
			? parseJsonParameter(jsonCustom.partial as string, 'Custom Attributes > Partial') as IDataObject
			: {};

		const hasJsonPartial = Object.keys(jsonPartial).length > 0;
		const hasJsonCustomPartial = Object.keys(jsonCustomPartial).length > 0;

		if (jsonWhole.length === 0 && !hasJsonPartial && jsonCustomWhole.length === 0 && !hasJsonCustomPartial) {
			throw new NodeOperationError(
				this.getNode(),
				'At least one attribute must be specified for deletion',
				{ itemIndex: i },
			);
		}

		const jsonUser: IDataObject = { ...identifierPayload };
		if (jsonWhole.length > 0) jsonUser.whole = jsonWhole;
		if (hasJsonPartial) jsonUser.partial = jsonPartial;

		const jsonCustomObj: IDataObject = {};
		if (jsonCustomWhole.length > 0) jsonCustomObj.whole = jsonCustomWhole;
		if (hasJsonCustomPartial) jsonCustomObj.partial = jsonCustomPartial;
		if (Object.keys(jsonCustomObj).length > 0) jsonUser.custom = jsonCustomObj;

		users = [jsonUser];
	} else {
		// --- Attributes section ---
		const standardSection = this.getNodeParameter('deleteAttributeStandardSection', i, {}) as IDataObject;

		const whole = (standardSection.selected ?? []) as string[];

		const partial: IDataObject = {};
		if (standardSection.partial) {
			const partialUi = standardSection.partial as IDataObject;
			if (partialUi.partialValues) {
				for (const entry of partialUi.partialValues as IDataObject[]) {
					const raw = (entry.values as string).split(',').map((s) => s.trim()).filter(Boolean);
					partial[entry.attribute as string] = raw.map((v) => (isNaN(Number(v)) ? v : Number(v)));
				}
			}
		}

		// --- Custom Attributes section ---
		const customSection = this.getNodeParameter('deleteAttributeCustomSection', i, {}) as IDataObject;

		const customWhole = (customSection.whole ?? []) as string[];

		const customPartial: IDataObject = {};
		if (customSection.partial) {
			const customPartialUi = customSection.partial as IDataObject;
			if (customPartialUi.partialValues) {
				for (const entry of customPartialUi.partialValues as IDataObject[]) {
					customPartial[entry.name as string] = (entry.values as string)
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean);
				}
			}
		}

		// Validate: at least one deletion target
		const hasPartial = Object.keys(partial).length > 0;
		const hasCustomPartial = Object.keys(customPartial).length > 0;
		if (whole.length === 0 && !hasPartial && customWhole.length === 0 && !hasCustomPartial) {
			throw new NodeOperationError(
				this.getNode(),
				'At least one attribute must be specified for deletion',
				{ itemIndex: i },
			);
		}

		// --- Build user object ---
		const user: IDataObject = { ...identifierPayload };

		if (whole.length > 0) user.whole = whole;
		if (hasPartial) user.partial = partial;

		const custom: IDataObject = {};
		if (customWhole.length > 0) custom.whole = customWhole;
		if (hasCustomPartial) custom.partial = customPartial;
		if (Object.keys(custom).length > 0) user.custom = custom;

		users = [user];
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneApi',
		{
			method: 'POST',
			url: `${BASE_URL}/api/user/v1/attribute/delete`,
			body: { users },
			json: true,
		},
	)) as IDataObject;
}
