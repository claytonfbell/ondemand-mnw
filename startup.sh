#!/bin/bash
cd "$(dirname "$0")"
pm2 start yarn --name "nextjs" --interpreter bash -- start
