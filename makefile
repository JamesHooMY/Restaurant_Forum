run:
	npm run dev

db:
	docker-compose -f ./build/docker-compose.yml up -d

migrate:
	npx sequelize db:migrate

seed:
	npx sequelize db:seed:all