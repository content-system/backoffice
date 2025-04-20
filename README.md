# backoffice

## Available Scripts

### `npm start`

Runs the app in the development mode.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run prod`

Runs the app for production in the `dist` folder.

## Architecture

![User Role Service](https://cdn-images-1.medium.com/max/800/1*Gm0dypLuYaPwGM8UzrzV7w.png)

## Business Features

- User management
- Role management

## Other Features

- Authentication
  - Log in by LDAP
  - After logged in, get all privileges based on roles of that user
- Authorization: Separate the "read" and "write" permissions for 1 role, using bitwise. For example:
  - 001 (1 in decimal) is "read" permission
  - 010 (2 in decimal) is "write" permission
  - 100 (4 in decimal) is "delete" permission
  - "read" and "write" permission will be "001 | 010 = 011" (011 is 3 in decimal)

## Libraries

### libraries for authentication

- authen-service
- multer: handle form-data for authentication

### libraries for authorization

- security-express
- jsonwebtoken
- jsonwebtoken-plus
- cookie-parser: for cookie token

### libraries for xml mapper (use to search users and search roles)

- query-templates
