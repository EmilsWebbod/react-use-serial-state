import { expect, should } from 'chai';
import { reachApi, reachService } from '../../src/api';

describe('active: ReachApi', () => {
  before(() => {
    reachService.values = { url: 'https://jsonplaceholder.typicode.com' };
  });

  it('should return 200 with response on GET', async () => {
    try {
      const response = await reachApi<{ message: string }>('posts');
      should().exist(response);
    } catch (e) {
      expect(e).to.equal(true);
    }
  });

  it('should return 200 with response on GET and query id', async () => {
    try {
      const response = await reachApi<Array<{ id: number }>>('posts', {
        body: { id: 1 }
      });
      expect(response[0].id).to.equal(1);
    } catch (e) {
      expect(e).to.equal(true);
    }
  });

  it('should return 200 with response on POST', async () => {
    const response = await reachApi<{ id: string }>('posts', {
      method: 'POST'
    });
    expect(response.id).to.equal(101);
  });

  it('should return 200 with response on PATCH', async () => {
    const response = await reachApi<{ id: string }>('posts/1', {
      method: 'PATCH',
      body: { name: '' }
    });
    expect(response.id).to.equal(1);
  });

  it('should return 200 with response on PUT', async () => {
    const response = await reachApi<{ id: string }>('posts/1', {
      method: 'PUT',
      body: { name: '' }
    });
    expect(response.id).to.equal(1);
  });

  it('should return 200 with response on DELETE', async () => {
    try {
      await reachApi<{ id: string }>('posts/1', { method: 'DELETE' });
      expect(true).to.equal(true);
    } catch (e) {
      expect(e).to.equal(true);
    }
  });
});
