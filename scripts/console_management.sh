#!/bin/bash
# execute management commands against your instance of ibmmq

function ibm() {
    docker exec -it $(docker ps | grep ibmcom/mq | awk '{print $1}') $@
}