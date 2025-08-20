# WebBioinformaticsForum
Bioinformatics workflow pipelines targeted web forum project

## API usage
 - `GET     http://localhost:8000/api/parameters/` list parameters
 - `GET     http://localhost:8000/api/parameters/<id>/` get parameter
 - `PUT     http://localhost:8000/api/parameters/<id>/` update parameter
 - `DELETE  http://localhost:8000/api/parameters/<id>/` delete parameter
 - `GET     http://localhost:8000/api/processes/` list processes
 - `GET     http://localhost:8000/api/processes/<id>/` get process
 - `PUT     http://localhost:8000/api/processes/<id>/` update process
 - `DELETE  http://localhost:8000/api/processes/<id>/` delete process
 - `GET     http://localhost:8000/api/pipelines/` list pipelines
 - `GET     http://localhost:8000/api/pipelines/<id>/` get pipeline
 - `PUT     http://localhost:8000/api/pipelines/<id>/` update pipeline
 - `DELETE  http://localhost:8000/api/pipelines/<id>/` delete pipeline

## Dependencies
### `src/BACKEND/requirements.txt`
 - Django, Django-REST-framework, Pillow, pytest

### `test/pipeline-dag-test/package.json`
 - React, ReactFlow

## Version
A00.1
