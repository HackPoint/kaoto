import { DataMapperProvider } from './DataMapperProvider';
import { render, screen } from '@testing-library/react';
import { useDataMapper } from '../hooks';
import { FieldItem, MappingTree } from '../models/mapping';
import { useEffect } from 'react';
import { IField } from '../models/document';

describe('DataMapperProvider', () => {
  it('should render', () => {
    render(<DataMapperProvider></DataMapperProvider>);
  });

  it('refreshMappingTree should re-create the MappingTree instance', async () => {
    let prevTree: MappingTree;
    let nextTree: MappingTree;
    let done = false;
    const TestRefreshMappingTree = () => {
      const { mappingTree, refreshMappingTree } = useDataMapper();
      useEffect(() => {
        if (done) {
          nextTree = mappingTree;
        } else {
          prevTree = mappingTree;
          prevTree.children.push(new FieldItem(prevTree, {} as IField));
          refreshMappingTree();
          done = true;
        }
      }, [mappingTree, refreshMappingTree]);
      return <div data-testid="testdiv"></div>;
    };
    render(
      <DataMapperProvider>
        <TestRefreshMappingTree></TestRefreshMappingTree>
      </DataMapperProvider>,
    );
    await screen.findByTestId('testdiv');
    expect(prevTree!).toBeDefined();
    expect(nextTree!).toBeDefined();
    expect(prevTree! !== nextTree!).toBeTruthy();
    expect(prevTree!.children[0] === nextTree!.children[0]).toBeTruthy();
  });
});
