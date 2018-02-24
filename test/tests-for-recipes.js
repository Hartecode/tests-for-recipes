const chai = require('chai');
const chaiHttp = require('chai-http');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {app, runServer, closeServer} = require('../server');


const should = chai.should();

chai.use(chaiHttp);

describe('Recipes', function(){

	before(function() {
		return runServer();
	});

	after(function() {
	    return closeServer();
	});

	//get testing
	it('should list items on GET', function(){
		return chai.request(app)
		.get('/recipes')
		.then(function(res){
			res.should.to.have.status(200);
	        res.should.to.be.json;
	        res.body.should.be.a('array');

	        res.body.should.have.length.to.be.at.least(1);

	        const expectedKeys = ['id','name', 'ingredients'];
	        res.body.forEach(function(item) {
	          item.should.to.be.a('object');
	          item.should.to.include.keys(expectedKeys);
	        });
		});
	});

	//post test
	it('should add an item on POST', function(){
		const newItem = {name: 'coffee', ingredients: ['beans', 'hot water', 'cream']};
		return chai.request(app)
			.post('/recipes')
			.send(newItem)
			.then(function(res) {
			   res.should.have.status(201);
			   res.should.be.json;
			   res.body.should.be.a('object');
			   res.body.should.include.keys('id', 'name', 'ingredients');
			   res.body.name.should.equal(newItem.name);
			   res.body.ingredients.should.be.a('array');
			   res.body.ingredients.should.include.members(newItem.ingredients);
			});

	});

	//put test
	it('should update items on PUT', function(){
		const updateData = {
		    name: 'testing',
		    ingredients: ['testA', 'testB', 'testC']
		}
		return chai.request(app)
			.get('/recipes')
			.then(function(res){
				updateData.id = res.body[0].id;
				return chai.request(app)
					.put(`/recipes/${updateData.id}`)
					.send(updateData)
			})
			.then(function(res){
				res.should.to.have.status(204);
			});
	});

	//delete test
	it('should delete items on DELETE', function(){
		return chai.request(app)
			.get('/recipes')
			.then(function(res){
				return chai.request(app)
					.delete(`/recipes/${res.body[0].id}`);
			})
			.then(function(res){
				res.should.to.have.status(204);
			});
	});


});