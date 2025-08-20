# WebBioinformaticsForum
Bioinformatics workflow pipelines targeted web forum project

## API usage
 - `GET     http://localhost:8000/api/parameters/` list parameters
 - `GET     http://localhost:8000/api/parameters/<pk>/` get parameter
 - `PUT     http://localhost:8000/api/parameters/<pk>/` update parameter
 - `DELETE  http://localhost:8000/api/parameters/<pk>/` delete parameter
 - `GET     http://localhost:8000/api/processes/` list processes
 - `GET     http://localhost:8000/api/processes/<pk>/` get process
 - `PUT     http://localhost:8000/api/processes/<pk>/` update process
 - `DELETE  http://localhost:8000/api/processes/<pk>/` delete process
 - `GET     http://localhost:8000/api/pipelines/` list pipelines
 - `GET     http://localhost:8000/api/pipelines/<pk>/` get pipeline
 - `PUT     http://localhost:8000/api/pipelines/<pk>/` update pipeline
 - `DELETE  http://localhost:8000/api/pipelines/<pk>/` delete pipeline

## Dependencies
### `src/BACKEND/requirements.txt`
 - Django, Django-REST-framework, Pillow, pytest

### `test/pipeline-dag-test/package.json`
 - React, ReactFlow

## Version
A00.1
