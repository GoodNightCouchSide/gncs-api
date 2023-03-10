# gncs-api

## Development
### Prequesites

Make sure you have at least Node.js v14, you're running PostgreSQL and create a database called 'gncs_db' before starting the app.

If not:
- Install Postgres
- Check postres installation `psql --version`
- Access Postgres database server `psql`
- Create database with `Create database gncs_db;`
- list user with \du
- list databases: \l

Create a new `.env` file copying from the `.env.example` file and update the `PSQL_X` values

To test, if the database is connected to the server and healthy, check [http://127.0.0.1:3333/_api/health](http://127.0.0.1:3333/_api/health)

### Start server
Run installation `npm install`.

Before you start you need to:

- Migrate the database: Run the following command to run migration.

```bash
npm run migrate
```

Start the app with 
``` npm run dev```

### Test
AdonisJS uses [Japa](https://japa.dev/) for writing and executing tests. So we do.

Make sure you've created a database called `gncs_test`.
Update the file `.env.test` [See documentation`](https://docs.adonisjs.com/guides/testing/introduction#environment-variables) and add the `PSQL_` values to use the test database.
Make sure you have set the `SESSION_DRIVER` to `memory`. `SESSION_DRIVER` is switched to persist session data within memory and access it during tests. Using any other driver will break the tests.


Run `npm run test` to run the tests.

Japa uses [Chai assertions](https://www.chaijs.com/api/assert/)

### Test routes and see Database Models with swagger
#### Routes
To list all available routes run `node ace list:routes`

To checkout the swagger UI, go to [/docs](http://127.0.0.1:3333/docs). Here you can test each endpoint (don't forget the `execute` button!)

#### Database
You can also see the database models on swagger. 
This is defined in the swagger file at `docs/swagger/gncs-api.yml`
Search for `components` and you can see the database parts.
To checkout the swagger UI, go to [/docs](http://127.0.0.1:3333/docs) and scroll down.

### Deployment
On the app server you need to create the database and user initially

```
CREATE USER gncs_user with encrypted password 'password';
CREATE DATABASE gncs_db;
GRANT ALL PRIVILEGES ON DATABASE gncs_db TO gncs_user;
```

### Editor extensions

Recommended extensionsfor your editor for Adonis are as follows:

- VS Code: [Edge template support](https://marketplace.visualstudio.com/items?itemName=luongnd.edge) is a community package to syntax highlight the Edge templates.
- [official AdonisJS extension](https://marketplace.visualstudio.com/items?itemName=jripouteau.adonis-vscode-extension)
- [Swagger Viewer](https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer)
- [OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi)
