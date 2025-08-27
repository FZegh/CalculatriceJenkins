pipeline {
    agent any

    stages {
        stage('Cloner le code') {
            steps {
                git branch: 'main', url: 'https://github.com/copeihsinoc/CalculatriceJenkins'
            }
        }

        stage('Construire et tester') {
            steps {
                bat "docker build --no-cache -t calculatrice ."
                bat "docker rm -f calculatrice-test"
                bat "docker run -d --name calculatrice-test calculatrice"
            }
        }

        stage('Déployer en production') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    def userInput = input(message: 'Voulez-vous déployer en production ?', parameters: [
                        choice(name: 'CHOIX', choices: ['Oui', 'Non'], description: 'Choisissez')
                    ])

                    if ("Oui".equals(userInput)) {
                        echo "🚀 Déploiement en cours..."
                        bat 'docker rm -f calculatrice-prod || true'

                        try {
                            bat "docker run -d --name calculatrice-prod -p 8081:8080 calculatrice"
                        } catch (err) {
                            echo "❌ Déploiement échoué : ${err}"
                            currentBuild.result = 'FAILURE'
                        }

                    } else {
                        echo "Déploiement annulé par l'utilisateur."
                    }
                } // ferme script
            }
        }
    }
}
