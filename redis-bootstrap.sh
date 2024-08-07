# set redis args
ARGS="--protected-mode no --appendonly yes  --loglevel warning --loadmodule /opt/redis-stack/lib/redisearch.so --loadmodule /opt/redis-stack/lib/rejson.so"
# start server in background and wait for 1 sec
echo $ARGS | xargs redis-server --daemonize yes && sleep 1
# slurp all data from file to redis in memory db (note the dir)
redis-cli < /seed-data.redis 
# persist data to disk
redis-cli save 
# stop background server
redis-cli shutdown 
# start the server normally
echo $ARGS | xargs redis-server
