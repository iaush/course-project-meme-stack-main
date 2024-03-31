#!/bin/sh

if [ ! -n "$DOCKER" ]; then
    echo "DOCKER variable is unset. Please set this"
    exit 2
fi

CONTAINERID=$(docker container ls --all | grep "it5007-course-project-meme-stack:init" | cut -d' ' -f 1)
docker commit $CONTAINERID $DOCKER/it5007-course-project-meme-stack:init
docker push $DOCKER/it5007-course-project-meme-stack:init