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
                bat "docker rm -f calculatrice-test || true"
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

                    def choix = userInput.get('CHOIX')
                    if ("Oui".equals(choix)) {
                        echo "🚀 Déploiement en cours..."

                        // Supprimer l'ancien container prod s’il existe
                        bat "docker rm -f calculatrice-prod || true"

                        // Lancer le container prod avec port dynamique
                        try {
                            def containerId = bat(script: "docker run -d -P --name calculatrice-prod calculatrice", returnStdout: true).trim()
                            def portMapping = bat(script: "docker port ${containerId} 8080", returnStdout: true).trim()
                            echo "✅ Déploiement terminé. Accessible sur : ${portMapping}"
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
