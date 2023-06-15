process.env.NODE_ENV = 'test';
const { describe } = require('node:test');
const request = require('supertest');

const app = require('../app');

let items = require('../fakeDb');

let item = { name: 'popsicle', price: 1.45 };

beforeEach(() => {
	items.push(item);
});

afterEach(() => {
	// make sure this *mutates*, not redefines, `items`
	items.length = [];
});

// GET /items - returns `{items: [item, ...]}`
describe('GET /items', async () => {
	test('Gets a list of items', async () => {
		const res = await request(app).get(`/items`);
		const { items } = res.body;
		expect(res.statusCode).toBe(200);
		expect(items).toHaveLength(1);
	});
});

// GET /items/:name - returns item `{name: "popsicle", price: 1.45}`
describe('GET /items/:name', async () => {
	test('Gets a single item', async () => {
		const res = await request(app).get(`/items/${item.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.item).toEqual(item);
	});

	test("Responds with 404 if can't find item", async () => {
		const res = await request(app).get(`/items/0`);
		expect(res.statusCode).toBe(404);
	});
});

// POST /items - create item and add to items, returns new item `{name: "popsicle", price: 1.45}`
describe('POST /items', async () => {
	test('Creates a new item', async () => {
		const res = await request(app).post(`/items`).send({
			name: 'pizza',
			price: 2.5,
		});
		expect(res.statusCode).toBe(200);
		expect(res.body.item).toHaveProperty('name');
		expect(res.body.item).toHaveProperty('price');
		expect(res.body.item.name).toEqual('pizza');
		expect(res.body.item.price).toEqual(2.5);
	});
});

// PATCH /items/[name] - update item, returns updated item `{name: "popsicle", price: 1.45}`
describe('PATCH /items/:name', async () => {
	test('Updates a single item', async () => {
		const res = await request(app).patch(`/items/${item.name}`).send({
			name: 'pizza',
			price: 2.5,
		});
		expect(res.statusCode).toBe(200);
		expect(res.body.item).toEqual({
			name: 'pizza',
			price: 2.5,
		});
	});

	test("Responds with 404 if can't find item", async () => {
		const res = await request(app).patch(`/items/0`);
		expect(res.statusCode).toBe(404);
	});
});

// DELETE /items/[name] - delete item, returns `{message: "Deleted"}`
describe('DELETE /items/:name', async () => {
	test('Deletes a single a item', async () => {
		const res = await request(app).delete(`/items/${item.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Deleted' });
	});
});
