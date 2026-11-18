const request = require('supertest');

const app = require('../app');


describe("GET /movies",()=>{
  test("returns 200 and a list of movies",async ()=>{

    //Act
    const res = await request(app).get("/movies");
    
    //Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  })
})