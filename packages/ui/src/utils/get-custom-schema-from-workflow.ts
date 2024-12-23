import {
  IKameletCustomDefinition,
  IKameletMetadataAnnotations,
  IKameletMetadataLabels,
  KameletKnownAnnotations,
  KameletKnownLabels,
  IKameletSpecProperty,
  IKameletCustomProperty,
  IWorkflowDefinition,
} from '../models/kamelets-catalog';
import { getValue } from './get-value';

export const getCustomSchemaFromWorkflow = (workflow: IWorkflowDefinition): IKameletCustomDefinition => {
  const name = getValue(workflow, 'metadata.name', '');
  const title = getValue(workflow, 'spec.definition.title', '');
  const description = getValue(workflow, 'spec.definition.description', '');
  const type = getValue(workflow, 'metadata.labels', {} as IKameletMetadataLabels)[KameletKnownLabels.Type];
  const annotations = getValue(workflow, 'metadata.annotations', {} as IKameletMetadataAnnotations);
  const labels = getValue(workflow, 'metadata.labels', {} as IKameletMetadataLabels);
  let properties = getValue(workflow, 'spec.definition.properties', {} as Record<string, IKameletSpecProperty>);

  if (typeof properties !== 'object') {
    properties = {};
  }
  const processedProperties: IKameletCustomProperty[] = Object.entries<IKameletSpecProperty>(properties)
    .filter(([_, value]) => typeof value === 'object' && !Array.isArray(value))
    .map(([key, value]) => {
      return {
        name: key,
        ...value,
      };
    });

  const filteredLabels = Object.keys(labels).reduce((acc, key) => {
    if (key !== KameletKnownLabels.Type) {
      acc[key] = labels[key];
    }
    return acc;
  }, {} as IKameletMetadataLabels);

  const filteredAnnotations = Object.entries(annotations).reduce((acc, [annotationKey, annotationValue]) => {
    switch (annotationKey) {
      case KameletKnownAnnotations.Icon:
      case KameletKnownAnnotations.SupportLevel:
      case KameletKnownAnnotations.CatalogVersion:
      case KameletKnownAnnotations.Provider:
      case KameletKnownAnnotations.Group:
      case KameletKnownAnnotations.Namespace:
        break;
      default:
        acc[annotationKey] = annotationValue as string;
    }

    return acc;
  }, {} as IKameletMetadataAnnotations);

  const customSchema: IKameletCustomDefinition = {
    name,
    title,
    description,
    type,
    icon: annotations[KameletKnownAnnotations.Icon],
    supportLevel: annotations[KameletKnownAnnotations.SupportLevel],
    catalogVersion: annotations[KameletKnownAnnotations.CatalogVersion],
    provider: annotations[KameletKnownAnnotations.Provider],
    group: annotations[KameletKnownAnnotations.Group],
    namespace: annotations[KameletKnownAnnotations.Namespace],
    labels: filteredLabels,
    annotations: filteredAnnotations,
    kameletProperties: processedProperties,
  };

  return customSchema;
};
