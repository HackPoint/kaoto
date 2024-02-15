import {
  XmlSchema,
  XmlSchemaAttributeGroup,
  XmlSchemaAttributeGroupMember,
  XmlSchemaAttributeOrGroupRef,
  XmlSchemaItemWithRef,
} from '.';
import { XmlSchemaNamedType, XmlSchemaRef } from './utils';

/**
 * Class for the attribute group reference.
 * Represents the World Wide Web Consortium (W3C) attributeGroup
 * element with the ref attribute.
 */
export class XmlSchemaAttributeGroupRef
  extends XmlSchemaAttributeOrGroupRef
  implements XmlSchemaAttributeGroupMember, XmlSchemaItemWithRef<XmlSchemaAttributeGroup>
{
  private ref: XmlSchemaRef<XmlSchemaAttributeGroup>;

  /**
   * Create an attribute group reference.
   * @param parent containing schema.
   */
  constructor(parent: XmlSchema) {
    super();
    this.ref = new XmlSchemaRef<XmlSchemaAttributeGroup>(parent, XmlSchemaNamedType.XmlSchemaAttributeGroup);
  }

  /**
   * Return the reference object.
   * @return
   */
  public getRef() {
    return this.ref;
  }

  isRef() {
    return this.ref.getTargetQName() != null;
  }

  getTargetQName() {
    return this.ref.getTargetQName();
  }

  public getRefBase() {
    return this.ref;
  }
}
