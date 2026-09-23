import { test, expect, APIResponse } from '@playwright/test';
import { send } from '../helpers/logged-request';

// Swagger Petstore v3 — full CRUD lifecycle for a single pet.
// Steps share state (petId + expected payload) so they must run in order.
test.describe.configure({ mode: 'serial' });

type Pet = {
  id: number;
  name: string;
  status: 'available' | 'pending' | 'sold';
  photoUrls: string[];
  category?: { id: number; name: string };
  tags?: { id: number; name: string }[];
};

const petId = 10001;

const createdPet: Pet = {
  id: petId,
  name: 'Bruno',
  status: 'available',
  category: { id: 1, name: 'Dogs' },
  photoUrls: ['https://example.com/bruno.jpg'],
  tags: [{ id: 1, name: 'friendly' }],
};

const updatedPet: Pet = {
  ...createdPet,
  name: 'Bruno Updated',
  status: 'sold',
};

async function expectJson(response: APIResponse, status: number) {
  expect(response.status()).toBe(status);
  expect(response.headers()['content-type']).toContain('application/json');
}

test.describe('Petstore /pet CRUD', () => {
  test('POST /pet creates a pet', async ({ request }) => {
    const response = await send(request, 'POST', 'pet', createdPet);

    await expectJson(response, 200);
    expect(await response.json()).toEqual(createdPet);
  });

  test('GET /pet/{petId} retrieves the created pet', async ({ request }) => {
    const response = await send(request, 'GET', `pet/${petId}`);

    await expectJson(response, 200);
    const body = await response.json();
    expect(body.id).toBe(petId);
    expect(body.name).toBe('Bruno');
    expect(body.status).toBe('available');
    expect(body).toEqual(createdPet);
  });

  test('PUT /pet updates the pet', async ({ request }) => {
    const response = await send(request, 'PUT', 'pet', updatedPet);

    await expectJson(response, 200);
    expect(await response.json()).toEqual(updatedPet);
  });

  test('GET /pet/{petId} returns the updated values', async ({ request }) => {
    const response = await send(request, 'GET', `pet/${petId}`);

    await expectJson(response, 200);
    const body = await response.json();
    expect(body.id).toBe(petId);
    expect(body.name).toBe('Bruno Updated');
    expect(body.status).toBe('sold');
    expect(body).toEqual(updatedPet);
  });

  test('DELETE /pet/{petId} deletes the pet', async ({ request }) => {
    const response = await send(request, 'DELETE', `pet/${petId}`);

    expect(response.status()).toBe(200);
    expect(await response.text()).toBe('Pet deleted');
  });

  test('GET /pet/{petId} returns 404 after deletion', async ({ request }) => {
    const response = await send(request, 'GET', `pet/${petId}`);

    // Petstore labels this plain-text body as JSON, so assert on the raw text.
    await expectJson(response, 404);
    expect(await response.text()).toBe('Pet not found');
  });

  test('PUT /pet returns 404 for the deleted pet', async ({ request }) => {
    const response = await send(request, 'PUT', 'pet', updatedPet);

    expect(response.status()).toBe(404);
    expect(await response.text()).toBe('Pet not found');
  });
});

test.describe('Petstore /pet error responses', () => {
  test('GET /pet/{petId} with a non-numeric id returns 400', async ({ request }) => {
    const response = await send(request, 'GET', 'pet/not-a-number');

    await expectJson(response, 400);
    const body = await response.json();
    expect(body.code).toBe(400);
    expect(body.message).toContain('Input error');
  });
});
