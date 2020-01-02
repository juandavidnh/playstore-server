const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps endpoint', () => {
    it('should display an array', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
            })
    });

    it('should only allow \'rating\' or \'app\' for sort query', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'MISTAKE'})
            .expect(400, 'Sort must be by rating or app');
    });

    it('should only allow some inputs for genres query', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'MISTAKE' })
            .expect(400, 'Genre not found');
    });

    it('should show specific keys', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .then(res => {
                for(let i=0; i<res.body.length; i++){
                    expect(res.body[i]).to.include.all.keys('App', 'Category', 'Rating', 'Reviews', 'Size', 'Genres')
                }
            })
    });

    it('should sort according to App', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'App'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                let sorted = true;

                for(let i=0; i<(res.body.length - 1); i++){
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if(appAtIPlus1.App < appAtI.App){
                        sorted = false;
                        break;
                    }
                }

                expect(sorted).to.be.true;
            });
    });

    it('should sort according to Rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                let sorted = true;

                for(let i=0; i<(res.body.length - 1); i++){
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if(parseFloat(appAtIPlus1.Rating) < parseFloat(appAtI.Rating)){
                        sorted = false;
                        break;
                    }
                }

                expect(sorted).to.be.true;
            });
    });

    it('should only return apps that satisfy genre filter', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'Action'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                let filtered = true;

                for(let i = 0; i < res.body.length; i++){
                    if(!res.body[i].Genres.includes('Action')){
                        filtered = false;
                        break;
                    }
                }

                expect(filtered).to.be.true;
            });
    });
})