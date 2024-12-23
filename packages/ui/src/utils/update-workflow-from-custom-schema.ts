import {
  IKameletMetadataAnnotations,
  IKameletMetadataLabels,
  KameletKnownAnnotations,
  KameletKnownLabels,
  IKameletSpecProperty,
  IKameletCustomProperty,
  IWorkflowDefinition,
} from '../models/kamelets-catalog';
import { getValue } from './get-value';
import { setValue } from './set-value';

export const updateWorkflowFromCustomSchema = (workflow: IWorkflowDefinition, value: Record<string, unknown>): void => {
  const previousName = getValue(workflow, 'metadata.name');
  const previousTitle = getValue(workflow, 'spec.definition.title');
  const previousDescription = getValue(workflow, 'spec.definition.description');

  const newName: string = getValue(value, 'name');
  const newTitle: string = getValue(value, 'title');
  const newDescription: string = getValue(value, 'description');

  setValue(workflow, 'metadata.name', newName ?? previousName);
  setValue(workflow, 'spec.definition.title', newTitle ?? previousTitle);
  setValue(workflow, 'spec.definition.description', newDescription ?? previousDescription);

  const previousAnnotations = getValue(workflow, 'metadata.annotations', {} as IKameletMetadataAnnotations);
  const previousIcon = previousAnnotations[KameletKnownAnnotations.Icon];
  const previousSupportLevel = previousAnnotations[KameletKnownAnnotations.SupportLevel];
  const previousCatalogVersion = previousAnnotations[KameletKnownAnnotations.CatalogVersion];
  const previousProvider = previousAnnotations[KameletKnownAnnotations.Provider];
  const previousGroup = previousAnnotations[KameletKnownAnnotations.Group];
  const previousNamespace = previousAnnotations[KameletKnownAnnotations.Namespace];

  const newIcon = getValue(value, 'icon');
  const newSupportLevel = getValue(value, 'supportLevel');
  const newCatalogVersion = getValue(value, 'catalogVersion');
  const newProvider = getValue(value, 'provider');
  const newGroup = getValue(value, 'group');
  const newNamespace = getValue(value, 'namespace');

  const customAnnotations = {
    [KameletKnownAnnotations.Icon]: newIcon ?? previousIcon,
    [KameletKnownAnnotations.SupportLevel]: newSupportLevel ?? previousSupportLevel,
    [KameletKnownAnnotations.CatalogVersion]: newCatalogVersion ?? previousCatalogVersion,
    [KameletKnownAnnotations.Provider]: newProvider ?? previousProvider,
    [KameletKnownAnnotations.Group]: newGroup ?? previousGroup,
    [KameletKnownAnnotations.Namespace]: newNamespace ?? previousNamespace,
  };

  const previousType = getValue(workflow, 'metadata.labels', {} as IKameletMetadataLabels)[KameletKnownLabels.Type];
  const incomingLabels = getValue(value, 'labels', {});
  const newLabels = Object.assign({}, incomingLabels, {
    [KameletKnownLabels.Type]: getValue(value, 'type', previousType),
  });
  const newAnnotations = Object.assign({}, getValue(value, 'annotations', {}), customAnnotations);

  setValue(workflow, 'metadata.labels', newLabels);
  setValue(workflow, 'metadata.annotations', newAnnotations);

  const propertiesArray: IKameletCustomProperty[] = getValue(value, 'workflowProperties');
  const newProperties = propertiesArray?.reduce(
    (acc, property) => {
      if (property !== undefined) {
        const { name, ...rest } = property;
        acc[name] = rest;
      }
      return acc;
    },
    {} as Record<string, IKameletSpecProperty>,
  );

  let previousProperties: Record<string, IKameletSpecProperty> = getValue(workflow, 'spec.definition.properties', {});
  if (typeof previousProperties !== 'object') {
    previousProperties = {};
  }

  const arePreviousPropertiesEmpty = Object.keys(previousProperties).length === 0;
  const isPropertiesArrayEmpty = propertiesArray?.length === 0;
  if (!(arePreviousPropertiesEmpty && isPropertiesArrayEmpty) && newProperties !== undefined) {
    setValue(workflow, 'spec.definition.properties', newProperties);
  }
};
