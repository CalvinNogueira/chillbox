.PHONY: install start stop clean fix-perms

# La commande magique à lancer après un git clone
install:
	@echo "Installation des dépendances et démarrage des conteneurs..."
	sudo docker compose up -d
	sudo docker compose exec backend composer install
	@echo "Le frontend installe ses dépendances npm tout seul au démarrage (voir la commande du service frontend)."
	@echo "Configuration de la base de données..."
	sudo docker compose exec backend php bin/console doctrine:database:create --if-not-exists
	sudo docker compose exec backend php bin/console doctrine:migrations:migrate -n --allow-no-migration
	@echo "======================================================"
	@echo "🚀 Projet prêt !"
	@echo "🌍 Frontend (Angular) : http://localhost:4200"
	@echo "⚙️  Backend (API Platform) : http://localhost:8000/api"
	@echo "======================================================"

# Pour démarrer au quotidien sans tout réinstaller
start:
	sudo docker compose up -d

# Pour couper l'environnement
stop:
	sudo docker compose down

# Pour tout détruire (y compris la base de données)
clean:
	sudo docker compose down -v

# Pratique sous Linux : te redonne les droits sur les fichiers créés par root dans les conteneurs
fix-perms:
	sudo chown -R $$(whoami):$$(whoami) .
