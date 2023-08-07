import { DomainEntity } from 'domain-objects';

import { ref } from './ref';

interface Ship {
  // international ship id
  isid: string;

  // name
  name: string;
}
class Ship extends DomainEntity<Ship> implements Ship {
  public static unique = ['isid'];
}

describe('ref', () => {
  it('should refDomainObject when only dobj is passed in', () => {
    const reference = ref(Ship);
    expect(reference).toEqual('Ship');
  });
  it('should refProperty when both dobj and prop are passed in', () => {
    const reference = ref(Ship, 'isid');
    expect(reference).toEqual({ dobj: 'Ship', prop: 'isid' });
  });
});
