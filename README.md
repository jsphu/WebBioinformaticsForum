# WebBioinformaticsForum
Bioinformatics workflow pipelines targeted web forum project

## API Documentation

### Authentication
```
POST    /api/login/         obtain token
POST    /api/refresh/       refresh token
```

### Users
```
GET     /api/users/                     list users
GET     /api/users/<id>/                get user
POST    /api/users/<id>/follow/         follow user
POST    /api/users/<id>/unfollow/       unfollow user
GET     /api/users/<id>/followers/      get user followers
GET     /api/users/<id>/following/      get user following
```

### Reports
```
GET     /api/reports/                   list reports
GET     /api/reports/<id>/              get report
GET     /api/reports/my_reports/        get my reports
GET     /api/reports/pending/           get pending reports
GET     /api/reports/statistics/        get report statistics
POST    /api/reports/<id>/resolve/      resolve report
POST    /api/reports/<id>/unresolve/    unresolve report
PATCH   /api/reports/<id>/set_tag/      set report tag
```

### Posts
```
GET     /api/posts/                     list posts
GET     /api/posts/<id>/                get post
PUT     /api/posts/<id>/                update post
DELETE  /api/posts/<id>/                delete post
POST    /api/posts/<id>/like/           like post
GET     /api/posts/<id>/likes/          get post likes
POST    /api/posts/<id>/share/          share post
GET     /api/posts/<id>/shares/         get post shares
```

### Pipelines
```
GET     /api/pipelines/                 list pipelines
GET     /api/pipelines/<id>/            get pipeline
PUT     /api/pipelines/<id>/            update pipeline
DELETE  /api/pipelines/<id>/            delete pipeline
POST    /api/pipelines/<id>/like/       like pipeline
GET     /api/pipelines/<id>/likes/      get pipeline likes
POST    /api/pipelines/<id>/share/      share pipeline
GET     /api/pipelines/<id>/shares/     get pipeline shares
GET     /api/pipelines/<id>/processes/  get pipeline processes
```

### Processes
```
GET     /api/processes/                 list processes
GET     /api/processes/<id>/            get process
PUT     /api/processes/<id>/            update process
DELETE  /api/processes/<id>/            delete process
POST    /api/processes/<id>/like/       like process
GET     /api/processes/<id>/likes/      get process likes
POST    /api/processes/<id>/share/      share process
GET     /api/processes/<id>/shares/     get process shares
GET     /api/processes/<id>/parameters/ get process parameters
```

### Parameters
```
GET     /api/parameters/                list parameters
GET     /api/parameters/<id>/           get parameter
PUT     /api/parameters/<id>/           update parameter
DELETE  /api/parameters/<id>/           delete parameter
POST    /api/parameters/<id>/like/      like parameter
GET     /api/parameters/<id>/likes/     get parameter likes
POST    /api/parameters/<id>/share/     share parameter
GET     /api/parameters/<id>/shares/    get parameter shares
```


### Comments
```
GET     /api/posts/<post_id>/comments/              list post comments
POST    /api/posts/<post_id>/comments/              create post comment
GET     /api/posts/<post_id>/comments/<id>/         get post comment
PUT     /api/posts/<post_id>/comments/<id>/         update post comment
DELETE  /api/posts/<post_id>/comments/<id>/         delete post comment
POST    /api/posts/<post_id>/comments/<id>/like/    like post comment
GET     /api/posts/<post_id>/comments/<id>/likes/   get post comment likes
GET     /api/shares/<share_id>/comments/              list share comments
POST    /api/shares/<share_id>/comments/              create share comment
GET     /api/shares/<share_id>/comments/<id>/         get share comment
PUT     /api/shares/<share_id>/comments/<id>/         update share comment
DELETE  /api/shares/<share_id>/comments/<id>/         delete share comment
POST    /api/shares/<share_id>/comments/<id>/like/    like share comment
GET     /api/shares/<share_id>/comments/<id>/likes/   get share comment likes
GET     /api/pipelines/<pipeline_id>/comments/              list pipeline comments
POST    /api/pipelines/<pipeline_id>/comments/              create pipeline comment
GET     /api/pipelines/<pipeline_id>/comments/<id>/         get pipeline comment
PUT     /api/pipelines/<pipeline_id>/comments/<id>/         update pipeline comment
DELETE  /api/pipelines/<pipeline_id>/comments/<id>/         delete pipeline comment
POST    /api/pipelines/<pipeline_id>/comments/<id>/like/    like pipeline comment
GET     /api/pipelines/<pipeline_id>/comments/<id>/likes/   get pipeline comment likes
GET     /api/processes/<process_id>/comments/              list process comments
POST    /api/processes/<process_id>/comments/              create process comment
GET     /api/processes/<process_id>/comments/<id>/         get process comment
PUT     /api/processes/<process_id>/comments/<id>/         update process comment
DELETE  /api/processes/<process_id>/comments/<id>/         delete process comment
POST    /api/processes/<process_id>/comments/<id>/like/    like process comment
GET     /api/processes/<process_id>/comments/<id>/likes/   get process comment likes
GET     /api/parameters/<parameter_id>/comments/              list parameter comments
POST    /api/parameters/<parameter_id>/comments/              create parameter comment
GET     /api/parameters/<parameter_id>/comments/<id>/         get parameter comment
PUT     /api/parameters/<parameter_id>/comments/<id>/         update parameter comment
DELETE  /api/parameters/<parameter_id>/comments/<id>/         delete parameter comment
POST    /api/parameters/<parameter_id>/comments/<id>/like/    like parameter comment
GET     /api/parameters/<parameter_id>/comments/<id>/likes/   get parameter comment likes
```

### Shares
```
GET     /api/shares/                    list shares
GET     /api/shares/<id>/               get share
PUT     /api/shares/<id>/               update share
DELETE  /api/shares/<id>/               delete share
POST    /api/shares/<id>/like/          like share
GET     /api/shares/<id>/likes/         get share likes
GET     /api/posts/<post_id>/shares/                list post shares
GET     /api/posts/<post_id>/shares/<id>/           get post share
POST    /api/posts/<post_id>/shares/<id>/like/      like post share
GET     /api/posts/<post_id>/shares/<id>/likes/     get post share likes
GET     /api/pipelines/<pipeline_id>/shares/                list pipeline shares
GET     /api/pipelines/<pipeline_id>/shares/<id>/           get pipeline share
POST    /api/pipelines/<pipeline_id>/shares/<id>/like/      like pipeline share
GET     /api/pipelines/<pipeline_id>/shares/<id>/likes/     get pipeline share likes
GET     /api/processes/<process_id>/shares/                list process shares
GET     /api/processes/<process_id>/shares/<id>/           get process share
POST    /api/processes/<process_id>/shares/<id>/like/      like process share
GET     /api/processes/<process_id>/shares/<id>/likes/     get process share likes
GET     /api/parameters/<parameter_id>/shares/                list parameter shares
GET     /api/parameters/<parameter_id>/shares/<id>/           get parameter share
POST    /api/parameters/<parameter_id>/shares/<id>/like/      like parameter share
GET     /api/parameters/<parameter_id>/shares/<id>/likes/     get parameter share likes
```


## Dependencies
### `src/BACKEND/requirements.txt`
 - Django, Django-REST-framework, Pillow, pytest

### `test/WBFdb/requirements.txt`
 - Django, Django-REST-framework, django-extensions ...

### `test/pipeline-dag-test/package.json`
 - React, ReactFlow

## Version
0.3.5
