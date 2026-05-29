#!/bin/bash
# Tail the engine logs and filter for critical sync events
pm2 logs optischedule-engine --raw --lines 0 | grep --line-buffered "sync"
