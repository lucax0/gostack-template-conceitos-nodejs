const express = require("express");
const { uuid , isUuid } = require('uuidv4');
const cors = require("cors");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(request, response, next){
  const { id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ "error": "Invalid Repositorie ID" });
  }

  return next();
}

function logRequests(request, response, next){  
  const { method, url } = request;  //desestruturacao de obj 

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();
  
  console.timeEnd(logLabel);
}

app.use(logRequests);

app.get("/repositories", (request, response) => {  

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const { title, url,techs} = request.body;
  const repositorie = { id: uuid(), title: title, url: url,techs: techs, likes: 0};

  repositories.push(repositorie);

  return response.json(repositories);

});

app.put("/repositories/:id",validateRepoId, (request, response) => {
  const { id } = request.params;

  const { title, url,techs} = request.body;

  const repoPosition = repositories.findIndex(repositorie => repositorie.id === id);  

  const likes = repositories[repoPosition].likes;

  if (repoPosition < 0) {
    return response.status(400).json({ "Error": "Repositorie Not Found" });
  }  

  const repositorie = {id ,title, url, techs, likes}

  repositories[repoPosition] = repositorie;

  return response.json({
    "Status": "Update Sucessfull",
    "Updated Repositorie": repositorie
  })

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoPosition = repositories.findIndex(repositorie => repositorie.id === id); 
  
  if (repoPosition < 0) {
    return response.status(400).json({ "Error": "Repositorie Not Found" });
  }  

  repositories.splice(repoPosition, 1);

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoPosition = repositories.findIndex(repositorie => repositorie.id === id); 

  if (repoPosition < 0) {
    return response.status(400).json({ "Error": "Repositorie Not Found" });
  }  

  const repositorie = repositories[repoPosition];

  repositorie.likes = repositorie.likes + 1;

  repositories[repoPosition] = repositorie;

  return response.json(repositorie);
});

module.exports = app;
