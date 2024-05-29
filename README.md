## Description

[Nest](https://github.com/nestjs/nest) This repository was created via "nest new"

## Running app locally

1. First, git clone the repository
2. Create an ".env" file at the root folder, and create an env variable named "JWT_SECRET".
   Secret can be generated via the CLI command: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
3. Run "npm install" to install the necessary packages.
4. Run "npx tsc" to compile TS files into JS.
5. Run the migrations via "npm run typeorm -- migration:run". This will set up tables for database.
6. Run "npm start" to start the server, which will start listening at the localhost:3000 port.
7. You can also run "npm run test:e2e" to run end to end test, which pretty much covers most of the endpoints.

## APIs

All endpoints of the app is included in the "apis.json" file.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
