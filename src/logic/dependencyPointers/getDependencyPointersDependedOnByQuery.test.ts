import { DomainEntity } from 'domain-objects';

import { ref } from '../ref/ref';
import { getDependencyPointersDependedOnByQuery } from './getDependencyPointersDependedOnByQuery';

interface Ship {
  // international ship id
  isid: string;

  // name
  name: string;
}
class Ship extends DomainEntity<Ship> implements Ship {
  public static unique = ['isid'];
}

interface Container {
  // international container id
  icid: string;

  // the ship its on
  onShipUuid: string;
}
class Container extends DomainEntity<Container> implements Container {}

describe('getDependencyPointersDependedOnByQuery', () => {
  describe('dependsOn.identity', () => {
    it('should accurately define identity dependency pointer', () => {
      const pointers = getDependencyPointersDependedOnByQuery({
        dependsOn: [
          {
            identity: {
              dobj: ref(Container),
              uuid: ({ input }) => input[0]!.containerUuid,
            },
          },
        ],
        execution: {
          input: [{ containerUuid: '__uuid__' }],
          output: null,
        },
      });
      expect(pointers).toEqual([
        '.query.dep.Container.uuid.__uuid__.c72319fa41f2824995e59ec2f82e14eda8a5a017cdc6f9b971a02e205d306813',
      ]);
    });
  });

  describe('dependsOn.relationship', () => {
    it('should accurately define relationship dependency pointer, foreign key on source table', () => {
      const pointers = getDependencyPointersDependedOnByQuery({
        dependsOn: [
          {
            relationship: {
              from: {
                dobj: ref(Container),
                uuid: ({ input }) => input[0]!.containerUuid,
              },
              to: {
                dobj: ref(Ship),
              },
              via: ref(Container, 'onShipUuid'),
            },
          },
        ],
        execution: {
          input: [{ containerUuid: '__uuid__' }],
          output: null,
        },
      });
      expect(pointers).toEqual([
        '.query.dep.Container.uuid.__uuid__.onShipUuid',
      ]);
    });
    it('should accurately define relationship dependency pointer, foreign key on target table', () => {
      const pointers = getDependencyPointersDependedOnByQuery({
        dependsOn: [
          {
            relationship: {
              from: {
                dobj: ref(Ship),
                uuid: ({ input }) => input[0]!.shipUuid,
              },
              to: {
                dobj: ref(Container),
              },
              via: ref(Container, 'onShipUuid'),
            },
          },
        ],
        execution: {
          input: [{ shipUuid: '__uuid__' }],
          output: null,
        },
      });
      expect(pointers).toEqual([
        '.query.dep.Container.onShipUuid.__uuid__.c72319fa41f2824995e59ec2f82e14eda8a5a017cdc6f9b971a02e205d306813',
      ]);
    });
    it('should accurately define relationship dependency pointers, multiple uuids', () => {
      const pointers = getDependencyPointersDependedOnByQuery({
        dependsOn: [
          {
            relationship: {
              from: {
                dobj: ref(Ship),
                uuid: ({ input }) => input[0]!.shipUuids,
              },
              to: {
                dobj: ref(Container),
              },
              via: ref(Container, 'onShipUuid'),
            },
          },
        ],
        execution: {
          input: [{ shipUuids: ['__uuid.1__', '__uuid.2__'] }],
          output: null,
        },
      });
      expect(pointers).toEqual([
        '.query.dep.Container.onShipUuid.__uuid1__.ae34a766b88e719265701962ba4afc8de8000e19b20686755f8eb8098b82df7b',
        '.query.dep.Container.onShipUuid.__uuid2__.08dca4394d2a5a5ca8ece34dec74948ef88199a357039d86161f79ce3cc41ac5',
      ]);
    });
    it('should fail fast if the property that the relationship is defined via does not seem like it is named correctly', () => {
      // TODO:
      // e.g., `via: ref(Container, 'ownerUuid')` => throw error for relationship, should be named something `*ship` (i.e., the ends should match)
    });
  });
});
