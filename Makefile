build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

log:
	docker logs -f backend

sh:
	docker exec -it backend bash
