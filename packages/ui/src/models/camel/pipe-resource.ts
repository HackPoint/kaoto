import { Pipe as PipeType } from '@kaoto-next/camel-catalog/types';
import { CatalogFilter, CatalogKind } from '../catalog-kind';
import { PipeVisualEntity } from '../visualization/flows';
import { flowTemplateService } from '../visualization/flows/flow-templates-service';
import { PipeErrorHandlerEntity } from '../visualization/metadata/pipeErrorHandlerEntity';
import { CamelKResource } from './camel-k-resource';
import { BaseCamelEntity, PipeSpecErrorHandler } from './entities';
import { SourceSchemaType } from './source-schema-type';

export class PipeResource extends CamelKResource {
  protected pipe: PipeType;
  private flow?: PipeVisualEntity;
  private errorHandler?: PipeErrorHandlerEntity;

  constructor(pipe?: PipeType) {
    super(pipe);
    if (pipe) {
      this.pipe = pipe;
    } else {
      this.pipe = this.resource as PipeType;
      this.pipe.kind = SourceSchemaType.Pipe;
    }
    if (!this.pipe.spec) {
      this.pipe.spec = {};
    }
    this.flow = new PipeVisualEntity(this.pipe.spec);
    this.errorHandler =
      this.pipe.spec.errorHandler && new PipeErrorHandlerEntity(this.pipe.spec as PipeSpecErrorHandler);
  }

  removeEntity(_id?: string): void {
    super.removeEntity();
    const flowTemplate = flowTemplateService.getFlowTemplate(this.getType())!;
    this.pipe.spec = flowTemplate.spec;
    this.flow = new PipeVisualEntity(flowTemplate.spec);
  }

  getEntities(): BaseCamelEntity[] {
    const answer = super.getEntities();
    if (this.pipe.spec!.errorHandler && this.errorHandler) {
      answer.push(this.errorHandler);
    }
    return answer;
  }

  getType(): SourceSchemaType {
    return SourceSchemaType.Pipe;
  }

  getVisualEntities(): PipeVisualEntity[] {
    return this.flow ? [this.flow] : [];
  }

  supportsMultipleVisualEntities(): boolean {
    return false;
  }

  toJSON(): PipeType {
    return this.pipe;
  }

  createErrorHandlerEntity() {
    this.pipe.spec!.errorHandler = {};
    this.errorHandler = new PipeErrorHandlerEntity(this.pipe.spec as PipeSpecErrorHandler);
    return this.errorHandler;
  }

  getErrorHandlerEntity() {
    return this.errorHandler;
  }

  deleteErrorHandlerEntity() {
    this.pipe.spec!.errorHandler = undefined;
    this.errorHandler = undefined;
  }

  addNewEntity(): string {
    //not supported
    return '';
  }

  /** Components Catalog related methods */
  getCompatibleComponents(): CatalogFilter {
    return { kinds: [CatalogKind.Kamelet] };
  }
}