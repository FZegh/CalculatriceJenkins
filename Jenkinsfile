pipeline {
    agent any

    stages {
        stage('Cloner le code') {
            steps {
                git branch: 'main', url: 'https://github.com/FZegh/CalculatriceJenkins'
                // Cloner le repo Github
            }
        }

        stage('Construire et tester') {
            steps {
                script {
                    // Construire l'image Docker
                    bat "docker build --no-cache -t calculatrice:${env.BUILD_ID} ."

                    // Supprimer le container de test s’il existe
                    bat "docker rm -f calculatrice-test || true"

                    // Lancer le container temporaire pour les tests
                    bat "docker run --rm calculatrice:${env.BUILD_ID}"
                } // ferme script
            } // ferme steps
        } // ferme stage

        stage('Déployer en production') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                 // Pause pour demander confirmation à l'utilisateur
                 input message: 'Les tests ont réussi. Voulez-vous déployer en production ?', ok: 'Oui'
                script {
                   

                    echo "🚀 Déploiement en cours..."

                    // Supprimer l'ancien container prod s’il existe
                    bat "docker rm -f calculatrice-prod || true"

                    // Lancer le container prod
                    try {
                        bat "docker run -d -p 8081:8080 --name calculatrice-prod calculatrice:${env.BUILD_ID} npx http-server -p 8080"
                        echo "✅ Déploiement terminé avec succès sur le port 8081"
                    } catch (err) {
                        echo "❌ Déploiement échoué : ${err}"
                        currentBuild.result = 'FAILURE'
                        error("Arrêt du pipeline car le déploiement a échoué")
                    }
                } // ferme script
            } // ferme steps
        } // ferme stage
    } // ferme stages
} // ferme pipeline
