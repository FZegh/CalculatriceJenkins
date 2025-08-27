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
                bat "docker build --no-cache -t calculatrice ."

              // Stopper et supprimer le container de test
               bat "docker rm -f calculatrice-test"

                 // Lancer un container temporaire pour les tests
                bat "docker run -d --name calculatrice-test calculatrice"
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

                    if (userInput.CHOIX == 'Oui') {
                        echo "🚀 Déploiement en cours..."

                        // Supprimer un ancien container prod s’il existe
                        bat 'docker rm -f calculatrice-prod || true'

                        // Lancer l’appli en prod (juste le serveur statique)
                        bat "docker run -d --name calculatrice-prod -p 8081:8080 calculatrice"
                    } else {
                        echo "Déploiement annulé par l'utilisateur."
                    }
                }
            }
        }
    }
}
