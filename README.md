# IT5007 Project
This README is for running the project. \
For project overview and docs, please refer to: [Project Overview](https://antheajfw.github.io/IT5007-Project/?path=/story/it5007-revised-project-problem-formulation--page)

Demo Video: [https://www.youtube.com/watch?v=UYgjg5H39oo](https://www.youtube.com/watch?v=UYgjg5H39oo)  
_Note: The missing 'Submit' button is fixed in the actual mobile application view. The demonstration was recorded prior to the fix._

## Contributors

* Wong Ji Fong (A0249572U) 
* Cara Chiang En Huan (A0255959H)
* Ryan Chan Wei Yang (A0170559X)

# Running the app
_When in doubt, we've added more instructions in the link provided above_
If the server is available, it should be reachable at [http://157.230.195.31/](http://157.230.195.31/).

Example login details available below.

For ease of running, the container has been built and uploaded to dockerhub.
To run the image, make sure `docker-compose` is installed, and run the service using 
```
docker-compose -f docker-compose.yml up
```

To get a better idea of how the app works, a init script has also been provided inside 
the server container.

In another terminal, find the name of the running container for the server.
Use `docker container ls --all` to identify the container that is the server for image 
`it5007-course-project-meme-stack:init`.
This can look like `it5007-project_server_1` or `course-project-meme-stack_server_1` (current folder 
name + `_server_1`). Execute the following (replacing the container) name if its different:
```
docker exec -it it5007-project_server_1 sh
```
Ensure that you're in the server container by checking that it starts with `/server #`.
Then run the seeding script 
```
node ./seedMongoDB.js
```

If all goes well, the container should have some data seeded. Log in using the following.  
Username: `admin@nus`  
Password: `admin` . 

The app should be running on port `3000` (Frontend served by express as it is now built)  
Documentation and information about our project can be found at `/docs`  
API endpoint documentation can be found at `/api-docs`

## Development
### Requires
- [yarn](https://yarnpkg.com/getting-started/install)

Once installed, in client and server individually, run:
```bash
yarn install
```

### Recommended method using docker compose development environment
In Unix based systems:
```bash
# Following only has to be run once:
chmod +x ./scripts/start_services_dev.sh
# Then this to start the dev server
./scripts/start_services_dev.sh
```
This should start the `docker-compose` dev server with environment variables set in the docker file. 

### Running the app locally for development (manual)
Ensure that mongo db is running at port `27017` on local machine.

In one terminal, `cd client` and run:
```bash
yarn start
```

In another terminal, `cd server`. Create a file in the server with:
```bash
touch .env
```
Then in the file, export or assign environment variables for `SECRET_KEY` and `MONGODB_CONNSTRING`. See 
`docker-compose.dev.yml` for reference. This will be read in at development run time in the server application
via `dotenv`. After, run the dev server application:
```bash
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Building the app
To build the client app to server, `cd client` and run:
```bash
yarn build
```
Builds the app for production to the `./server/public` folder for use with express app.\
It correctly bundles React in production mode and optimizes the build for the best performance.

Once built, run the server with
```bash
cd server
yarn start # Development
yarn serve # Production
```

### Updating storybook docs
Before commiting to main repo, should there be any changes made to `src/stories` please run:
```bash
yarn build-storybook
```
This builds the storybook docs to `/docs` folder for which is configured to automatically 
be served via github pages.

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

## Manual
Change `package.json` proxy to `http://server:3001`.
```bash
docker-compose -f docker-compose.dev.yml up
```
After building the images, this can be changed back to `http://localhost:3001`.

