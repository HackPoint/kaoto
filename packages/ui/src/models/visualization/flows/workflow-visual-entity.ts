import { FromDefinition } from '@kaoto/camel-catalog/types';
import { getCamelRandomId } from '../../../camel-utils/camel-random-id';
import { isDefined, setValue } from '../../../utils';
import { DefinedComponent } from '../../camel-catalog-index';
import { EntityType } from '../../camel/entities';
import { CatalogKind } from '../../catalog-kind';
import { IWorkflowDefinition } from '../../kamelets-catalog';
import { KaotoSchemaDefinition } from '../../kaoto-schema';
import { AddStepMode, IVisualizationNode, IVisualizationNodeData, VisualComponentSchema } from '../base-visual-entity';
import { AbstractCamelVisualEntity } from './abstract-camel-visual-entity';
import { CamelCatalogService } from './camel-catalog.service';
import { CamelComponentDefaultService } from './support/camel-component-default.service';
import { NodeLabelType } from '../../settings';
import { updateWorkflowFromCustomSchema } from '../../../utils/update-workflow-from-custom-schema';
import { getCustomSchemaFromWorkflow } from '../../../utils/get-custom-schema-from-workflow';

export class WorkflowVisualEntity extends AbstractCamelVisualEntity<{
  id: string;
  routes: { from: FromDefinition };
}> {
  id: string;
  readonly type = EntityType.Kamelet;
  static readonly ROOT_PATH = 'routes';

  constructor(public workflow: IWorkflowDefinition) {
    super({ id: workflow.metadata?.name, routes: { from: workflow?.spec.routes.from } });
    this.id = (workflow?.metadata?.name as string) ?? getCamelRandomId('workflow');
    this.workflow.metadata = workflow?.metadata ?? { name: this.id };
    this.workflow.metadata.name = workflow?.metadata.name ?? this.id;
  }

  getRootPath(): string {
    return WorkflowVisualEntity.ROOT_PATH;
  }

  /** Internal API methods */
  setId(routeId: string): void {
    this.id = routeId;
    this.workflow.metadata.name = this.id;
  }

  getId(): string {
    return this.workflow.metadata.name;
  }

  getNodeLabel(path?: string, labelType?: NodeLabelType): string {
    if (path === this.getRootPath()) {
      const id: string | undefined = this.workflow.metadata.name;
      const description: string | undefined = this.workflow.spec.definition.description;

      if (labelType === NodeLabelType.Description && isDefined(description)) {
        return description;
      }

      return id;
    }

    return super.getNodeLabel(path, labelType);
  }

  toJSON(): { from: FromDefinition } {
    return { from: this.entityDef.routes.from };
  }

  getComponentSchema(path?: string | undefined): VisualComponentSchema | undefined {
    if (path === this.getRootPath()) {
      return {
        schema: this.getRootKameletSchema(),
        definition: getCustomSchemaFromWorkflow(this.workflow),
      };
    }

    return super.getComponentSchema(path);
  }

  updateModel(path: string | undefined, value: Record<string, unknown>): void {
    if (path === this.getRootPath()) {
      updateWorkflowFromCustomSchema(this.workflow, value);
      this.id = this.workflow.metadata.name;
      this.entityDef.id = this.workflow.metadata.name;
      return;
    }

    super.updateModel(path, value);
    if (isDefined(this.entityDef.id)) this.id = this.entityDef.id;
  }

  addStep(options: {
    definedComponent: DefinedComponent;
    mode: AddStepMode;
    data: IVisualizationNodeData;
    targetProperty?: string | undefined;
  }): void {
    /** Replace the root `from` step */
    if (
      options.mode === AddStepMode.ReplaceStep &&
      options.data.path === `${this.getRootPath()}.from` &&
      isDefined(this.entityDef.routes.from)
    ) {
      const fromValue = CamelComponentDefaultService.getDefaultFromDefinitionValue(options.definedComponent);
      Object.assign(this.entityDef.routes.from, fromValue);
      return;
    }

    super.addStep(options);
  }

  removeStep(path?: string): void {
    if (!path) return;
    /**
     * If there's only one path segment, it means the target is the `from` property of the route
     * therefore we replace it with an empty object
     */
    if (path === `${this.getRootPath()}.from`) {
      setValue(this.entityDef, `${this.getRootPath()}.from.uri`, '');
      return;
    }

    super.removeStep(path);
  }

  toVizNode(): IVisualizationNode {
    const vizNode = super.toVizNode();
    vizNode.setTitle('Workflow');

    return vizNode;
  }

  protected getRootUri(): string | undefined {
    return this.workflow.spec.routes.from?.uri;
  }

  private getRootKameletSchema(): KaotoSchemaDefinition['schema'] {
    const rootWorkflowDefinition = CamelCatalogService.getComponent(CatalogKind.Entity, 'WorkflowConfiguration');

    if (rootWorkflowDefinition === undefined) return {} as unknown as KaotoSchemaDefinition['schema'];

    let schema = {} as unknown as KaotoSchemaDefinition['schema'];
    if (rootWorkflowDefinition.propertiesSchema !== undefined) {
      schema = rootWorkflowDefinition.propertiesSchema;
    }

    return schema;
  }
}
