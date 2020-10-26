#!/bin/bash
# 
# Download IBM-MQ Client Library
source $PWD/scripts/functions.sh
source $PWD/scripts/globals.sh
# Options
SKIP_PROMPT='false'
while getopts ':y' flag; do
  case "${flag}" in
    y ) SKIP_PROMPT='true' ;;
    * ) err "Unexpected option ${flag}" ;;
  esac
done

# Variables
CURRENT_OS=$(get_os)
CLIENT_DIR=$PWD/client
CLIENT_TAR="$CLIENT_DIR/client.tar.gz" # Alter directory or 

# Functions
function download_tar {
    echo "Downloading IBMQ Client for OS {$CURRENT_OS}"
    mkdir $CLIENT_DIR
    curl -L "${ibmmq_client_libs[$1]}" -o $CLIENT_TAR
    echo "Download successful!"
}

function expand_tar {
    if [ $SKIP_PROMPT == "true" ]; then
        do_tar_expansion
    else
        echo "Would you like to untar this file? $CLIENT_TAR"    
        select yn in "Yes" "No"; do
            case $yn in
                Yes ) do_tar_expansion; break;;
                No ) echo "Will not untar..."; break;;
                * ) echo "Please answer Yes(1) or No(2).";;
            esac
        done
    fi
}

function do_tar_expansion {
    tar -xzf $CLIENT_TAR --directory $CLIENT_DIR
}

function untar_complete {
    if [ -d "$CLIENT_DIR/lib64" ]; then
        echo "Untar successful, client library found here..."
        echo  "$CLIENT_DIR/lib64"
    fi
}

if test -f "$CLIENT_TAR"; then
    echo "Client lib already downloaded..."
    expand_tar
    untar_complete
    exit 0
fi

if [ $CURRENT_OS == "Unknown" ]
then
    echo "Unsupported Client Lib"
    echo "Add file to this library to support your os"
    exit 1
fi

download_tar $CURRENT_OS
expand_tar
untar_complete