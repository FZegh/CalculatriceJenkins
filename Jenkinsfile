pipeline {
    agent any

    stages {
        stage('Cloner le code') {
            steps {
                // On clone le repo Github
                git branch: 'main', url: 'https://github.com/copeihsinoc/CalculatriceJenkins'
            }
        }

        stage('Construire et tester') {
            steps {
                // Construire l'image Docker
                bat "docker build --no-cache -t calculatrice-${env.BUILD_ID} ."

                // Lancer un container temporaire pour les tests
                bat "docker run --name calculatrice-test-${env.BUILD_ID} -d -p 8082:8080 calculatrice-${env.BUILD_ID} npx http-server -p 8080"

                // Exécuter les tests à l'intérieur du container
                bat "docker exec calculatrice-test-${env.BUILD_ID} node test_calculatrice.js"

                // Stopper et supprimer le container de test
                bat "docker rm -f calculatrice-test" || true
            }
        }

        stage('Déployer en production') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    // Poser la question à l'utilisateur
                    def userInput = input(message: 'Voulez-vous déployer en production ?', parameters: [
                        choice(name: 'CHOIX', choices: ['Oui', 'Non'], description: 'Choisissez')
                    ])

                    if (userInput['CHOIX'] == 'Oui') {
                        echo "🚀 Déploiement en cours..."

                        // Supprimer un ancien container prod s’il existe
                        bat(script: 'docker rm -f calculatrice-prod', returnStatus: true)

                        // Lancer l’appli en prod (juste le serveur statique)
                        bat "docker run -d -p 8081:8080 --name calculatrice-prod calculatrice-${env.BUILD_ID} npx http-server -p 8080"
                    } else {
                        echo "Déploiement annulé par l'utilisateur."
                    }
                }
            }
        }
    }
}
