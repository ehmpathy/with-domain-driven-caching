import { DomainEntity, DomainLiteral } from 'domain-objects';

import { defineDependencyPointerKey } from './defineDependencyPointerKey';

interface ContainerLock {
  manufacturer: string;
  model: string;
}
class ContainerLock
  extends DomainLiteral<ContainerLock>
  implements ContainerLock {}

interface Container {
  icid: string;
  onShipUuid: string;
  lock: ContainerLock;
}
class Container extends DomainEntity<Container> implements Container {}

describe('defineDependencyPointerKey', () => {
  it('should be able to define the dependency pointer key for a relationship from entity with foreign key on *source* entity', () => {
    // specify a relationship from container.uuid=x to ship.uuid=any
    const key = defineDependencyPointerKey({
      dobj: Container.name,
      property: 'onShipUuid',
      specifier: {
        propertyOf: { uuid: '__uuid__' },
      },
    });
    expect(key).toEqual('.query.dep.Container.uuid.__uuid__.onShipUuid');
    expect(key).toMatchSnapshot();
  });
  it('should be able to define the dependency pointer key for a relationship from entity with foreign key on *target* entity', () => {
    // specify a relationship from container.uuid=x to ship.uuid=any
    const key = defineDependencyPointerKey({
      dobj: Container.name,
      property: 'onShipUuid',
      specifier: {
        propertyEquals: { value: '__uuid__' },
      },
    });
    expect(key).toEqual(
      '.query.dep.Container.onShipUuid.__uuid__.c72319fa41f2824995e59ec2f82e14eda8a5a017cdc6f9b971a02e205d306813',
    );
    expect(key).toMatchSnapshot();
  });
  it('should be able to define the dependency pointer key to a domain value object property', () => {
    const lock = new ContainerLock({
      manufacturer: 'swiper no swiping',
      model: 'locky mclockface',
    });

    // specify a relationship from container.uuid=x to ship.uuid=any
    const key = defineDependencyPointerKey({
      dobj: Container.name,
      property: 'lock',
      specifier: {
        propertyEquals: { value: lock },
      },
    });
    expect(key).toEqual(
      '.query.dep.Container.lock.ContainerLock.swipernoswiping.lockymclockface.3cf448f9380ecd4daf668110f1f0bf7884de32b69c3576082bf0dcc1ca50c2b9',
    );
    expect(key).toMatchSnapshot();
  });
});
