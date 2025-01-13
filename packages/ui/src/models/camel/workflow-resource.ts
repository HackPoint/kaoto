import { set } from 'lodash';
import { TileFilter } from '../../components/Catalog/Catalog.models';
import { AddStepMode } from '../visualization/base-visual-entity';
import { CamelComponentFilterService } from '../visualization/flows/support/camel-component-filter.service';
import { CamelRouteVisualEntityData } from '../visualization/flows/support/camel-component-types';
import { FlowTemplateService } from '../visualization/flows/support/flow-templates-service';
import {
  RouteTemplateBeansEntity,
  RouteTemplateBeansParentType,
} from '../visualization/metadata/routeTemplateBeansEntity';
import { CamelKResource } from './camel-k-resource';
import { RouteTemplateBeansAwareResource } from './camel-resource';
import { SourceSchemaType } from './source-schema-type';
import { IWorkflowDefinition } from '../kamelets-catalog';
import { WorkflowVisualEntity } from '../visualization/flows/workflow-visual-entity';

export class WorkflowResource extends CamelKResource implements RouteTemplateBeansAwareResource {
  private flow: WorkflowVisualEntity;
  private beans?: RouteTemplateBeansEntity;

  constructor(workflow?: IWorkflowDefinition) {
    super(workflow);

    if (!workflow) {
      this.resource = FlowTemplateService.getFlowTemplate(this.getType());
    }

    this.flow = new WorkflowVisualEntity(this.resource as unknown as IWorkflowDefinition);
    if (this.flow.workflow.spec.routes.beans) {
      this.beans = new RouteTemplateBeansEntity(this.flow.workflow.spec.routes as RouteTemplateBeansParentType);
    }
  }

  refreshVisualMetadata() {
    this.flow = new WorkflowVisualEntity(this.resource as unknown as IWorkflowDefinition);
  }

  removeEntity(): void {
    super.removeEntity();
    this.resource = FlowTemplateService.getFlowTemplate(this.getType());
    this.flow = new WorkflowVisualEntity(this.resource as unknown as IWorkflowDefinition);
    this.beans = undefined;
  }

  getType(): SourceSchemaType {
    return SourceSchemaType.Workflow;
  }

  getVisualEntities(): WorkflowVisualEntity[] {
    /** A kamelet always have a single flow defined, even if is empty */
    return [this.flow];
  }

  toJSON(): IWorkflowDefinition {
    /**
     * The underlying CamelRouteVisualEntity has a root route property which holds
     * the route definition. Inside of this property, there's a `from` property which
     * holds the kamelet definition.
     *
     * The `from` kamelet property is a reference to the underlying CamelRouteVisualEntity
     * and this way the kamelet definition is updated when the user interacts with
     * the CamelRouteVisualEntity.
     */
    set(this.resource, 'metadata.name', this.flow.getId());
    set(this.resource, 'spec.template.from', this.flow.entityDef.routes.from);
    set(this.resource, 'spec.template.beans', this.beans?.parent.beans);
    return this.resource as unknown as IWorkflowDefinition;
  }

  /** Components Catalog related methods */
  getCompatibleComponents(
    mode: AddStepMode,
    visualEntityData: CamelRouteVisualEntityData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    definition?: any,
  ): TileFilter {
    return CamelComponentFilterService.getKameletCompatibleComponents(mode, visualEntityData, definition);
  }

  getRouteTemplateBeansEntity(): RouteTemplateBeansEntity | undefined {
    return this.beans;
  }

  createRouteTemplateBeansEntity(): RouteTemplateBeansEntity {
    this.flow.workflow.spec.routes.beans = [];
    this.beans = new RouteTemplateBeansEntity(this.flow.workflow.spec.routes as RouteTemplateBeansParentType);
    return this.beans;
  }

  deleteRouteTemplateBeansEntity(): void {
    this.flow.workflow.spec.routes.beans = undefined;
    this.beans = undefined;
  }
}
