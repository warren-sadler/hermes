#!/bin/bash

function get_os {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            echo "Linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
            echo "MacOS"
    else
            echo "Unknown"
    fi
}

function err() {
  echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')]: $*" >&2
}