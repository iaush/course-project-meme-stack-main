# IT5007 Express server backend
### Requirements
- [yarn](https://yarnpkg.com/getting-started/install)

### Setup
```bash
yarn install
```

Create a `.env` file with the following defined:
 - SECRET_KEY

### Commands
Start development server
```bash
yarn start
```

Start production server
```bash
yarn serve
```

If port is not specified, starts app at `localhost:3001`.
Once started, see [http://localhost:3001/api-docs](http://localhost:3001/api-docs) 
for more information on apis available.

### Docker image for development
Build image
```bash
docker build -f dev.dockerfile -t [tag-name] .
```
Where the tag name is in the form of [appName]:[version]

Running the image as a container
```bash
docker run -p 3001:3001 -t [tag-name]
```