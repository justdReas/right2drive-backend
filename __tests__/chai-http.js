const { expect } = require('chai');
const chai = require('chai')
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const HOST = process.env.HOST || "http://localhost:4000/users"




// describe("Testing right2drive with chaitest", () => {
// 	describe('/get all', () => {
// 		it('should get all the users', (done) => {
//         chai.request(HOST)
// 			.get('/')
//             .end((err, res) => {
//                 expect(res).to.have.status(200)
//                 expect(res.body).to.not.be.null
//                 expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
//                 expect(res).to.be.json;
//                 done()
//             })
// 		})
// 	})
// })


const newUsers = {
	"category": {
	  "name": "string"
	},
	"firstname": "test",
	"lastname": "test2",
    "email":"test@gmil.com",
    "phone":"97865443",
    "date":"20/30/2022",
	"status": "available"
}


describe("Testing right2drive with chaitest", () => {
	describe('given POST /newuser', () => {
		it('should add new user', () => {
        chai.request(HOST)
			.post('/')
			.send(newUsers)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                expect(res).to.be.json;
                expect(res.body).to.have.property('id')
            })
		})
	})
})