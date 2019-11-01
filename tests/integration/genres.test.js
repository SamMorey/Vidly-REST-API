const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () =>{
    beforeEach(() => {server = require('../../index');});
    afterEach(async () => {
        await server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre with a valid ID', async () => {
            const genre = new Genre({name: 'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return 404 if no genre with the given id exists', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);
            expect(res.status).toBe(404);
        });
    });
    describe('PUT /:id', () => {
        let token;
        let id;
        let name;

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({name});
        }

        beforeEach(async ()=> {
            name = 'genre2';
            const genre = new Genre({name: 'genre1'});
            await genre.save();
            id = genre._id
            token = new User().generateAuthToken();
        });
        afterEach(async () => {
            await Genre.remove({});
            server.close();
        });

        it('should return a 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if no genre with the given id exists', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should return a 400 if the genre is less than 5 chars', async() => {
            name = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return a 400 if the genre is more than 255 chars', async() => {
            name = new Array(257).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return a updated genre if the genre is valid', async() => {
            const res = await exec();

            const genre = await Genre.find({name: 'genre2'});
            expect(genre).not.toBeNull();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name');
        });
    });
    describe('POST /', () => {

        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name: name});
        }

        beforeEach(()=> {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return a 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return a 400 if genre is less than 5 chars', async () => {
            name = '1234';

            const res  = await exec();

            expect(res.status).toBe(400);
        });

        it('should return a 400 if genre is less than 255 chars', async () => {
            name = new Array(257).join('a')
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if its valid', async () => {
            await exec();
            const genre = await Genre.find({name: 'genre1'});

            expect(genre).not.toBeNull();
        });

        it('should save the genre if its valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name');
        });
    });
    describe('DELETE /:id', () => {
        let token;
        let id;

        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
        }

        beforeEach(async ()=> {
            const genre = new Genre({name: 'genre1'});
            await genre.save();
            id = genre._id
            token = new User({isAdmin: true}).generateAuthToken();
        });
        afterEach(async () => {
            await Genre.remove({});
            server.close();
        });

        it('should return a 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return a 403 if client is not an admin', async () => {
            token = new User().generateAuthToken();
            const res = await exec();

            expect(res.status).toBe(403);
        });
        it('should return a 404 if a genre cannot be found', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });
        it('should delete the genre if it exists', async () => {
            const res = await exec();

            const genre = await Genre.find({name: 'genre1'});

            expect(res.status).toBe(200);
            expect(genre).toStrictEqual([]);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name');
        });
    });
});