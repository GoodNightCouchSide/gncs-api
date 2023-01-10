# gncs-api

## Development
### Prequesites

Make sure you have at least Node.js v14, you're running PostgreSQL and create a database called 'gncs_db' before starting the app.

If not:
- Install Postgres
- Check postres installation `psql --version`
- Access Postgres database server `psql`
- `Create database gncs_db;`
- Create User and password (list user with \du)


Create a new `.env` file copying from the `.env.example` file and update the `PSQL_X` values

### Start server

Run installation `npm install`.

Start the app with 
``` npm run dev```

### Test
TBD

Run `npm run test` to run the tests.

### Editor extensions

Recommended extensionsfor your editor for Adonis are as follows:

- VS Code: [Edge template support](https://marketplace.visualstudio.com/items?itemName=luongnd.edge) is a community package to syntax highlight the Edge templates.
- [official AdonisJS extension](https://marketplace.visualstudio.com/items?itemName=jripouteau.adonis-vscode-extension)
