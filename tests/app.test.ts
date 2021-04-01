import assert from 'assert';
import axios from 'axios'
import { Server } from 'http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import url from 'url';
import appFunc from '../appFunc';

let app: any;
let port: any;


const getUrl = (pathname?: string) => url.format({
    hostname: app.get('host') || 'localhost',
    protocol: 'http',
    port,
    pathname
});


describe('Test app is running', () => {
    let server: Server;
    let mongoServer: any;

    beforeAll(async done => {
        mongoServer = new MongoMemoryServer();
        process.env.MONGODBURI = await mongoServer.getUri();
        app = appFunc();
        port = app.get('port') || 8998;
        server = app.listen(port);
        server.once('listening', () => done());
    });

    afterAll(async done => {
    server.close(done);
    await mongoServer.stop();
  });

  it('starts and shows the index page', async () => {
    expect.assertions(1);

    const { data } = await axios.get(getUrl());

    expect(data.indexOf('<html lang="en">')).not.toBe(-1);
  });


  it('shows a 404 HTML page', async () => {
      expect.assertions(2);

      try {
        await axios.get(getUrl('path/to/nowhere'), {
          headers: {
            'Accept': 'text/html'
          }
        });
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data.indexOf('<html>')).not.toBe(-1);
      }
    });

    it('shows a 404 JSON error without stack trace', async () => {
      expect.assertions(4);

      try {
        await axios.get(getUrl('path/to/nowhere'));
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data.code).toBe(404);
        expect(response.data.message).toBe('Page not found');
        expect(response.data.name).toBe('NotFound');
      }
    });


});