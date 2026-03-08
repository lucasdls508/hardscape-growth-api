#!/bin/bash

# PostgreSQL 18 Docker Replication Setup - Pure Docker (No docker-compose)
# This script works without docker-compose installed

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PostgreSQL 18 Docker Replication - Pure Docker     ║${NC}"
echo -e "${BLUE}║  (No docker-compose required)                       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}\n"

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker available${NC}\n"

# Step 1: Cleanup
echo -e "${BLUE}Step 1: Cleaning up old setup...${NC}"
docker stop postgres-primary postgres-replica 2>/dev/null || true
docker rm postgres-primary postgres-replica 2>/dev/null || true
docker volume rm primary_data replica_data 2>/dev/null || true
docker network rm postgres-network 2>/dev/null || true
sleep 2
echo -e "${GREEN}✓ Cleanup complete${NC}\n"

# Step 2: Create network
echo -e "${BLUE}Step 2: Creating Docker network...${NC}"
docker network create postgres-network 2>/dev/null || true
echo -e "${GREEN}✓ Network created${NC}\n"

# Step 3: Create volumes
echo -e "${BLUE}Step 3: Creating volumes...${NC}"
docker volume create primary_data 2>/dev/null || true
docker volume create replica_data 2>/dev/null || true
echo -e "${GREEN}✓ Volumes created${NC}\n"

# Step 4: Start Primary
echo -e "${BLUE}Step 4: Starting Primary PostgreSQL (port 5432)...${NC}"
docker run -d \
  --name postgres-primary \
  --network postgres-network \
  -e POSTGRES_DB=testdb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -p 5432:5432 \
  -v primary_data:/var/lib/postgresql/data \
  postgres:18 \
  postgres \
    -c wal_level=replica \
    -c max_wal_senders=10 \
    -c max_replication_slots=10 \
    -c hot_standby=on

echo -e "${GREEN}✓ Primary started${NC}"
echo -e "${YELLOW}Waiting for primary to be ready...${NC}"

# Wait for primary to be ready
for i in {30..1}; do
    if docker exec postgres-primary pg_isready -U postgres > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Primary is ready${NC}\n"
        break
    fi
    echo -ne "\rWaiting... ${i}s"
    sleep 1
done

# Step 5: Start Replica
echo -e "${BLUE}Step 5: Starting Replica PostgreSQL (port 5433)...${NC}"
docker run -d \
  --name postgres-replica \
  --network postgres-network \
  -e PGUSER=postgres \
  -e PGPASSWORD=postgres123 \
  -p 5433:5432 \
  -v replica_data:/var/lib/postgresql/data \
  postgres:18 \
  bash -c "
    rm -rf /var/lib/postgresql/data/* && \
    pg_basebackup -h postgres-primary -D /var/lib/postgresql/data -U postgres -v -P && \
    touch /var/lib/postgresql/data/standby.signal && \
    postgres
  "

echo -e "${GREEN}✓ Replica started${NC}"
echo -e "${YELLOW}Waiting for replica backup (1-2 minutes)...${NC}\n"

# Wait for replica to be ready
for i in {120..1}; do
    if docker exec postgres-replica pg_isready -U postgres > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Replica is ready${NC}\n"
        break
    fi
    echo -ne "\rWaiting... ${i}s"
    sleep 1
done

# Step 6: Verify Setup
echo -e "${BLUE}Step 6: Verifying setup...${NC}"

echo -n "Primary: "
if docker ps | grep -q postgres-primary; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

echo -n "Replica: "
if docker ps | grep -q postgres-replica; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

echo -n "Network: "
if docker network ls | grep -q postgres-network; then
    echo -e "${GREEN}✓ Created${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

echo -n "Primary accepting connections: "
if docker exec postgres-primary pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Yes${NC}"
else
    echo -e "${RED}✗ No${NC}"
fi

echo -n "Replica accepting connections: "
if docker exec postgres-replica pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Yes${NC}"
else
    echo -e "${RED}✗ No${NC}"
fi

# Check replication status
echo -e "\n${BLUE}Step 7: Checking replication status...${NC}"
sleep 2
REPLICAS=$(docker exec postgres-primary psql -U postgres -t -c "SELECT COUNT(*) FROM pg_stat_replication;" 2>/dev/null)

if [ ! -z "$REPLICAS" ] && [ "$REPLICAS" -gt 0 ]; then
    echo -e "${GREEN}✓ Replica connected to primary${NC}"
    echo -e "${BLUE}Replication details:${NC}"
    docker exec postgres-primary psql -U postgres -c "SELECT client_addr, state FROM pg_stat_replication;"
else
    echo -e "${YELLOW}⟳ Replica still initializing...${NC}"
    echo -e "${YELLOW}Wait another minute and check with:${NC}"
    echo -e "${YELLOW}  docker exec postgres-primary psql -U postgres -c \"SELECT * FROM pg_stat_replication;\"${NC}"
fi

# Summary
echo -e "\n${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}Connection Information:${NC}"
echo -e "  ${YELLOW}Primary (port 5432):${NC}"
echo -e "    psql -h localhost -p 5432 -U postgres -d testdb"
echo -e "  ${YELLOW}Replica (port 5433):${NC}"
echo -e "    psql -h localhost -p 5433 -U postgres -d testdb"

echo -e "\n${BLUE}Verify replication:${NC}"
echo -e "  ${YELLOW}docker exec postgres-primary psql -U postgres -d testdb -c \"CREATE TABLE test (id INT); INSERT INTO test VALUES (1);\"${NC}"
echo -e "  ${YELLOW}docker exec postgres-replica psql -U postgres -d testdb -c \"SELECT * FROM test;\"${NC}"

echo -e "\n${BLUE}Monitor logs:${NC}"
echo -e "  ${YELLOW}docker logs -f postgres-primary${NC}"
echo -e "  ${YELLOW}docker logs -f postgres-replica${NC}"

echo -e "\n${BLUE}Stop everything:${NC}"
echo -e "  ${YELLOW}docker stop postgres-primary postgres-replica${NC}"
echo -e "  ${YELLOW}docker rm postgres-primary postgres-replica${NC}"
echo -e "  ${YELLOW}docker volume rm primary_data replica_data${NC}"

echo -e "\n"